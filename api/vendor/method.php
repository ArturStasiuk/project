<?php

class METHOD
{
    public function call(string $methodName, mixed $param = null): void
    {
        if (!method_exists($this, $methodName)) {
            echo json_encode(['status' => 'false', 'message' => 'Method not found']);
            return;
        }

        // jeśli niektóre metody potrzebują param, możesz go przekazywa��:
        $this->$methodName($param);
    }

    /**
     * sprawdza czy uzytkownik jest zalogowany
     */
    private function checkLoggedIn(mixed $param = null): void
    {
        include_once __DIR__ . '/../service/session.php';
        $session = new SESSION();
        $loggedIn = $session->getKey('id_users') !== null;

        echo json_encode(['loggedIn' => $loggedIn]);
    }
}