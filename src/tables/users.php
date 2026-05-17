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

   




    
    public function getAdminSystem(): array{


        return [
            'status' => true,
            'message' => 'pobrano dane z tabeli users',
            'data' => $this->data,
        ];
    }
    



}