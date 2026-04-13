<?php
class TABLES {
    
 public function __construct()
    {
        
    }

 // Funkcja do pobierania nazw tabel z bazy danych
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

 // funkcja do pobierania metadanych tabeli 
    public function getTableMeta($pdo, $tableName){
        $sql = "DESCRIBE `$tableName`";
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