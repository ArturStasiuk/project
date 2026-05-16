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

    public function getUsersData(): int
    {
        $data=15;
        return $data;
    }




}