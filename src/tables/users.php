<?php

class Users
{
       private mysqli $conn;
       private ?array $data;
  
   

    public function __construct( mysqli $conn, ?array $data = null)
    {   
        $this->conn = $conn;
        $this->data = $data;

      

    }
    public function getUsersData(): array{
        $id = $this->sprawdzSesje();
        if ($id === false) {
            return [
                'status' => false,
                'message' => 'No user session',
            ];
        }

        if (!$this->sprawdzAktywneKonto($id)) {
            return [
                'status' => false,
                'message' => 'Inactive account',
            ];
        }

        if (!$this->sprawdzDostep($id, 'users', 'access')) {
            return [
                'status' => false,
                'message' => 'No access to users table',
            ];
        }

        return [
            'status' => true,
            'message' => 'Access granted',
            'data' => $this->data,
        ];
    }


    // sprawdzenie czy jest sesja uzytkownika
    private function sprawdzSesje() {
        if (!isset($_SESSION['id'])) {
           return false ;
        }
        return (int)$_SESSION['id'];
    }
    // sprawdzenie czy uzytkownik ma aktywne konto
    private function sprawdzAktywneKonto(int $userId): bool{
    $stmt = $this->conn->prepare("SELECT 1 FROM users WHERE id = ? AND active = 1 LIMIT 1");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $stmt->store_result();
    $exists = $stmt->num_rows > 0;
    $stmt->close();
    return $exists;
    }

    /** sprawdz czy uzytkownik ma dostep do wykonania akcji na danej tabeli
     * @param int $userId - id uzytkownika
     * @param string $tableName - nazwa tabeli
     * @param string $action - nazwa akcji (np. 'read', 'add', 'update', 'delete', 'access')
     * @return bool - true jesli uzytkownik ma dostep, false w przeciwnym razie
     */
    private function sprawdzDostep(int $userId, string $tableName, string $action): bool{
     $mapaAkcji = [
        'access' => 'access_tables',
        'add'    => 'add_record',
        'read'   => 'read_record',
        'update' => 'update_record',
        'delete' => 'delete_record',
     ];

     if (!isset($mapaAkcji[$action])) {
        return false;
     }

     $kolumna = $mapaAkcji[$action];

     // Pobieramy cały wiersz, aby móc sprawdzić zarówno istnienie rekordu, jak i wartości kolumn
     $sql = "SELECT * FROM `access_tables` WHERE `id_users` = ? AND `tables` = ? LIMIT 1";

     if ($stmt = $this->conn->prepare($sql)) {
         $stmt->bind_param('is', $userId, $tableName);
         $stmt->execute();
         $result = $stmt->get_result();

         // 1. Sprawdzamy, czy w ogóle istnieje rekord dla tego użytkownika i tej tabeli
         if ($result->num_rows === 0) {
             $stmt->close();
             return false;
         }

         $row = $result->fetch_assoc();
         $stmt->close();

         // 2. Sprawdzamy, czy w kolumnie odpowiadającej akcji jest wartość 1
         // Rzutujemy na int dla pewności porównania (tinyint(1) wraca jako string/int)
         return (int)$row[$kolumna] === 1;
     }

     return false;
    }



}