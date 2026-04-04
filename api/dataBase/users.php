<?php
class USERS
{
  

    public function __construct()
    {
  
    }

     

    public function loginUsers($conection, $email, $password){
        if (empty($email) || empty($password)) {
            return [
                'status' => false,
                'message' => 'Email and password are required'
            ];
        }
        $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password' AND active = 1";
        $result = $conection->query($sql);
        if ($result) {
             
            if ($result->num_rows > 0) {
                // pobranie danych uzytkownika 
                $user = $result->fetch_assoc();
                unset($user['password']); // usunięcie hasła przed zapisaniem sesji
                return [
                    'status' => true,
                    'message' => 'Login successful',
                    'data' => $user 
                ];
            } else {
                return [
                    'status' => false,
                    'message' => 'Invalid email or password'
                ];
            }
        } else {
            return [
                'status' => false,
                'error' => 'Error during login: ' . $conection->error
            ];
        }
    }

}