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


    private function sprawdzSesje(): bool{
        if (isset($_SESSION['id'])) {
            return true;
        }
        exit (json_encode([
            'status' => false,
            'message' => false,
            'data' => null,
        ]));
    }



}