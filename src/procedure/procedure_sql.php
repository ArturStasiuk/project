<?php
// ostatnia aktualizacja: 10.05.2026
// wywolywanie procedur skladowych w bazie danych

/**
 * Dynamiczne szukanie bootstrapa (dla wywołań bezpośrednich)
 */
$currentDir = __DIR__;
while ($currentDir !== dirname($currentDir) && !file_exists($currentDir . '/src/bootstrap.php')) {
    $currentDir = dirname($currentDir);
}
if (file_exists($currentDir . '/src/bootstrap.php')) {
    require_once $currentDir . '/src/bootstrap.php';
}

$conn = require PATH_CONNECT;
// sprawdzenie czy polaczenie z baza danych jest poprawne
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

/**
 * Obsluga procedur skladowanych przez wywolania:
 * $procedure->nazwaProcedury(arg1, arg2)
 */
class ProcedureSQL
{
    private mysqli $conn;

    public function __construct(mysqli $conn)
    {
        $this->conn = $conn;
    }

    /**
     * Przekierowuje wywolanie metody na CALL procedury w bazie.
     *
     * @param string $procedureName
     * @param array<int, mixed> $arguments
     * @return array<string, mixed>
     */
    public function __call(string $procedureName, array $arguments): array
    {
        $placeholders = implode(',', array_fill(0, count($arguments), '?'));
        $sql = sprintf('CALL `%s`(%s)', $procedureName, $placeholders);

        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new RuntimeException('Prepare failed: ' . $this->conn->error);
        }

        if (!empty($arguments)) {
            $this->bindArguments($stmt, $arguments);
        }

        if (!$stmt->execute()) {
            throw new RuntimeException('Execute failed: ' . $stmt->error);
        }

        $rows = $this->fetchRows($stmt);

        // Czysci dodatkowe zestawy wynikow po CALL.
        while ($this->conn->more_results() && $this->conn->next_result()) {
        }

        $stmt->close();
        $rows = $this->normalizeStatusBoolean($rows);
        if ($procedureName === 'sp_get_access_tools') {
            $wrapped = $this->wrapSpGetAccessToolsTableRows($rows);
        } else {
            $wrapped = $this->wrapStatusResponseAndData($rows);
        }

