<?php
class Auth {
    private $conn;
    private $procedureSql;
    private $access;

    public function __construct($conn, $procedureSql, $getData, $access) {
        $this->conn = $conn;
        $this->procedureSql = $procedureSql;
        $this->access = $access;
    }

    public function getSessionData() {
        return $_SESSION;
    }

    public function getLanguageUser() {
        $language = $_SESSION['language'] ?? 'English';
        return ['language' => $language];
    }

    public function loginUser(...$args) {
        $result = $this->procedureSql->sp_login_user(...$args);
        if (isset($result['status_response']['status']) && $result['status_response']['status'] === true) {
            foreach ($result['data'] as $key => $value) {
                $_SESSION[$key] = $value;
            }
        }
        return $result;
    }

    public function logout() {
        session_destroy();
        return ['status' => true, 'message' => 'Użytkownik wylogowany'];
    }
}
return Auth::class;