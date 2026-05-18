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

try {
  //  $procedureSql = require_once PATH_PROCEDURES_SQL;
    $procedurePhp = require_once PATH_PROCEDURES_PHP;
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

$procedureName = $data['procedure'] ?? $data['procedurePhp'] ?? null;

if (!$procedureName) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Field "procedure" is required.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
$procedureName = trim((string)$procedureName);

// Blokada niebezpiecznych nazw procedur i znakow specjalnych.
if ($procedureName === '' || !preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $procedureName)) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Invalid procedure name format.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$arguments = $data['arguments'] ?? [];
if (!is_array($arguments)) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Field "arguments" must be an array.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
$arguments = array_values($arguments);

$result = null;
try {
    $result = $procedurePhp->{$procedureName}(...$arguments);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Procedura nieznana lub nie może zostać wykonana.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
}
