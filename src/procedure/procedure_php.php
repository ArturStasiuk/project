<?php

// Odpowiedzi API są JSON-em (przed jakimkolwiek wyjściem z include’ów).
if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
}

// tutaj beda umieszczane procedury napisane w php
$conn = require __DIR__ . '/../connect/connect.php';
require_once __DIR__ . '/../modules/loadPrivateModules.php';
// dolaczenie procedury sql
//require_once __DIR__ . '/procedure_sql.php';

// sprawdzenie czy polaczenie z baza danych jest poprawne
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

class ProcedurePHP
{
    public function __construct(mysqli $conn)
    {
        $this->conn = $conn;
    }

    /**
     * Owija wynik procedury PHP w taka sama koperte jak ProcedureSQL:
     *  - jezeli zwrocona tablica zawiera klucze status/message na top-levelu,
     *    wyciagamy je do status_response, reszta trafia do data,
     *  - w przeciwnym wypadku zwracamy tylko { data: ... } (bez sztucznego status_response).
     *
     * @param mixed $payload
     * @return array<string, mixed>
     */
    private function wrapProcedureResponse(string $procedureName, $payload): array
    {
        if (!is_array($payload)) {
            return ['data' => $payload];
        }

        $statusResponse = [];
        if (array_key_exists('status', $payload)) {
            $statusResponse['status'] = $payload['status'];
            unset($payload['status']);
        }
        if (array_key_exists('message', $payload)) {
            $statusResponse['message'] = $payload['message'];
            unset($payload['message']);
        }

        $out = [];
        if ($statusResponse !== []) {
            $out['status_response'] = $statusResponse;
        }
        $out['data'] = $payload;

        return $out;
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

        $payload = $this->{$procedureName}(...$arguments);

        // Jezeli metoda zwrocila juz gotowa koperte (np. przekazana 1:1 z procedury SQL),
        // nie nakladamy drugiej warstwy - zwracamy payload bez zmian.
        if ($this->isAlreadyWrapped($payload)) {
            return $payload;
        }

        return $this->wrapProcedureResponse($procedureName, $payload);
    }

    /*** Wykrywa odpowiedz juz opakowana w standardowa koperte API
     
     * (klucze status_response i/lub data na najwyzszym poziomie).
     *
     * @param mixed $payload
     */
    private function isAlreadyWrapped($payload): bool
    {
        if (!is_array($payload)) {
            return false;
        }

        return array_key_exists('status_response', $payload)
            || array_key_exists('data', $payload)
            || array_key_exists('results', $payload);
    }
//=======================================================

    /** pobranie danych sesji uzytkownika */
    private function getSessionData(...$args): array
    {
        return $_SESSION;
    }
    /** pobranie jezyka dla zalogowanego uzytkownka */
    private function getLanguageUser(...$args): array
    {
        /** jezeli nie ma jezyka w sesji to domyslnie jest angielski */
        $language = $_SESSION['lang'] ?? '	English';
        return ['language' => $language];
    }
    /** logowanie uzytkownika i ustawienie danych sesji  */
    private function loginUser(...$args): array
    {
      // utworzenie obiektu procedury sql
      $procedureSql = new ProcedureSQL($this->conn);
      // wywolanie procedury sql_login_user i zwrocenie odpowiedzi 1:1
      $result = $procedureSql->sp_login_user(...$args);
      if ($result['status_response']['status'] !== true) {
      return $result;}
      else { 
        /** dodanie w petli wszystkich danych z data do sesji */
        foreach ($result['data'] as $key => $value) {
          $_SESSION[$key] = $value;
        }
        return $result;
      }
    }
    /** wylogowanie uzytkownika */
    private function logout(...$args): array
    {
      // usuniecie danych sesji uzytkwnika z sesji
      session_destroy();
      return ['status' => true, 'message' => 'Użytkownik wylogowany'];
      // odswiezenie strony
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }
    /** pobranie dostepu do modulow systemu */
    private function loadPrivateModules(...$args): array
    {
     // utworzenie obiektu procedury sql
     $procedureSql = new ProcedureSQL($this->conn);
     // pobranie id uzytkownika z sesji
     $id_users = $_SESSION['id'] ?? null;
     if ($id_users === null || $id_users === '') {
        return [
            'status_response' => [
                'status' => false,
                'message' => 'Brak zalogowanego uzytkownika.',
            ],
            'data' => [],
        ];
     }
     // wywolanie procedury sql_get_access_tools i zwrocenie odpowiedzi 1:1
     $result = $procedureSql->sp_get_access_tools($id_users);
     if (
        !isset($result['status_response']['status'])
        || $result['status_response']['status'] !== true
        || !isset($result['data'])
        || !is_array($result['data'])
     ) {
        return $result;
     }
     $result['data'] = PrivateModulesLoader::buildSafeModules($result['data']);
     return $result;
  
    }






}
$procedurePhp = new ProcedurePHP($conn);
return $procedurePhp;

