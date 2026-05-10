<?php

// Odpowiedzi API są JSON-em (przed jakimkolwiek wyjściem z include’ów).
if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
}

// tutaj beda umieszczane procedury napisane w php
$conn = require __DIR__ . '/../connect/connect.php';
// sprawdzenie czy polaczenie z baza danych jest poprawne
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

class ProcedurePHP
{
    /** @var string|null json_encode(argumentów wywołania) — ustawiane w {@see __call} */
    private $invocationArgsJson;

    public function __construct(mysqli $conn)
    {
        $this->conn = $conn;
    }

    /**
     * @param mixed $data zwrócone z procedury (trafia pod klucz "data" w odpowiedzi API)
     * @return array<string, mixed>
     */
    private function wrapProcedureResponse(string $procedureName, $data): array
    {
        $argsJson = $this->invocationArgsJson ?? '[]';

        return [
            'status_response' => [
                'status' => true,
                'message' => 'Wywołano procedurę PHP ' . $procedureName . '. Data: ' . $argsJson,
            ],
            'data' => $data,
        ];
    }

    /**
     * Przekierowuje wywołanie na procedurę zdefiniowaną jako metoda prywatna klasy.
     * Sprawdza istnienie metody przed wywołaniem.
     *
     * @param string $procedureName
     * @param array<int, mixed> $arguments
     * @return array<string, mixed>
     */
    public function __call(string $procedureName, array $arguments): array
    {
        if ($procedureName === '__construct' || $procedureName === '__call') {
            throw new RuntimeException('Disallowed procedure name.');
        }

        if (!method_exists($this, $procedureName)) {
            throw new RuntimeException('Unknown PHP procedure.');
        }

        $ref = new ReflectionMethod($this, $procedureName);
        if (!$ref->isPrivate()) {
            throw new RuntimeException('Procedura musi być metodą prywatną.');
        }

        $this->invocationArgsJson = json_encode($arguments, JSON_UNESCAPED_UNICODE);
        try {
            $payload = $this->{$procedureName}(...$arguments);

            return $this->wrapProcedureResponse($procedureName, $payload);
        } finally {
            $this->invocationArgsJson = null;
        }
    }


    /** pobranie danych sesji uzytkownika */
    private function getSessionData(...$args): array
    {
        return $_SESSION;
    }
    /** pobranie jezyka dla zalogowanego uzytkownka */
    private function getLanguageUser(...$args): array
    {
        /** jezeli nie ma jezyka w sesji to domyslnie jest angielski */
        $language = $_SESSION['language'] ?? 'Svenska';
        return ['language' => $language];
    }
    /** logowanie uzytkownika i ustawienie danych sesji  */
    private function loginUser(...$args): array
    {
      require_once __DIR__ . '/procedure_sql.php';
      $procedureSql = new ProcedureSQL($this->conn);
      $result = $procedureSql->sql_login_user(...$args);
    }




}
$procedurePhp = new ProcedurePHP($conn);
return $procedurePhp;

