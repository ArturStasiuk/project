<?php 
class MODULES_ACCESS_TOOLS{
    private $access_tools;// obiekt klasy ACCESS_TOOLS do obslugi tabeli access_tools
    private $param;// parametry przekazane z zapytania vendor 
    private $method;// obiekt klasy METHOD do sprawdzania dostepu do narzedzi
    private $pdo;// obiekt klasy PDO do polaczenia z baza danych

    public function __construct($pdo, $method, $access_tools, $param)
    {
        $this->pdo = $pdo;
        $this->method = $method;
        $this->access_tools = $access_tools;
        $this->param = $param;
    }

    // pobranie pojedynczego rekordu z tabeli access_tools dla zalogowanego uzytkownika i konkretnego narzedzia
    public function getAccessTools()
    {
       $tools = $this->param['tools'] ?? null;
       if ($tools === null) {
           return ['status' => false, 'message' => 'Tool name not specified'];
       }
       $access = $this->method->getAccessTools(['tools' => $tools]);
       return $access;
    }

}


?>