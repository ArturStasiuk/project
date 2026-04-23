<?php

declare(strict_types=1);

namespace App\Connect;

use PDO;
use PDOException;

/**
 * Connect – zarządza połączeniem z bazą danych MySQL przez PDO.
 *
 * Używany we wszystkich miejscach aplikacji wymagających dostępu do bazy.
 * Wszystkie opcje PDO są ustawiane tak, by zapewnić:
 *  - rzucanie wyjątków przy błędach (ERRMODE_EXCEPTION)
 *  - pobieranie wyników jako tablice asocjacyjne (FETCH_ASSOC)
 *  - wyłączenie emulacji prepared statements (bezpieczeństwo)
 */
class Connect
{
    /**
     * Nawiązuje połączenie z bazą danych na podstawie tablicy konfiguracyjnej.
     *
     * @param array{host: string, database: string, user: string, password: string} $config
     * @return PDO|false Obiekt PDO przy sukcesie lub false przy błędzie połączenia.
     */
    public function connect(array $config): PDO|false
    {
        try {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=utf8mb4',
                $config['host'],
                $config['database']
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            return new PDO($dsn, $config['user'], $config['password'], $options);
        } catch (PDOException) {
            return false;
        }
    }

    /**
     * Zamyka połączenie z bazą danych przez ustawienie referencji na null.
     *
     * PDO nie wymaga jawnego zamknięcia – wystarczy usunąć wszystkie referencje.
     *
     * @param PDO|null $conn Referencja do obiektu PDO (ustawiana na null).
     */
    public function disconnect(?PDO &$conn): void
    {
        $conn = null;
    }

    /**
     * Sprawdza, czy przekazane połączenie jest aktywne.
     *
     * @param PDO|null $conn Obiekt PDO lub null.
     * @return array{status: true}|null ['status' => true] gdy połączenie istnieje, null w przeciwnym razie.
     */
    public function getConnectInfo(?PDO $conn): ?array
    {
        return $conn ? ['status' => true] : null;
    }
}
