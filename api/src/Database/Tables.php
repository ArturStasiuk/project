<?php

declare(strict_types=1);

namespace App\Database;

use PDO;

/**
 * Tables – obsługuje operacje na schemacie bazy danych.
 *
 * Umożliwia pobieranie listy tabel oraz metadanych (struktury kolumn)
 * wskazanej tabeli. Przydatne m.in. w narzędziach administracyjnych.
 */
class Tables
{
    /**
     * Pobiera nazwy wszystkich tabel w bieżącej bazie danych.
     *
     * @param PDO $pdo Aktywne połączenie PDO.
     * @return array{status: bool, tables?: string[], error?: string}
     */
    public function getTablesName(PDO $pdo): array
    {
        $stmt = $pdo->query('SHOW TABLES');
        if (!$stmt) {
            return ['status' => false, 'error' => 'Error fetching tables.'];
        }

        $tables = [];
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $tables[] = $row[0];
        }

        return ['status' => true, 'tables' => $tables];
    }

    /**
     * Pobiera strukturę kolumn (DESCRIBE) dla wskazanej tabeli.
     *
     * Nazwa tabeli jest walidowana wyrażeniem regularnym, aby zapobiec
     * SQL injection (DESCRIBE nie obsługuje parametrów PDO).
     *
     * @param PDO    $pdo       Aktywne połączenie PDO.
     * @param string $tableName Nazwa tabeli do opisania.
     * @return array{status: bool, meta?: array<int, array<string, mixed>>, error?: string}
     */
    public function getTableMeta(PDO $pdo, string $tableName): array
    {
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $tableName)) {
            return ['status' => false, 'error' => 'Invalid table name.'];
        }

        $stmt = $pdo->query("DESCRIBE `{$tableName}`");
        if (!$stmt) {
            return ['status' => false, 'error' => 'Error fetching table meta.'];
        }

        return ['status' => true, 'meta' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    }
}
