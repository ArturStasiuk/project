<?php
class USER
{
  

    public function __construct()
    {
  
    }
    
    public function getUserInfo($conection){
        $sql = "SELECT * FROM users";
        $result = $conection->query($sql);
        if ($result) {
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            return [
                'status' => true,
                'data' => $users
            ];
        } else {
            return [
                'status' => false,
                'error' => 'Error fetching users: ' . $conection->error
            ];
        }
    }

      



}