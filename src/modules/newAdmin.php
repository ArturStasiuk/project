<?php
declare(strict_types=1);

/**
 * Pierwsze uruchomienie: gdy baza `project` istnieje, tabela `users` jest pusta,
 * tworzony jest pierwszy administrator (haslo jak w sp_login_user: SHA-256 hex).
 *
 * Rozszerzenia (np. access_tables, company_users): dopisz INSERT-y w seed_default_permissions().
 */

const BOOTSTRAP_ADMIN_EMAIL = 'admin@admin.pl';
const BOOTSTRAP_ADMIN_PASSWORD = 'admin@admin';

/**
 * @return array{action: 'none'|'first_user_created'|'error', message?: string}
 */
function bootstrap_first_system_admin(): array
{
    $cfg = require __DIR__ . '/../connect/database_config.php';
    $dbName = $cfg['name'];

    $root = @new mysqli($cfg['host'], $cfg['user'], $cfg['pass']);
    if ($root->connect_error) {
        return [
            'action' => 'error',
            'message' => 'MySQL: ' . $root->connect_error,
        ];
    }

    $root->set_charset('utf8mb4');

    $stmt = $root->prepare('SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ? LIMIT 1');
    if ($stmt === false) {
        $root->close();
        return ['action' => 'error', 'message' => 'Blad przy sprawdzaniu bazy danych.'];
    }
    $stmt->bind_param('s', $dbName);
    $stmt->execute();
    $exists = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($exists === null) {
        $root->close();
        return [
            'action' => 'error',
            'message' => 'Baza danych "' . $dbName . '" nie istnieje. Utworz ja i zaimportuj schemat (np. doc/tableSQL.sql).',
        ];
    }

    if (!$root->select_db($dbName)) {
        $root->close();
        return ['action' => 'error', 'message' => 'Nie mozna wybrac bazy "' . $dbName . '".'];
    }

    $t = $root->prepare(
        'SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = ? AND table_name = ?'
    );
    if ($t === false) {
        $root->close();
        return ['action' => 'error', 'message' => 'Blad przy sprawdzaniu tabeli users.'];
    }
    $tn = 'users';
    $t->bind_param('ss', $dbName, $tn);
    $t->execute();
    $hasUsersTable = (int) ($t->get_result()->fetch_assoc()['c'] ?? 0) > 0;
    $t->close();

    if (!$hasUsersTable) {
        $root->close();
        return [
            'action' => 'error',
            'message' => 'Tabela users nie istnieje. Zaimportuj schemat SQL (np. doc/tableSQL.sql).',
        ];
    }

    $cntRes = $root->query('SELECT COUNT(*) AS c FROM `users`');
    if ($cntRes === false) {
        $root->close();
        return ['action' => 'error', 'message' => 'Nie mozna odczytac tabeli users.'];
    }
    $userCount = (int) ($cntRes->fetch_assoc()['c'] ?? 0);
    if ($userCount > 0) {
        $root->close();
        return ['action' => 'none'];
    }

    $passwordHash = hash('sha256', BOOTSTRAP_ADMIN_PASSWORD);

    $root->begin_transaction();
    try {
        $ins = $root->prepare(
            'INSERT INTO `users` (`role`, `name`, `last_name`, `login`, `email`, `password`, `active`, `lang`)
             VALUES (\'admin system\', ?, ?, NULL, ?, ?, 1, \'English\')'
        );
        if ($ins === false) {
            throw new RuntimeException($root->error);
        }
        $first = 'Administrator';
        $last = 'System';
        $email = BOOTSTRAP_ADMIN_EMAIL;
        $ins->bind_param('ssss', $first, $last, $email, $passwordHash);
        if (!$ins->execute()) {
            if ($root->errno === 1062) {
                $root->rollback();
                $ins->close();
                $root->close();
                return ['action' => 'none'];
            }
            throw new RuntimeException($ins->error ?: $root->error);
        }
        $newId = (int) $root->insert_id;
        $ins->close();

        seed_default_permissions($root, $newId);

        $root->commit();
    } catch (Throwable $e) {
        $root->rollback();
        $root->close();
        return [
            'action' => 'error',
            'message' => 'Nie udalo sie utworzyc pierwszego uzytkownika: ' . $e->getMessage(),
        ];
    }

    $root->close();

    return [
        'action' => 'first_user_created',
        'message' => 'Utworzono pierwszego uzytkownika systemu.\n\nE-mail: ' . BOOTSTRAP_ADMIN_EMAIL
            . '\nHaslo: ' . BOOTSTRAP_ADMIN_PASSWORD
            . '\n\nZmien haslo po pierwszym zalogowaniu.',
    ];
}

/**
 * Domyslne uprawnienia do modulow (access_tools).
 * Dopisz tu INSERT-y do innych tabel wedlug potrzeb.
 *
 * @param mysqli $conn Polaczenie z wybrana baza (transakcja juz otwarta).
 */
function seed_default_permissions(mysqli $conn, int $idUser): void
{
    $hasAccessTools = table_exists($conn, 'access_tools');
    if (!$hasAccessTools) {
        return;
    }

    $tools = [
        ['admin_company', 1, 1, 1, 1, 1],
        ['admin_system', 1, 1, 1, 1, 1],
    ];

    $st = $conn->prepare(
        'INSERT INTO `access_tools`
        (`id_users`, `tools_name`, `access_tools`, `read_tools`, `add_tools`, `delete_tools`, `update_tools`)
        VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    if ($st === false) {
        throw new RuntimeException($conn->error);
    }

    foreach ($tools as $row) {
        [$name, $at, $rt, $ad, $del, $up] = $row;
        $st->bind_param('isiiiii', $idUser, $name, $at, $rt, $ad, $del, $up);
        if (!$st->execute()) {
            throw new RuntimeException($st->error ?: $conn->error);
        }
    }
    $st->close();
}

function table_exists(mysqli $conn, string $table): bool
{
    $t = $conn->real_escape_string($table);
    $r = $conn->query("SHOW TABLES LIKE '{$t}'");

    return $r !== false && $r->num_rows > 0;
}
