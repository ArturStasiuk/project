<?php
declare(strict_types=1);

// Inicjalizacja stałych ścieżek
require_once __DIR__ . '/bootstrap.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
}

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Inicjalizacja wspólnych zależności
try {
    $conn = require PATH_CONNECT;
    $procedureSql = require_once PATH_PROCEDURES_SQL;
    $ReadData = require_once PATH_READ_DATA;
    $access = require_once PATH_ACCESS;
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'message' => 'Błąd inicjalizacji lub połączenia z bazą.',
        'data' => null,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => false,
        'message' => 'Method not allowed. Use POST.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$toolName = $data['tool'] ?? null;
$procedureSqlName = $data['procedureSql'] ?? null;
$methodName = $data['method'] ?? $data['procedurePhp'] ?? null;
$arguments = $data['arguments'] ?? [];

if (!$toolName && !$procedureSqlName) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'Tool or procedureSql is required.']);
    exit;
}

if (!is_array($arguments)) {
    $arguments = [];
}
$arguments = array_values($arguments);

try {
    // Obsługa bezpośrednich procedur SQL
    if ($procedureSqlName) {
        $name = trim((string)$procedureSqlName);
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $name)) throw new Exception('Invalid SQL procedure name.');
        echo json_encode($procedureSql->{$name}(...$arguments), JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Obsługa modułów PHP (Tools)
    $toolName = trim((string)$toolName);
    if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $toolName)) throw new Exception('Invalid tool name.');
    
    // Konwersja CamelCase na snake_case (np. AdminSystem -> admin_system)
    $fileName = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $toolName));
    $toolPath = __DIR__ . "/tools/" . $fileName . ".php";
    if (!file_exists($toolPath)) {
        throw new Exception("Tool file not found: $toolName");
    }

    // Załadowanie klasy narzędzia
    $toolClass = require_once $toolPath;
    
    // Inicjalizacja klasy (zakładamy, że plik zwraca instancję lub definicję przygotowaną do pracy)
    // Dla spójności przyjmijmy, że każdy plik w tools zwraca obiekt klasy.
    if (!is_object($toolClass)) {
        // Jeśli plik nie zwraca obiektu, próbujemy go zainicjować (zakładając nazwę klasy zgodną z plikiem)
        if (class_exists($toolName)) {
            $toolInstance = new $toolName($conn, $procedureSql, $ReadData, $access, ...$arguments);
        } else {
            throw new Exception("Tool class $toolName not found.");
        }
    } else {
        $toolInstance = $toolClass;
    }

    if (!method_exists($toolInstance, $methodName)) {
        throw new Exception("Method $methodName not found in tool $toolName.");
    }

    // Wywołanie metody
    $result = $toolInstance->{$methodName}(...$arguments);

    // Standaryzacja odpowiedzi, jeśli tool nie zwrócił status_response
    if (is_array($result) && !isset($result['status_response']) && !isset($result['results'])) {
        $status = $result['status'] ?? true;
        $message = $result['message'] ?? 'success';
        unset($result['status'], $result['message']);
        $result = [
            'status_response' => ['status' => $status, 'message' => $message],
            'data' => $result
        ];
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => $e->getMessage()]);
}
