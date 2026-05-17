<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

class AdminSystem
{
    private $conn;
    private $tableUsers;

    public function __construct()
    {
      $this->conn = require __DIR__ . '/../../../src/connect/connect.php';
      require_once __DIR__ . '/../../../src/tables/users.php';
      $this->tableUsers = new Users($this->conn);
    }
    public function getAdminSystem(...$args): array
    {
        $idUsers = $this->sprawdzSesje();
        $this->sprawdzAktywneKonto($idUsers);
        $this->sprawdzDostepDoTabeli($idUsers, 'users', 'read');
        $table = 'users';
        $column = 'role';
        $value = 'admin system';
        $data = [];
        $stmt = $this->conn->prepare("CALL get_records_by_value(?, ?, ?)");
        $stmt->bind_param("sss", $table, $column, $value);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($result && $row = $result->fetch_assoc()) {
            $data[] = $row;
        }
         $stmt->close();
        // Czyszczenie pozostałych wyników procedury składowanej (wymagane w MySQLi)
        while ($this->conn->more_results() && $this->conn->next_result());

        return [
            'status' => true,
            'message' => 'pobrano dane',
            'data' => $data,
        ];
    }
    















//funkcje pomocnicze do obsługi żądań i odpowiedzi
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
        'access' => 'access_table',
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
//====







//==================
function getRequestMethodName(): string
{
    return (string) ($_REQUEST['method'] ?? $_REQUEST['method'] ?? '');
}

function getRequestArguments(): array
{
    $arguments = $_REQUEST['args'] ?? [];

    if (is_string($arguments)) {
        $decodedArguments = json_decode($arguments, true);

        return is_array($decodedArguments) ? $decodedArguments : [$arguments];
    }

    return is_array($arguments) ? $arguments : [];
}

function canCallMethod(object $object, string $method): bool
{
    if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $method) || !method_exists($object, $method)) {
        return false;
    }

    $reflection = new ReflectionMethod($object, $method);

    return $reflection->isPublic();
}

function jsonResponse($data): void
{
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

header('Content-Type: application/json; charset=utf-8');

$handler = new AdminSystem();
$method = getRequestMethodName();

if (!canCallMethod($handler, $method)) {
    jsonResponse([
        'status' => false,
        'message' => 'no method',
    ]);

    exit;
}

try {
    jsonResponse(call_user_func_array([$handler, $method], getRequestArguments()));
} catch (Throwable $exception) {
    jsonResponse([
        'status' => false,
        'message' => $exception->getMessage(),
    ]);
}
