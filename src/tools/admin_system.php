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
   // private $conn;
    private $access;
    private $getData;
    private $data;  

    public function __construct( $data = null) 
    {
     // $this->conn = require PATH_CONNECT;// polaczenie z baza danych
      $this->access = require PATH_ACCESS;// obiekt do sprawdzania dostepu
      $this->getData = require PATH_GET_DATA;// obiekt do pobierania danych
      $this->data = $data;


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
        $data = $this->getData->get_records_by_value($table, $column, $value);

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
        'message' => 'snow method',
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