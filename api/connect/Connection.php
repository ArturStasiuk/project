<?php

namespace App\Connect;

/**
 * Obsługuje połączenie z bazą danych MySQL.
 */
class Connection
{
    private string $host;
    private string $user;
    private string $password;
    private string $database;

    public function __construct()
    {
        $config         = require __DIR__ . '/../../config.php';
        $db             = $config['database'];
        $this->host     = $db['host'];
        $this->user     = $db['user'];
        $this->password = $db['password'];
        $this->database = $db['database'];
    }

    public function connect(): \mysqli|false
    {
        try {
            mysqli_report(MYSQLI_REPORT_OFF);
            $conn = @new \mysqli($this->host, $this->user, $this->password, $this->database);
            if ($conn->connect_error) {
                return false;
            }
            return $conn;
        } catch (\mysqli_sql_exception $e) {
            return false;
        }
    }

    public function disconnect(\mysqli $conn): void
    {
        $conn->close();
    }

    public function getConnectionInfo(\mysqli $conn): array
    {
        return ['status' => true];
    }
}
