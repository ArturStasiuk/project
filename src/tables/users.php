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

   




    
    public function getUsers(): array{


        return [
            'status' => true,
            'message' => 'Access granted',
            'data' => $this->data,
        ];
    }




}