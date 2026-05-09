<?php
// tutaj beda umieszczane procedury napisane w php
$conn = require __DIR__ . '/../connect/connect.php';
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

        return $this->{$procedureName}(...$arguments);
    }

    /**
     * @param mixed ...$args
     * @return array<string, mixed>
     */
    private function test(...$args): array
    {
        $argsJson = json_encode($args, JSON_UNESCAPED_UNICODE);

        return [
            'status_response' => [
                'status' => true,
                'message' => 'Wywołano procedurę PHP test. Data: ' . $argsJson,
            ],
            'data' => $args,
        ];
    }
}
$procedurePhp = new ProcedurePHP($conn);
return $procedurePhp;
