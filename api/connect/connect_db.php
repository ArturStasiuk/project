<?php 
/**
 * Klasa CONNECT – zarządza połączeniem z bazą danych MySQL przez PDO.
 * Odpowiada za nawiązanie połączenia, jego zamknięcie oraz sprawdzenie statusu.
 */
class CONNECT {

    public function __construct()
    {
    }

    /**
     * Nawiązuje połączenie z bazą danych na podstawie tablicy konfiguracyjnej.
     * @param array $dataConfig Tablica z kluczami: host, database, user, password.
     * @return PDO|false Obiekt PDO przy sukcesie lub false przy błędzie.
     */
    public function connect($dataConfig)
    {
        try {
            $dsn = "mysql:host=" . $dataConfig['host'] . ";dbname=" . $dataConfig['database'] . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, $dataConfig['user'], $dataConfig['password'], $options);
            return $pdo;
        } catch (PDOException $e) {
            return false;
        }
    }

    /**
     * Zamyka połączenie z bazą danych przez ustawienie referencji na null.
     * PDO nie wymaga jawnego zamknięcia – wystarczy usunąć wszystkie referencje.
     * @param PDO|null &$conn Referencja do obiektu PDO (ustawiana na null).
     */
    public function disconnect(&$conn)
    {
        $conn = null;
    }

    /**
     * Sprawdza, czy przekazane połączenie jest aktywne.
     * @param PDO|null $conn Obiekt PDO lub null.
     * @return array|null ['status' => true] gdy połączenie istnieje, null w przeciwnym razie.
     */
    public function getConnectInfo($conn)
    {
        if ($conn) {
            return [
                'status' => true,
            ];
        }
        return null;
    }
}
