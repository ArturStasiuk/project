<?php
class TABLE {
 // Funkcja do pobierania nazw tabel z bazy danych
 public function getTablesName($conection){
    $sql = "SHOW TABLES";
    $result = $conection->query($sql);
    if ($result) {
        $tables = [];
        while ($row = $result->fetch_array()) {
            $tables[] = $row[0];
        }
        return [
            'status' => true,
             $tables
        ];
    } else {
        return [
            'status' => false,
            'error' => 'Error fetching tables: ' . $conection->error
        ];
    }
 }
// funkcja do pobierania metadanych tabeli 
    public function getTableMeta($conection, $tableName){
        $sql = "DESCRIBE $tableName";
        $result = $conection->query($sql);
        if ($result) {
            $meta = [];
            while ($row = $result->fetch_assoc()) {
                $meta[] = $row;
            }
            return [
                'status' => true,
                 $meta
            ];
        } else {
            return [
                'status' => false,
                'error' => 'Error fetching table meta: ' . $conection->error
            ];
        }
    }





}