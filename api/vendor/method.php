<?php
// Ten plik jest odpowiedzialny za dostarczanie klas METHOD do głównego vendor.php
class METHOD
{
    public function call(string $methodName, mixed $param = null): array
    {
        if (!method_exists($this, $methodName)) {
            return ['status' => false, 'message' => 'Method not found'];
        }

        // jeśli niektóre metody potrzebują param, możesz go przekazywać:
        return $this->$methodName($param);
    }

    /**
     * sprawdza czy uzytkownik jest zalogowany
     */
    private function checkLoggedIn(mixed $param = null): array
    {
        include_once __DIR__ . '/../service/session.php';
        $session = new SESSION();
        $loggedIn = $session->getKey('id_users') !== null;
        return ['loggedIn' => $loggedIn];
    }

    // pobranie sciezek do modolow public function getModulesPaths(mixed $param = null): array
    private function getAllTools(mixed $param = null): array
    {
        include_once __DIR__ . '/../service/tools.php';
        $tools = new TOOLS();
   
        return $tools->getAllTools((bool)$param);
    }

    /**
     * Zwraca zawartość pliku JS prywatnego narzędzia.
     * $param – nazwa narzędzia (np. 'admin_system')
     */
    private function getPrivateToolContent(mixed $param = null): array
    {
        if (empty($param) || !is_string($param)) {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowy parametr'];
        }

        // Zabezpieczenie: tylko prosta nazwa narzędzia, bez slashy i ".."
        $toolName = basename($param);
        if ($toolName !== $param || $toolName === '' || $toolName === '.' || $toolName === '..') {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowa nazwa narzędzia'];
        }

        $privateDir = realpath(__DIR__ . '/../../private/tools/');
        if (!$privateDir) {
            return ['status' => false, 'content' => null, 'error' => 'Katalog private/tools nie istnieje'];
        }

        $jsFilePath = $privateDir . '/' . $toolName . '/' . $toolName . '.js';
        $jsFileReal = realpath($jsFilePath);

        if (!$jsFileReal) {
            return ['status' => false, 'content' => null, 'error' => 'Plik nie istnieje'];
        }

        // Obie ścieżki pochodzą z realpath(), który zwraca kanoniczną ścieżkę
        // z jednolitą wielkością liter na każdym systemie plików – strpos() jest tu poprawne.
        if (strpos($jsFileReal, $privateDir) !== 0) {
            return ['status' => false, 'content' => null, 'error' => 'Niedozwolona ścieżka'];
        }

        if (!is_readable($jsFileReal)) {
            return ['status' => false, 'content' => null, 'error' => 'Brak dostępu do pliku'];
        }

        return ['status' => true, 'content' => file_get_contents($jsFileReal)];
    }

    /**
     * Zwraca zawartość konkretnego pliku JS z katalogu prywatnego narzędzia.
     * $param – ścieżka w formacie 'nazwa_narzedzia/plik.js' (tylko pliki .js, bez podkatalogów)
     */
    private function getPrivateToolFile(mixed $param = null): array
    {
        if (empty($param) || !is_string($param)) {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowy parametr'];
        }

        $parts = explode('/', $param, 2);
        if (count($parts) !== 2) {
            return ['status' => false, 'content' => null, 'error' => 'Oczekiwany format: narzedzie/plik.js'];
        }

        [$toolName, $fileName] = $parts;

        // Walidacja nazwy narzędzia – tylko prosta nazwa, bez slashy i ".."
        if (basename($toolName) !== $toolName || $toolName === '' || $toolName === '.' || $toolName === '..') {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowa nazwa narzędzia'];
        }

        // Walidacja nazwy pliku – tylko plik w tym samym katalogu, bez podkatalogów i ".."
        if (basename($fileName) !== $fileName || $fileName === '' || $fileName === '.' || $fileName === '..') {
            return ['status' => false, 'content' => null, 'error' => 'Nieprawidłowa nazwa pliku'];
        }

        // Tylko pliki .js o bezpiecznej nazwie (litery, cyfry, podkreślnik, myślnik)
        if (!preg_match('/^[a-zA-Z0-9_-]+\.js$/', $fileName)) {
            return ['status' => false, 'content' => null, 'error' => 'Dozwolone są tylko pliki .js o bezpiecznej nazwie'];
        }

        $privateDir = realpath(__DIR__ . '/../../private/tools/');
        if (!$privateDir) {
            return ['status' => false, 'content' => null, 'error' => 'Katalog private/tools nie istnieje'];
        }

        $filePath = $privateDir . '/' . $toolName . '/' . $fileName;
        $fileReal = realpath($filePath);

        if (!$fileReal) {
            return ['status' => false, 'content' => null, 'error' => 'Plik nie istnieje'];
        }

        // Ochrona przed path traversal – plik musi leżeć wewnątrz private/tools/
        if (!str_starts_with($fileReal . DIRECTORY_SEPARATOR, $privateDir . DIRECTORY_SEPARATOR)) {
            return ['status' => false, 'content' => null, 'error' => 'Niedozwolona ścieżka'];
        }

        if (!is_readable($fileReal)) {
            return ['status' => false, 'content' => null, 'error' => 'Brak dostępu do pliku'];
        }

        return ['status' => true, 'content' => file_get_contents($fileReal)];
    }

}