
<?php
class SESSION {
   // public $logIn;

    public function __construct()
    {
        session_start();
      // $this->logIn = null; 
    }


    // sprawdzenie czy sesja jest aktywna
    public function isActive()
     {
        return session_status() === PHP_SESSION_ACTIVE;
    }

    // ustawienie klucza w sesji
    public function setKey($key, $value)
     {
        $_SESSION[$key] = $value;
    }
    // pobranie klucza z sesji
    public function getKey($key)
     {
        return $_SESSION[$key] ?? null;
    }
    // usunięcie klucza z sesji
    public function deleteKey($key)
     {
        unset($_SESSION[$key]);
    }
    // pobranie całej sesji
    public function getSession()
     {
        return $_SESSION;
    }
    // zniszczenie sesji
    public function destroy()
    {
        session_destroy();
       
    }

}