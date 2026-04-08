<?php
class USERS
{
  

    public function __construct()
    {
  
    }

     

    public function loginUsers($conection, $email, $password, $session ) {
        if (empty($email) || empty($password)) {
            if ($session) $session->destroy();
            return [
                'status' => false,
                'message' => 'Email and password are required'
            ];
        }
        $sql = "SELECT * FROM users WHERE email = '$email' AND active = 1";
        $result = $conection->query($sql);
        if ($result && $result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (isset($user['password']) && $user['password'] === $password) {
                unset($user['password']);
                if ($session) {
                    $session->setKey('logIn', true);
                    $session->setKey('id', $user['id']);
                    $session->setKey('email', $user['email']);
                    $session->setKey('name', $user['name']);
                    $session->setKey('last_name', $user['last_name'] ?? '');
                }
                return [
                    'status' => true,
                    'message' => 'Login successful',
                    'data' => $user
                ];
            }
        }
        if ($session) $session->destroy();
        return [
            'status' => false,
            'message' => 'Invalid email or password'
        ];
    }
    
    // funkcja do hashowania hasla przy rejestracji/logowania
    private function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }   
    
    public function registerUsers($conection, $email, $password, $name){
        if (empty($email) || empty($password) || empty($name)) {
            return [
                'status' => false,
                'message' => 'Email, password and name are required'
            ];
        }
        // sprawdzenie czy email jest juz zarejestrowany
        $sql = "SELECT * FROM users WHERE email = '$email'";
        $result = $conection->query($sql);
        if ($result && $result->num_rows > 0) {
            return [
                'status' => false,
                'message' => 'Email is already registered'
            ];
        }
        // hashowanie hasla przed zapisaniem do bazy
        $hashedPassword = $this->hashPassword($password);
        // zapisanie uzytkownika do bazy
        $sql = "INSERT INTO users (email, password, name) VALUES ('$email', '$hashedPassword', '$name')";
        if ($conection->query($sql) === TRUE) {
            return [
                'status' => true,
                'message' => 'Registration successful'
            ];
        } else {
            return [
                'status' => false,
                'error' => 'Error during registration: ' . $conection->error
            ];
        }
    }





}