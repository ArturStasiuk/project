<?php

declare(strict_types=1);

namespace App\Config;

/**
 * ConfigDb – przechowuje parametry połączenia z bazą danych.
 *
 * W środowisku produkcyjnym wszystkie wartości są ładowane z pliku .env
 * (przez vlucas/phpdotenv w index.php), dzięki czemu żadne poświadczenia
 * nie trafiają bezpośrednio do kodu źródłowego.
 */
class ConfigDb
{
    private string $host;
    private string $user;
    private string $password;
    private string $database;

    public function __construct()
    {
        $this->host     = (string) ($_ENV['DB_HOST']     ?? 'localhost');
        $this->user     = (string) ($_ENV['DB_USER']     ?? 'root');
        $this->password = (string) ($_ENV['DB_PASSWORD'] ?? '');
        $this->database = (string) ($_ENV['DB_NAME']     ?? 'project');
    }

    /**
     * Zwraca tablicę z parametrami połączenia.
     *
     * @return array{host: string, user: string, password: string, database: string}
     */
    public function getConfig(): array
    {
        return [
            'host'     => $this->host,
            'user'     => $this->user,
            'password' => $this->password,
            'database' => $this->database,
        ];
    }
}
