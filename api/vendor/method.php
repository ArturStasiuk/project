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
    public function getPublicTools(mixed $param = null): array
    {
        include_once __DIR__ . '/../service/tools.php';
        $tools = new TOOLS();
        // tutaj możesz dodać logikę do pobierania ścieżek modułów
        return $tools->getPublicTools();
    }



}