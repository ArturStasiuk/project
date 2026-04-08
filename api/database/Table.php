<?php

namespace App\Database;

/**
 * Obsługuje metadane tabel bazy danych.
 */
class Table
{
    /**
     * Zwraca listę nazw tabel w bieżącej bazie danych.
     *
     * @return array{status: bool, tables?: list<string>, error?: string}
     */
    public function getTablesName(\mysqli $conn): array
    {
        $result = $conn->query('SHOW TABLES');
        if (!$result) {
            return ['status' => false, 'error' => 'Error fetching tables: ' . $conn->error];
        }

        $tables = [];
        while ($row = $result->fetch_array()) {
            $tables[] = $row[0];
        }

        return ['status' => true, 'tables' => $tables];
    }

    /**
     * Zwraca metadane kolumn wskazanej tabeli.
     * Używa information_schema zamiast DESCRIBE, aby uniknąć SQL injection.
     *
     * @return array{status: bool, meta?: list<array<string, mixed>>, error?: string}
     */
    public function getTableMeta(\mysqli $conn, string $tableName): array
    {
        $sql  = 'SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA
                 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
                 ORDER BY ORDINAL_POSITION';
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            return ['status' => false, 'error' => 'Failed to prepare statement'];
        }

        $stmt->bind_param('s', $tableName);
        $stmt->execute();
        $result = $stmt->get_result();
        $meta   = [];
        while ($row = $result->fetch_assoc()) {
            $meta[] = $row;
        }
        $stmt->close();

        return ['status' => true, 'meta' => $meta];
    }
}
