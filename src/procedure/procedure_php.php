<?php
// 
// Odpowiedzi API są JSON-em (przed jakimkolwiek wyjściem z include’ów).
if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
}

// tutaj beda umieszczane procedury napisane w php
$conn = require __DIR__ . '/../connect/connect.php';
require_once __DIR__ . '/../modules/loadPrivateModules.php';
// dolaczenie procedury sql
require_once __DIR__ . '/procedure_sql.php';

// sprawdzenie czy polaczenie z baza danych jest poprawne
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

class ProcedurePHP
{
    private mysqli $conn;
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
        $language = $_SESSION['language'] ?? 'English';

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
//=======================================================
    private function getAdminSystem(...$args): array{
       $userId = $this->sprawdzSesje();
       $this->sprawdzAktywneKonto($userId);
       $this->sprawdzDostepDoTabeli($userId,'users', 'add');
       
        
        // inkludowanie klasy Users
        require_once __DIR__ . '/../tables/users.php';
        $data = $args[0] ?? null;
        $users = new Users($this->conn, $data);
        // wywolanie poprawnej metody i zwrocenie wyniku jako tablica
        return $users->getAdminSystem();
      
    }
 




    // sprawdzenie czy użytkownik ma w ogóle dostęp do tabel i akcji na tabelach 
        private function sprawdzSesje() {
        if (!isset($_SESSION['id'])) {
            exit(json_encode([
                'status' => false,
                'message' => 'no session'
            ]));
        }
        return (int)$_SESSION['id'];
    }
    // sprawdzenie czy uzytkownik ma aktywne konto
    private function sprawdzAktywneKonto(int $userId): bool{
    $stmt = $this->conn->prepare("SELECT 1 FROM users WHERE id = ? AND active = 1 LIMIT 1");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $stmt->store_result();
    $exists = $stmt->num_rows > 0;
    $stmt->close();

    if (!$exists) {
        exit(json_encode([
            'status' => false,
            'message' => 'no activ users'
        ]));
    }
    return true;
    }

    /** sprawdz czy uzytkownik ma dostep do wykonania akcji na danej tabeli
     * @param int $userId - id uzytkownika
     * @param string $tableName - nazwa tabeli
     * @param string $action - nazwa akcji (np. 'read', 'add', 'update', 'delete', 'access')
     * @return bool - true jesli uzytkownik ma dostep, false w przeciwnym razie
     */
    private function sprawdzDostepDoTabeli(int $userId, string $tableName, string $action): bool{
     $mapaAkcji = [
        'access' => 'access_tables',
        'add'    => 'add_record',
        'read'   => 'read_record',
        'update' => 'update_record',
        'delete' => 'delete_record',
     ];

     if (!isset($mapaAkcji[$action])) {
        return false;
     }

     $kolumna = $mapaAkcji[$action];

     // Pobieramy cały wiersz, aby móc sprawdzić zarówno istnienie rekordu, jak i wartości kolumn
     $sql = "SELECT * FROM `access_tables` WHERE `id_users` = ? AND `tables` = ? LIMIT 1";

     if ($stmt = $this->conn->prepare($sql)) {
         $stmt->bind_param('is', $userId, $tableName);
         $stmt->execute();
         $result = $stmt->get_result();

         $row = $result->fetch_assoc();
         $stmt->close();

         // Jeśli rekord istnieje i wartość w kolumnie to 1 (dostęp przyznany)
         if ($row && (int)$row[$kolumna] === 1) {
            return true;
         }
     }

     exit(json_encode([
        'status' => false,
        'message' => 'no acces tables'
     ]));
    }




}
$procedurePhp = new ProcedurePHP($conn);
return $procedurePhp;
