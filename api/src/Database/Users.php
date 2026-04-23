<?php

declare(strict_types=1);

namespace App\Database;

use PDO;

/**
 * Users – obsługuje operacje CRUD na tabeli `users`.
 *
 * Wszystkie zapytania SQL korzystają z prepared statements,
 * co chroni przed SQL injection.
 */
class Users
{
    /**
     * Sprawdza, czy użytkownik o podanym adresie e-mail istnieje w bazie.
     *
     * @param PDO    $pdo   Aktywne połączenie PDO.
     * @param string $email Adres e-mail do sprawdzenia.
     * @return bool True, jeśli użytkownik istnieje.
     */
    public function checkUserExistsByEmail(PDO $pdo, string $email): bool
    {
        $stmt = $pdo->prepare('SELECT 1 FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        return $stmt->fetchColumn() !== false;
    }

    /**
     * Sprawdza, czy konto użytkownika o podanym e-mailu jest aktywne.
     *
     * @param PDO    $pdo   Aktywne połączenie PDO.
     * @param string $email Adres e-mail do sprawdzenia.
     * @return bool True, jeśli konto jest aktywne.
     */
    public function checkUserActiveByEmail(PDO $pdo, string $email): bool
    {
        $stmt = $pdo->prepare('SELECT active FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result && (int) $result['active'] === 1;
    }

    /**
     * Weryfikuje hasło użytkownika za pomocą password_verify().
     *
     * @param PDO    $pdo      Aktywne połączenie PDO.
     * @param string $email    Adres e-mail użytkownika.
     * @param string $password Hasło w postaci jawnej.
     * @return bool True, jeśli hasło jest poprawne.
     */
    public function checkPasswordByEmail(PDO $pdo, string $email, string $password): bool
    {
        $stmt = $pdo->prepare('SELECT password FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? password_verify($password, $result['password']) : false;
    }

    /**
     * Dodaje nowego użytkownika do bazy danych.
     *
     * Hasło jest hashowane przez password_hash() z algorytmem PASSWORD_DEFAULT.
     *
     * @param PDO         $pdo       Aktywne połączenie PDO.
     * @param string      $email     Adres e-mail (unikalny).
     * @param string      $password  Hasło w postaci jawnej (zostanie zahashowane).
     * @param string|null $name      Imię (opcjonalne).
     * @param string|null $lastName  Nazwisko (opcjonalne).
     * @param string|null $role      Rola (opcjonalne).
     * @param int         $active    1 – aktywne, 0 – nieaktywne (domyślnie 1).
     * @return bool True przy sukcesie.
     */
    public function addUser(
        PDO $pdo,
        string $email,
        string $password,
        ?string $name = null,
        ?string $lastName = null,
        ?string $role = null,
        int $active = 1
    ): bool {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sqlFields = 'email, password, active';
        $sqlValues = ':email, :password, :active';
        $values    = [':email' => $email, ':password' => $hashedPassword, ':active' => $active];

        if ($name !== null) {
            $sqlFields .= ', name';
            $sqlValues .= ', :name';
            $values[':name'] = $name;
        }
        if ($lastName !== null) {
            $sqlFields .= ', last_name';
            $sqlValues .= ', :last_name';
            $values[':last_name'] = $lastName;
        }
        if ($role !== null) {
            $sqlFields .= ', role';
            $sqlValues .= ', :role';
            $values[':role'] = $role;
        }

        $stmt = $pdo->prepare("INSERT INTO users ({$sqlFields}) VALUES ({$sqlValues})");
        return $stmt->execute($values);
    }

    /**
     * Zwraca ID użytkownika na podstawie adresu e-mail.
     *
     * @param PDO    $pdo   Aktywne połączenie PDO.
     * @param string $email Adres e-mail.
     * @return int|null ID użytkownika lub null, jeśli nie znaleziono.
     */
    public function getUserIdByEmail(PDO $pdo, string $email): ?int
    {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? (int) $result['id'] : null;
    }

    /**
     * Zwraca dane użytkownika (bez hasła) na podstawie jego ID.
     *
     * @param PDO $pdo Aktywne połączenie PDO.
     * @param int $id  ID użytkownika.
     * @return array<string, mixed>|false Tablica z danymi lub false.
     */
    public function getUserDataById(PDO $pdo, int $id): array|false
    {
        $stmt = $pdo->prepare(
            'SELECT id, role, name, last_name, email, active, lang FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Zwraca listę użytkowników należących do danej firmy.
     *
     * @param PDO $pdo       Aktywne połączenie PDO.
     * @param int $companyId ID firmy.
     * @return array<int, array<string, mixed>> Lista użytkowników.
     */
    public function getUsersByCompanyId(PDO $pdo, int $companyId): array
    {
        $stmt = $pdo->prepare(
            'SELECT u.id, u.role, u.name, u.last_name, u.email, u.active, u.lang
             FROM users u
             INNER JOIN company_users cu ON u.id = cu.id_users
             WHERE cu.id_company = :company_id'
        );
        $stmt->execute(['company_id' => $companyId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
