<?php

declare(strict_types=1);

namespace App\Database;

use PDO;

/**
 * AccessTables – obsługuje tabelę `access_tables`.
 *
 * Przechowuje uprawnienia użytkowników do poszczególnych tabel bazy danych:
 * odczyt, zapis, aktualizacja i usuwanie rekordów.
 */
class AccessTables
{
    /**
     * Pobiera uprawnienia użytkownika do wskazanej tabeli.
     *
     * @param PDO         $pdo       Aktywne połączenie PDO.
     * @param int         $userId    ID zalogowanego użytkownika.
     * @param string|null $tableName Nazwa tabeli do sprawdzenia (lub null).
     * @return array{
     *     status: bool,
     *     access_table: bool,
     *     add_record: bool,
     *     read_record: bool,
     *     update_record: bool,
     *     delete_record: bool
     * }
     */
    public function getUserPermissionsTables(PDO $pdo, int $userId, ?string $tableName): array
    {
        $empty = [
            'status'        => false,
            'access_table'  => false,
            'add_record'    => false,
            'read_record'   => false,
            'update_record' => false,
            'delete_record' => false,
        ];

        if ($tableName === null || $tableName === '') {
            return $empty;
        }

        $stmt = $pdo->prepare(
            'SELECT access_table, add_record, read_record, update_record, delete_record
             FROM access_tables
             WHERE id_users = :id_users AND tables = :table_name
             LIMIT 1'
        );
        $stmt->bindParam(':id_users',    $userId,    PDO::PARAM_INT);
        $stmt->bindParam(':table_name',  $tableName, PDO::PARAM_STR);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return $empty;
        }

        return [
            'status'        => true,
            'access_table'  => (bool) $row['access_table'],
            'add_record'    => (bool) $row['add_record'],
            'read_record'   => (bool) $row['read_record'],
            'update_record' => (bool) $row['update_record'],
            'delete_record' => (bool) $row['delete_record'],
        ];
    }
}
