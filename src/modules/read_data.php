<?php
$currentDir = __DIR__;
while ($currentDir !== dirname($currentDir) && !file_exists($currentDir . '/src/bootstrap.php')) {
    $currentDir = dirname($currentDir);
}
if (file_exists($currentDir . '/src/bootstrap.php')) {
    require_once $currentDir . '/src/bootstrap.php';
}
//===============================================================
class ReadData{
  private $conn;
    public function __construct()
    {
      $this->conn = require PATH_CONNECT;// polaczenie z baza danych    
    }

     // Wywołanie procedury składowanej z parametrami do pobrania rekordów
    public function get_records_by_value(string $table, string $column, string $value): array
    {
        $data = [];
        // Wywołanie procedury składowanej z parametrami do pobrania rekordów
        $stmt = $this->conn->prepare("CALL get_records_by_value(?, ?, ?)");
        $stmt->bind_param("sss", $table, $column, $value);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($result && $row = $result->fetch_assoc()) {
            $data[] = $row;
        }
         $stmt->close();
        // Czyszczenie pozostałych wyników procedury składowanej (wymagane w MySQLi)
        while ($this->conn->more_results() && $this->conn->next_result());

        return $data;
    }




}

return new ReadData();

