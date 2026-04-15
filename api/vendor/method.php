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

}