<?php
/**
 * Klasa CONFIG_DB – przechowuje dane konfiguracyjne połączenia z bazą danych.
 *
 * UWAGA BEZPIECZEŃSTWO: W środowisku produkcyjnym dane dostępowe (host, user,
 * password, database) powinny być przechowywane w zmiennych środowiskowych
 * (np. plik .env) lub w konfiguracji serwera, a NIE bezpośrednio w kodzie.
 */
class CONFIG_DB {
    private $host     = 'localhost';
    private $user     = 'root';
    /** @var string Hasło do bazy danych – w produkcji przenieść do zmiennych środowiskowych. */
    private $password = '';
    private $database = 'project';

    public function __construct()
    {
    }

    /**
     * Zwraca tablicę z parametrami połączenia.
     * @return array ['host', 'user', 'password', 'database']
     */
    public function getConfig() {
        return [
            'host'     => $this->host,
            'user'     => $this->user,
            'password' => $this->password,
            'database' => $this->database
        ];
    }
}

