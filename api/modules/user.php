<?php // logowanie wylogowywanie rejestracja itd. - wszystko co zwiazane z uzytkownikami
class USER  // 
{
    private $pdo;
    private $session;
    private $users;
    private $access_tables;
    private $company_users;
    private $company;
    private $params;

    public function __construct($pdo, $session, $users, $access_tables,    $company_users, $company, $params) {
        $this->pdo = $pdo;
        $this->session = $session;
        $this->users = $users;
        $this->access_tables = $access_tables;
        $this->company_users = $company_users;
        $this->company = $company;
        $this->params = $params;
    }

    // logowanie uzytkownika ;
    public function loginUsers(){
       // sprawdzenie czy uzytkownik nie jest juz zalogowany
         if($this->checkLoggedIn()){
              return ['status' => true, 'message' => 'User is already logged in'];
         }
      // sprawdzenie czy email i haslo sa przekazane
      if(!$this->checkEmailParam() || !$this->checkPasswordParam()){
          return ['status' => false, 'message' => 'Email and password are required'];
      }
      // sprawdzenie poprawności adresu email
      if (!$this->checkEmailCorrect()) {
          return ['status' => false, 'message' => 'No valid email address'];
      }
      // sprawdzenie czy haslo ma co najmniej 4 znaki
      if (!$this->checkPasswordLength()) {
          return ['status' => false, 'message' => 'Password must be at least 4 characters long'];
      }
      // sprawdzenie czy uzytkownik istnieje w bazie danych
      $user = $this->users->checkUserExistsByEmail($this->pdo, $this->params['email']);

        if (!$user) {
            return ['status' => false, 'message' => 'User with this email does not exist'];
        }
      // sprawdzenie czy uzytkownik o podanym email ma aktywne konto
        $active = $this->users->checkUserActiveByEmail($this->pdo, $this->params['email']);
        if (!$active) {
            return ['status' => false, 'message' => 'User account is not active'];
        }
      // sprawdzenie poprawnosci hasla dla uzytkownika o podanym emailu
        $passwordValid = $this->users->checkPasswordByEmail($this->pdo, $this->params['email'], $this->params['password']);
        if (!$passwordValid) {
            return ['status' => false, 'message' => 'Incorrect password'];
        }  
        // pobranie id uzytkownika po emailu
        $userId = $this->users->getUserIdByEmail($this->pdo, $this->params['email']);
        // pobierz dane uzytkownika po id bez hasla
        $userData = $this->users->getUserDataById($this->pdo, $userId);
        // ustawienie danych uzytkownika w sesji
        $this->session->setKey('id_users', $userData['id']);
        $this->session->setKey('role', $userData['role']);
        $this->session->setKey('name', $userData['name']);
        $this->session->setKey('last_name', $userData['last_name']);
        $this->session->setKey('email', $userData['email']);
        $this->session->setKey('active', $userData['active']);
        $this->session->setKey('lang', $userData['lang'] ?? 'Svenska');
        // pobranie id_company z tabeli company_users dla zalogowanego uzytkownika jezeli istnieje 
        $companyId = $this->company_users->getCompanyIdUsers($this->pdo, $userData['id']);
        if ($companyId['status']) {
            $this->session->setKey('company_id', $companyId['data']);
            $companyData = $this->company->getCompanyData($this->pdo, $companyId['data']);
            if ($companyData['status']) {
                $this->session->setKey('company_name', $companyData['data']['name']);
            } else {
                $this->session->setKey('company_name', null);
            }

        } else {
            $this->session->setKey('company_id', null);
            $this->session->setKey('company_name', null);
        }





       return ['status' => true,'message' => 'User logged in successfully','session' => $this->session->getSession()]; 
    }


    // dodawanie uzytkownika do bazy danych narazie bez kontroli czy zalogowany uzytkownik moze dadawac rekordy i czy id firmy jest przekazane i czy jest aktywna 
    public function registerUser(){
        

        // sprawdzenie czy email i haslo sa przekazane
        if(!$this->checkEmailParam() || !$this->checkPasswordParam()){
            return ['status' => false, 'message' => 'Email and password are required'];
        }
        // sprawdzenie poprawności adresu email
        if (!$this->checkEmailCorrect()) {
            return ['status' => false, 'message' => 'No valid email address'];
        }
        // sprawdzenie czy haslo ma co najmniej 4 znaki
        if (!$this->checkPasswordLength()) {
            return ['status' => false, 'message' => 'Password must be at least 4 characters long'];
        }
      // sprawdznie czy uzytkownik o podanym emailu juz istnieje w bazie danych
      $userExists = $this->users->checkUserExistsByEmail($this->pdo, $this->params['email']);
      if ($userExists) {
          return ['status' => false, 'message' => 'User with this email already exists'];
      }

      // przygotuj opcjonalne parametry
      $name = isset($this->params['name']) ? $this->params['name'] : null;
      $last_name = isset($this->params['last_name']) ? $this->params['last_name'] : null;
      $role = isset($this->params['role']) ? $this->params['role'] : null;
      $active = isset($this->params['active']) ? $this->params['active'] : 1;

      // dodanie uzytkownika do bazy danych z dodatkowymi polami
      $addUser = $this->users->addUser($this->pdo, $this->params['email'], $this->params['password'], $name, $last_name, $role, $active);
      if ($addUser) {
          return ['status' => true, 'message' => 'User registered successfully'];
      } else {
          return ['status' => false, 'message' => 'Error registering user'];    
      }




    }

    // wylogowywanie uzytkownika
    public function logoutUsers(){
        // sprawdzenie czy uzytkownik jest zalogowany
        if(!$this->checkLoggedIn()){
            return ['status' => false, 'message' => 'User is not logged in'];
        }
        // usuniecie danych uzytkownika z sesji
        $this->session->destroy();
        return ['status' => true, 'message' => 'User logged out successfully'];
    }


   
    // sprawdzenie czy uzytkownik jest zalogowany
   private function checkLoggedIn(){
    $id_users = $this->session->getKey('id_users');
    if($id_users == null){
        return false;
    }
    return true;
   }
   private function checkEmailParam(){
    if(!isset($this->params['email'])){
        return false;
    }
    return true;
   }
   private function checkPasswordParam(){
    if(!isset($this->params['password'])){
        return false;
    }
    return true;
   }
   private function checkEmailCorrect(){
    if (!filter_var($this->params['email'], FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    return true;
   }
   private function checkPasswordLength(){
    if (strlen($this->params['password']) < 4) {
        return false;
    }
    return true;
   }

   //
}