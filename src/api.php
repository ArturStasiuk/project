<?php
declare(strict_types=1);

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

/*
 * API endpoint do wywolywania procedur SQL przez POST JSON.
 *
 * Wejscie:
 * {
 *   "procedure": "nazwaProcedury",
 *   "arguments": {
 *     "email": "john@doe.com",
 *     "password": "tajne_haslo",
 *     "rememberMe": 1
 *   }
 * }
 * "arguments" to pary klucz => wartosc (moze ich byc dowolnie wiele).
 * Do procedury SQL przekazywane sa same wartosci, w kolejnosci podanej w JSON.
 *
 * Wyjscie:
 * - sukces: pojedynczy obiekt JSON – przy jednym wierszu procedury:
 *           { status_response?, data }; przy wielu: { results: [ {status_response?, data}, ... ] }
 *           przy braku wierszy: { data: [] } — normalizacja w sql_procedure.php
 * - blad techniczny: { "error": "..." }
 */
try {
    // dolaczenie pliku oblugi procedur w sql
    require_once __DIR__ . '/procedure/procedure_sql.php';
    // dolaczenie procedur w php
    require_once __DIR__ . '/procedure/procedure_php.php';
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

$hasProcedurePhp = array_key_exists('procedurePhp', $data);
$hasProcedureSql = array_key_exists('procedureSql', $data);

if (!$hasProcedurePhp && !$hasProcedureSql) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Field "procedurePhp" or "procedureSql" is required.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($hasProcedurePhp && $hasProcedureSql) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Use only one field: "procedurePhp" or "procedureSql".',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$procedureType = $hasProcedurePhp ? 'php' : 'sql';
$procedureKey = $hasProcedurePhp ? 'procedurePhp' : 'procedureSql';

if (!is_string($data[$procedureKey]) || trim($data[$procedureKey]) === '') {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Field "' . $procedureKey . '" must be a non-empty string.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$procedureName = trim($data[$procedureKey]);

// Blokada niebezpiecznych nazw procedur i znakow specjalnych.
if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $procedureName)) {
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

try {
    if ($procedureType === 'php') {
        $result = $procedurePhp->{$procedureName}(...$arguments);
    } else {
        $result = $procedureSql->{$procedureName}(...$arguments);
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Procedura nieznana lub nie może zostać wykonana.',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
}
