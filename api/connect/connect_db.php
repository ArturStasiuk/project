<?php 
// Ten plik zawiera klasę CONNECT, która jest odpowiedzialna za zarządzanie połączeniem z bazą danych.
// Klasa ta posiada metody do nawiązywania i zamykania połączenia
class CONNECT {


    public function __construct()
     {
      
     }

    public function connect($dataConfig)
    {
      try {
        $dsn = "mysql:host=" . $dataConfig['host'] . ";dbname=" . $dataConfig['database'] . ";charset=utf8mb4";
        $options = [
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
          PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $pdo = new PDO($dsn, $dataConfig['user'], $dataConfig['password'], $options);
        return $pdo;
      } catch (PDOException $e) {
        return false;
      }
    }
 
    public function disconnect($conn)
    {
      if ($conn) {
        // PDO nie wymaga jawnego zamykania połączenia, wystarczy ustawić na null
        $conn = null;
      }
    }


  public function getConnectInfo($conn)
   {
    if ($conn) {
        return [
            'status' => true,
        ];
    }
    return null;
  }


  
}
