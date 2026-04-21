<?php // konfiguracja polaczenia z baza danych 
class CONFIG_DB {
	private $host = 'localhost';
	private $user = 'root';
	private $password = '';
	private $database = 'project';
    public function __construct()
        {
        
        }   
    public function getConfig() {
        return [
            'host' => $this->host,
            'user' => $this->user,
            'password' => $this->password,
            'database' => $this->database
        ];
    }


}

