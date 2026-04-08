<?php

namespace App\Connect;

use App\Database\Access;
use App\Database\Users;
use App\Sys\ModuleLoader;

/**
 * Główny router API.
 *
 * Odczytuje pole "function" z przesłanego JSON-a i wywołuje odpowiednią
 * prywatną metodę tej klasy. Aby dodać nowy endpoint, wystarczy dodać
 * prywatną metodę o tej samej nazwie.
 *
 * Przykładowe żądanie POST:
 *   { "function": "loginUsers", "data": { "email": "...", "password": "..." } }
 */
class Router
{
    private Session    $session;
    private Connection $db;
    private \mysqli|false $conn;
    private Users      $users;
    private Access     $access;
    private ?array     $data;
    private ?string    $function;

    public function __construct()
    {
        $this->session = new Session();
        $this->db      = new Connection();
        $this->conn    = $this->db->connect();

        if (!$this->conn) {
            echo json_encode(['status' => false, 'error' => 'Nie nawiązano połączenia z bazą danych']);
            exit;
        }

        $this->users  = new Users();
        $this->access = new Access();

        $input          = json_decode(file_get_contents('php://input'), true) ?? [];
        $this->data     = $input['data']     ?? null;
        $this->function = $input['function'] ?? null;

        $this->dispatch();
    }

    // -------------------------------------------------------------------------
    // Routing
    // -------------------------------------------------------------------------

    private function dispatch(): void
    {
        if (!$this->function) {
            $this->respond(['status' => true, 'message' => 'No function specified']);
        }

        if (!method_exists($this, $this->function)) {
            $this->respond(['status' => false, 'error' => 'Function not found']);
        }

        $result = $this->{$this->function}();
        $this->respond($result);
    }

    private function respond(array $data): never
    {
        $this->db->disconnect($this->conn);
        echo json_encode($data);
        exit;
    }

    // -------------------------------------------------------------------------
    // Endpointy
    // -------------------------------------------------------------------------

    /** Sprawdzenie czy użytkownik jest zalogowany. */
    private function isLoggedIn(): array
    {
        return ['status' => true, 'loggedIn' => $this->session->getKey('logIn')];
    }

    /** Informacja o połączeniu z bazą danych. */
    private function getConnectionInfo(): array
    {
        return ['status' => true, 'info' => $this->db->getConnectionInfo($this->conn)];
    }

    /** @deprecated Użyj getConnectionInfo(). Alias zachowany dla zgodności wstecznej. */
    private function getConectInfo(): array
    {
        return $this->getConnectionInfo();
    }

    /** Logowanie użytkownika. */
    private function loginUsers(): array
    {
        $email    = $this->data['email']    ?? null;
        $password = $this->data['password'] ?? null;
        return $this->users->loginUsers($this->conn, $email, $password, $this->session);
    }

    /** Wylogowanie użytkownika. */
    private function logoutUsers(): array
    {
        return $this->users->logoutUsers($this->session);
    }

    /**
     * Pobranie listy aktywnych modułów JS dla zalogowanego użytkownika.
     * Wymaga zalogowania – zwraca 401 w przypadku braku sesji.
     */
    private function userModules(): array
    {
        if (!$this->session->getKey('logIn')) {
            return ['status' => false, 'error' => 'Unauthorized'];
        }

        $userId  = (int) $this->session->getKey('id');
        $modules = $this->access->getActiveModulesForUser($this->conn, $userId);
        $loader  = new ModuleLoader();
        return $loader->listUserModules($modules['modules'] ?? []);
    }
}
