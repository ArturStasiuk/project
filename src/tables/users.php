<?php

class Users
{
       private mysqli $conn;
       private ?array $data;
  
   

    public function __construct(mysqli $conn, ?array $data = null)
    {   
        $this->conn = $conn;
        $this->data = $data;

      

    }
    public function getUsersData(): array{
        $this->sprawdzSesje();
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
    private function sprawdzAktywneKonto(): void{
     
    }



}