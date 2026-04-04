<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/session.php';
require_once __DIR__ . '/conect.php';
require_once __DIR__ . '/../dataBase/users.php';
class ROUTER {
    private $session;
    private $inputData=null;
    private $_function = null;
    private $conect;
    private $db;
    private $users;
    private $data;
   public function __construct()
    {

     $this->session = new SESSION();

       $this->db = new CONECT();
       $this->users = new USERS();
        $this->conect = $this->db->connect();
         if (!$this->conect) {
            echo json_encode(['status' => false, 'error' => 'Nie nawiązano połączenia z bazą danych']);
            exit;
         }
        
       $this->inputData = json_decode(file_get_contents('php://input'), true);
       $this->data = $this->inputData['data'] ?? null;
       $this->_function = $this->inputData['function'] ?? null;
         if($this->_function){
              if(method_exists($this, $this->_function)){
                $result = $this->{$this->_function}();
                echo json_encode($result);
                exit;
              }else{
                echo json_encode(['status'=> false,'error'=>'Function not found']);
                $this->db->disconnect($this->conect);
                exit;
              }
         }else{ // wywolanie bez podanej funkcji
             echo json_encode(['status'=> true,'message'=>'No function specified']);
             $this->db->disconnect($this->conect);
             exit;
         }
       echo json_encode(['status'=> false,'error'=>'Invalid request']);
       exit;
  }
   
    // sprawdzenie czy użytkownik jest zalogowany
   private function isLoggedIn()
    {
        return ['status' => true, 'loggedIn' => $this->session->getKey('logIn')];  
    }
   // sprawdzenie połączenia z bazą danych
   private function getConectInfo(){
        return ['status' => true, 'info' => $this->db->getConectInfo($this->conect)];
   }

    // logowanie użytkownika
    private function loginUsers(){
          $email = $this->data['email'] ?? null;
          $password = $this->data['password'] ?? null;
           $this->session->setKey('logIn', false);
          $odp =$this->users->loginUsers($this->conect, $email, $password);
          if($odp['status']!== true){
              $this->session->destroy();
              return [
                  'status' => false,
                  'message' => 'Login failed: '
              ];
          }
           else {
            $this->session->setKey('logIn', true);
            $this->session->setKey('id', $odp['data']['id']);
            $this->session->setKey('email', $odp['data']['email']);
            $this->session->setKey('name', $odp['data']['name']);
            $this->session->setKey('last_name', $odp['data']['last_name']);

              return [
                  'status' => true,
                  'message' => 'Login successful'
              ];
           }
         


    }
    // wylogowanie użytkownika
    private function logoutUsers(){
        $this->session->destroy();
        return [
            'status' => true,
            'message' => 'Logout successful'
        ];
    }



}

//-------------------------------------------   







//session_start();
// ustawienia nagłówków JSON i CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'error' => 'Only POST requests are allowed']);
    exit;
}

$router = new ROUTER();