        return $this->asSingleRootObject($wrapped);
    }

    /**
     * Jedna odpowiedz JSON jako obiekt: jeden wiersz = { status_response?, data }; kilka = { results: [...] }.
     *
     * @param array<int, array<string, mixed>> $wrapped
     * @return array<string, mixed>
     */
    private function asSingleRootObject(array $wrapped): array
    {
        $wrapped = array_values($wrapped);

        if (count($wrapped) === 1) {
            return $wrapped[0];
        }

        return ['results' => $wrapped];
    }

    /**
     * Wydziela kolumny status i message do obiektu status_response,
     * pozostale pola umieszcza w data (procedura moze dalej zwracac płaski SELECT).
     *
     * @param array<int, array<string, mixed>> $rows
     * @return array<int, array<string, mixed>>
     */
    private function wrapStatusResponseAndData(array $rows): array
    {
        if ($rows === []) {
            return [
                [
                    'data' => [],
                ],
            ];
        }

        $wrapped = [];
        foreach ($rows as $row) {
            $statusResponse = [];

            if (array_key_exists('status', $row)) {
                $statusResponse['status'] = $row['status'];
                unset($row['status']);
            }
            if (array_key_exists('message', $row)) {
                $statusResponse['message'] = $row['message'];
                unset($row['message']);
            }

            $out = [];
            if ($statusResponse !== []) {
                $out['status_response'] = $statusResponse;
            }
            $out['data'] = $row;
            $wrapped[] = $out;
        }

        return $wrapped;
    }

    /**
     * Procedura zwraca wiele wierszy (tabela); scala do jednego obiektu API.
     *
     * @param array<int, array<string, mixed>> $rows
     * @return array<int, array<string, mixed>>
     */
    private function wrapSpGetAccessToolsTableRows(array $rows): array
    {
        if ($rows === []) {
            return [
                [
                    'status_response' => [
                        'status' => false,
                        'message' => 'no tools',
                    ],
                    'data' => null,
                ],
            ];
        }

        $first = $rows[0];
        $status = $first['status'] ?? false;
        if ($status !== true) {
            return [
                [
                    'status_response' => [
                        'status' => false,
                        'message' => $first['message'] ?? 'no tools',
                    ],
                    'data' => null,
                ],
            ];
        }

        $toolKeys = [
            'id',
            'id_users',
            'tools_name',
            'active',
            'active_tools',
            'is_active',
            'access_tools',
            'read_tools',
            'add_tools',
            'delete_tools',
            'update_tools',
        ];
        $data = [];
        foreach ($rows as $row) {
            $tool = [];
            foreach ($toolKeys as $key) {
                if (array_key_exists($key, $row)) {
                    $tool[$key] = $row[$key];
                }
            }
            $data[] = $tool;
        }

        return [
            [
                'status_response' => [
                    'status' => true,
                    'message' => $first['message'] ?? 'get tools',
                ],
                'data' => $data,
            ],
        ];
    }

    /**
     * Mapuje kolumne status (0/1 z MySQL) na bool PHP, aby json_encode zwrocil true/false.
     *
     * @param array<int, array<string, mixed>> $rows
     * @return array<int, array<string, mixed>>
     */
    private function normalizeStatusBoolean(array $rows): array
    {
        foreach ($rows as &$row) {
            if (!array_key_exists('status', $row)) {
                continue;
            }
            $status = $row['status'];
            if ($status === true || $status === 1 || $status === '1') {
                $row['status'] = true;
                continue;
            }
            if ($status === false || $status === 0 || $status === '0') {
                $row['status'] = false;
            }
        }
        unset($row);

        return $rows;
    }

    /**
     * @param mysqli_stmt $stmt
     * @param array<int, mixed> $arguments
     */
    private function bindArguments(mysqli_stmt $stmt, array $arguments): void
    {
        $types = '';
        foreach ($arguments as $param) {
            if (is_int($param)) {
                $types .= 'i';
            } elseif (is_float($param)) {
                $types .= 'd';
            } elseif (is_null($param)) {
                $types .= 's';
            } else {
                $types .= 's';
            }
        }

        // bind_param nie przyjmuje null bezposrednio - mapowanie na string null.
        foreach ($arguments as $index => $value) {
            if (is_null($value)) {
                $arguments[$index] = null;
            }
        }

        $stmt->bind_param($types, ...$arguments);
    }

    /**
     * Pobiera wynik bez zalozenia, ze mysqlnd/get_result jest dostepne.
     *
     * @return array<int, array<string, mixed>>
     */
    private function fetchRows(mysqli_stmt $stmt): array
    {
        $rows = [];

        if (method_exists($stmt, 'get_result')) {
            $result = $stmt->get_result();
            if ($result !== false) {
                while ($row = $result->fetch_assoc()) {
                    $rows[] = $row;
                }
                $result->free();
                return $rows;
            }
        }

        $metadata = $stmt->result_metadata();
        if ($metadata === false) {
            return $rows;
        }

        $fields = $metadata->fetch_fields();
        $metadata->free();

        $rowData = [];
        $bindTargets = [];
        foreach ($fields as $field) {
            $rowData[$field->name] = null;
            $bindTargets[] = &$rowData[$field->name];
        }

        $stmt->bind_result(...$bindTargets);
        while ($stmt->fetch()) {
            $rows[] = array_map(
                static fn($value) => $value,
                $rowData
            );
        }

        return $rows;
    }
// kontrola dosteempu 



}

$procedureSql = new ProcedureSQL($conn);
return $procedureSql;