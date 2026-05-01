<?php 
class MODULES_ACCESS_TOOLS{
    private $access_tools;// obiekt klasy ACCESS_TOOLS do obslugi tabeli access_tools
    private $param;// parametry przekazane z zapytania vendor 
    
    private $method;// obiekt klasy METHOD do sprawdzania dostepu do narzedzi
    private $pdo;// obiekt klasy PDO do polaczenia z baza danych
    public function __construct($pdo,$access_tools,$method, $param)
    {
        $this->pdo = $pdo;
        $this->access_tools = $access_tools;
        $this->method = $method;
        $this->param = $param;
    }

    // pobranie pojedynczego rekordu z tabeli access_tools dla id_users i tools_name
    public function getAccessTools()
    {
       return ['status' => $this->param ];
    }

}


?>