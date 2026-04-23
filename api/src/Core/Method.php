<?php

declare(strict_types=1);

namespace App\Core;

use App\Config\ConfigDb;
use App\Connect\Connect;
use App\Database\AccessTables;
use App\Service\Session;
use App\Service\Tools;
use App\Database\AccessTools;
use PDO;

/**
 * Method – zestaw metod lokalnych API, wywoływanych bez wskazania modułu.
 *
 * Każda metoda publiczna/prywatna może być wywołana przez Router,
 * gdy żądanie zawiera tylko klucz `method` (bez `modules`).
 *
 * Nowe metody globalne API należy dodawać tutaj.
 */
class Method
{
    /**
     * Wywołuje metodę na podstawie jej nazwy.
     *
     * @param string $methodName Nazwa metody do wywołania.
     * @param mixed  $param      Parametry przekazane z żądania (opcjonalne).
     * @return array<string, mixed>
     */
    public function call(string $methodName, mixed $param = null): array
    {
        if (!method_exists($this, $methodName)) {
            return ['status' => false, 'message' => 'Method not found'];
        }
        return $this->$methodName($param);
    }

    // =========================================================================
    // Metody dostępne przez API
    // =========================================================================

    /**
     * Nawiązuje połączenie z bazą danych i zwraca obiekt PDO.
     *
     * @param mixed $param Nieużywany – zachowany dla spójności interfejsu call().
     * @return array{status: bool, pdo?: PDO, message?: string}
     */
    public function getDatabaseConnect(mixed $param = null): array
    {
        $config  = new ConfigDb();
        $connect = new Connect();
        $pdo     = $connect->connect($config->getConfig());

        if ($pdo === false) {
            return ['status' => false, 'message' => 'Database connection failed'];
        }

        return ['status' => true, 'pdo' => $pdo];
    }

    /**
     * Sprawdza, czy użytkownik jest aktualnie zalogowany (ma klucz id_users w sesji).
     *
     * @param mixed $param Nieużywany.
     * @return array{loggedIn: bool}
     */
    public function checkLoggedIn(mixed $param = null): array
    {
        $session = new Session();
        return ['loggedIn' => $session->getKey('id_users') !== null];
    }

    /**
     * Zwraca język przypisany do zalogowanego użytkownika.
     *
     * @param mixed $param Nieużywany.
     * @return array{lang: string}
     */
    public function getUserLanguage(mixed $param = null): array
    {
        $session = new Session();
        return ['lang' => $session->getKey('lang') ?? 'English'];
    }

    /**
     * Zwraca uprawnienia zalogowanego użytkownika do wskazanej tabeli.
     *
     * @param array{tables?: string}|mixed $param Tablica z kluczem 'tables'.
     * @return array<string, mixed>
     */
    public function getAccessTables(mixed $param = null): array
    {
        if (empty($param) || !is_array($param)) {
            return ['status' => false, 'message' => 'No tables specified'];
        }

        $session = new Session();
        $userId  = $session->getKey('id_users');
        if (!$userId) {
            return ['status' => false, 'message' => 'User not logged in'];
        }

        $dbResult = $this->getDatabaseConnect();
        if (!$dbResult['status']) {
            return ['status' => false, 'message' => 'Database connection failed'];
        }

        $accessTables = new AccessTables();
        return $accessTables->getUserPermissionsTables($dbResult['pdo'], (int) $userId, $param['tables'] ?? null);
    }

    /**
     * Zwraca listę ścieżek/identyfikatorów wszystkich narzędzi dostępnych dla użytkownika.
     *
     * @param bool|mixed $param True, jeśli dołączyć narzędzia prywatne.
     * @return string[]
     */
    public function getAllTools(mixed $param = null): array
    {
        $session     = new Session();
        $tools       = new Tools();
        $accessTools = new AccessTools();

        $dbResult = $this->getDatabaseConnect();
        $userId   = $session->getKey('id_users');

        $userAccessTools = [];
        if ($dbResult['status'] && $userId) {
            $userAccessTools = $accessTools->getAccessToolsByUserId($dbResult['pdo'], (int) $userId);
        }

        return $tools->getAllTools((bool) $param, $userAccessTools);
    }

    /**
     * Zwraca zawartość głównego pliku JS prywatnego narzędzia.
     *
     * @param string|mixed $param Nazwa narzędzia (np. 'admin_system').
     * @return array{status: bool, content?: string, error?: string}
     */
    public function getPrivateToolContent(mixed $param = null): array
    {
        if (empty($param) || !is_string($param)) {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowy parametr'];
        }

        $toolName = basename($param);
        if ($toolName !== $param || $toolName === '' || $toolName === '.' || $toolName === '..') {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowa nazwa narzędzia'];
        }

        $privateDir = realpath(__DIR__ . '/../../../private/tools/');
        if (!$privateDir) {
            return ['status' => false, 'content' => null, 'error' => 'Katalog private/tools nie istnieje'];
        }

        $jsFilePath = $privateDir . '/' . $toolName . '/' . $toolName . '.js';
        $jsFileReal = realpath($jsFilePath);

        if (!$jsFileReal || !str_starts_with($jsFileReal, $privateDir . DIRECTORY_SEPARATOR)) {
            return ['status' => false, 'content' => null, 'error' => 'Plik nie istnieje lub niedozwolona ścieżka'];
        }

        if (!is_readable($jsFileReal)) {
            return ['status' => false, 'content' => null, 'error' => 'Brak dostępu do pliku'];
        }

        return ['status' => true, 'content' => file_get_contents($jsFileReal)];
    }

    /**
     * Zwraca zawartość konkretnego pliku JS z katalogu prywatnego narzędzia.
     *
     * @param string|mixed $param Ścieżka w formacie 'nazwa_narzedzia/plik.js'.
     * @return array{status: bool, content?: string, error?: string}
     */
    public function getPrivateToolFile(mixed $param = null): array
    {
        if (empty($param) || !is_string($param)) {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowy parametr'];
        }

        $parts = explode('/', $param, 2);
        if (count($parts) !== 2) {
            return ['status' => false, 'content' => null, 'error' => 'Oczekiwany format: narzedzie/plik.js'];
        }

        [$toolName, $fileName] = $parts;

        if (basename($toolName) !== $toolName || $toolName === '' || $toolName === '.' || $toolName === '..') {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowa nazwa narzędzia'];
        }

        if (basename($fileName) !== $fileName || $fileName === '' || $fileName === '.' || $fileName === '..') {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowa nazwa pliku'];
        }

        // Tylko pliki .js o bezpiecznej nazwie
        if (!preg_match('/^[a-zA-Z0-9_-]+\.js$/', $fileName)) {
            return ['status' => false, 'content' => null, 'error' => 'Dozwolone są tylko pliki .js o bezpiecznej nazwie'];
        }

        $privateDir = realpath(__DIR__ . '/../../../private/tools/');
        if (!$privateDir) {
            return ['status' => false, 'content' => null, 'error' => 'Katalog private/tools nie istnieje'];
        }

        $filePath = $privateDir . '/' . $toolName . '/' . $fileName;
        $fileReal = realpath($filePath);

        if (!$fileReal || !str_starts_with($fileReal . DIRECTORY_SEPARATOR, $privateDir . DIRECTORY_SEPARATOR)) {
            return ['status' => false, 'content' => null, 'error' => 'Plik nie istnieje lub niedozwolona ścieżka'];
        }

        if (!is_readable($fileReal)) {
            return ['status' => false, 'content' => null, 'error' => 'Brak dostępu do pliku'];
        }

        return ['status' => true, 'content' => file_get_contents($fileReal)];
    }
}
