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

   




    
    public function read(): array{
   

        return [
            'status' => true,
            'message' => 'pobrano dane ',
            'data' => $this->data,
        ];
    }
    



}