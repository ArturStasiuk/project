<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
/**
 * Dynamiczne szukanie bootstrapa w górę drzewa katalogów.
 * Szuka folderu 'src/bootstrap.php' startując od bieżącej lokalizacji.
 */
$currentDir = __DIR__;
while ($currentDir !== dirname($currentDir) && !file_exists($currentDir . '/src/bootstrap.php')) {
    $currentDir = dirname($currentDir);
}
if (file_exists($currentDir . '/src/bootstrap.php')) {
    require_once $currentDir . '/src/bootstrap.php';
}

class AdminSystem
{
    private $conn;
    private $access;

    public function __construct()
    {
      $this->conn = require PATH_CONNECT;
      $this->access = require PATH_ACCESS;


    }
    public function getAdminSystem(...$args): array
    {
        $idUsers = $this->access->sprawdzSesje();
        $this->access->sprawdzAktywneKonto($idUsers);
        $this->access->sprawdzDostepDoTabeli($idUsers, 'users', 'read');
        $table = 'users';
        $column = 'role';
        $value = 'admin system';
        $data = [];
        // Wywołanie procedury składowanej z parametrami do pobrania rekordów
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
            'message' => 'success',
            'data' => $data,
        ];
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
