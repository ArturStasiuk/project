<?php
/**
 * Klasa TABLES – obsługuje operacje na schemacie bazy danych:
 * pobieranie listy tabel oraz metadanych (struktury) wybranej tabeli.
 */
class TABLES {
    
    public function __construct()
    {
        
    }

    /**
     * Pobiera nazwy wszystkich tabel z bieżącej bazy danych.
     * @param PDO $pdo Połączenie z bazą danych.
     * @return array ['status' => bool, 'tables' => string[]]
     */
    public function getTablesName($pdo){
        $sql = "SHOW TABLES";
        $stmt = $pdo->query($sql);
        if ($stmt) {
            $tables = [];
            while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
                $tables[] = $row[0];
            }
            return [
                'status' => true,
                'tables' => $tables
            ];
        } else {
            return [
                'status' => false,
                'error' => 'Error fetching tables.'
            ];
        }
    }

    /**
     * Pobiera metadane (strukturę kolumn) dla podanej tabeli.
     * Nazwa tabeli jest weryfikowana względem listy istniejących tabel,
     * aby zapobiec SQL injection (DESCRIBE nie obsługuje parametrów PDO).
     * @param PDO    $pdo       Połączenie z bazą danych.
     * @param string $tableName Nazwa tabeli do opisania.
     * @return array ['status' => bool, 'meta' => array] lub ['status' => false, 'error' => string]
     */
    public function getTableMeta($pdo, $tableName){
        // Walidacja nazwy tabeli – tylko litery, cyfry i podkreślniki (brak SQL injection)
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $tableName)) {
            return [
                'status' => false,
                'error'  => 'Invalid table name.'
            ];
        }
        $sql = "DESCRIBE `{$tableName}`";
        $stmt = $pdo->query($sql);
        if ($stmt) {
            $meta = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $meta[] = $row;
            }
            return [
                'status' => true,
                'meta' => $meta
            ];
        } else {
            return [
                'status' => false,
                'error' => 'Error fetching table meta.'
            ];
        }
    }





}