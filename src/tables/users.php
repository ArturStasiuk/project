<?php

class Users
{
       private PDO $pdo;
       private ?array $data;
  
   

    public function __construct( PDO $pdo, ?array $data = null)
    {   
        $this->pdo = $pdo;
        $this->data = $data;

      

    }
    public function getUsersData(): array{
        $id = $this->sprawdzSesje();
        if (!$this->sprawdzAktywneKonto($id)) {
            exit (json_encode([
                'status' => false,
                'message' => 'Konto nieaktywne',
                'data' => null,
            ]));  
        }
        return [
            'status' => true,
            'message' => true,
            'data' => $this->data,
        ];
    }


    // sprawdzenie czy jest sesja uzytkownika
    private function sprawdzSesje():int{
        if (!isset($_SESSION['id'])) {
            exit (json_encode([
            'status' => false,
            'message' => false,
            'data' => null,
        ]));  
        }else{
            return $_SESSION['id'];
        }

    }
    // sprawdzenie czy uzytkownik ma aktywne konto
private function sprawdzAktywneKonto(int $userId): bool
{
    $stmt = $this->pdo->prepare("SELECT 1 FROM users WHERE id = :id AND active = 1 LIMIT 1");
    $stmt->execute(['id' => $userId]);
    return (bool) $stmt->fetchColumn();
}



}