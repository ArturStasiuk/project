<?php

class VENDOR
{
    public function __construct()
    {
        $this->enableErrors();
        $this->setJsonHeader();
    }

    public function handleRequest(): void
    {
        if (!$this->isPost()) {
            echo json_encode(['status' => 'false', 'message' => null]);
            return;
        }

        $data = $this->readJsonInput();

        $modulesName = $data['modules'] ?? null;
        $methodName  = $data['method'] ?? null;
        $param       = $data['param'] ?? null;

        // 1) Jeżeli przekazano modules -> ładuj moduł, twórz klasę, wywołaj metodę
        if ($modulesName) {
            $this->handleModuleCall($modulesName, $methodName, $param);
            return;
        }

        // 2) Jeżeli nie ma modules, ale jest method -> wywołaj metodę lokalną (np. checkLoggedIn)
        if ($modulesName === null && $methodName !== null) {
            $this->handleLocalMethod($methodName, $param);
            return;
        }

        echo json_encode(['status' => true, 'message' => 'no module specified']);
    }

    // =============================================================================
    // Module handling
    // =============================================================================

    private function handleModuleCall(?string $modulesName, ?string $methodName, mixed $param): void
    {
        if (!$modulesName) {
            echo json_encode(['status' => 'false', 'message' => 'Module not specified']);
            return;
        }

        $moduleFile = __DIR__ . '/../modules/' . $modulesName . '.php';

        if (!file_exists($moduleFile)) {
            echo json_encode(['status' => 'false', 'message' => 'Module file not found']);
            return;
        }

        include_once $moduleFile;

        if (!class_exists($modulesName)) {
            echo json_encode(['status' => 'false', 'message' => 'Class not found']);
            return;
        }

        $instances = $this->buildModuleInstances($modulesName);

        // Tworzenie instancji modułu:
        if (!empty($instances)) {
            // przekazujemy instancje + param na końcu
            $args = array_merge(array_values($instances), [$param]);
            $moduleInstance = new $modulesName(...$args);
        } else {
            // fallback kompatybilny z Twoim kodem
            $moduleInstance = new $modulesName(null, $param);
        }

        if (!$methodName) {
            echo json_encode(['status' => 'false', 'message' => 'Method not specified']);
            return;
        }

        if (!method_exists($moduleInstance, $methodName)) {
            echo json_encode(['status' => 'false', 'message' => 'Method not found']);
            return;
        }

        echo json_encode($moduleInstance->$methodName());
    }

    /**
     * Jeśli istnieje metoda o nazwie modułu (np. user()) to zwróci tablicę instancji zależności.
     */
    private function buildModuleInstances(string $modulesName): array
    {
        // zamiast function_exists($modulesName) mamy method_exists($this, $modulesName)
        if (method_exists($this, $modulesName)) {
            return $this->$modulesName(); // np. ['pdo'=>..., 'session'=>...]
        }
        return [];
    }

    // =============================================================================
    // Local methods handling (no modules)
    // =============================================================================

    private function handleLocalMethod(string $methodName, mixed $param): void
    {
        if (!method_exists($this, $methodName)) {
            echo json_encode(['status' => 'false', 'message' => 'Method not found']);
            return;
        }

        // Jeżeli chcesz przekazywać $param do metod lokalnych, to tu jest miejsce:
        $this->$methodName($param);
    }

    // =============================================================================
    // Helpers
    // =============================================================================

    private function enableErrors(): void
    {
        ini_set('display_errors', '1');
        ini_set('display_startup_errors', '1');
        error_reporting(E_ALL);
    }

    private function setJsonHeader(): void
    {
        header('Content-Type: application/json');
    }

    private function isPost(): bool
    {
        return ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
    }

    private function readJsonInput(): array
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    // ============================================================================= 
    // "Modules" dependency providers (dawne funkcje user() itd.)
    // =============================================================================

    /**
     * modules user - wszystko co zwiazane z uzytkownikami
     */
    private function user(): array
    {
        include_once __DIR__ . '/../config/config_db.php';
        include_once __DIR__ . '/../connect/connect_db.php';
        $config_db = new CONFIG_DB();
        $connect_db = new CONNECT();

        include_once __DIR__ . '/../service/session.php';
        include_once __DIR__ . '/../data_base/users.php';
        include_once __DIR__ . '/../data_base/access_tables.php';
        include_once __DIR__ . '/../data_base/company_users.php';
        include_once __DIR__ . '/../data_base/company.php';

        return [
            'pdo' => $connect_db->connect($config_db->getConfig()),
            'session' => new SESSION(),
            'users' => new USERS(),
            'access_tables' => new ACCESS_TABLES(),
            'company_users' => new COMPANY_USERS(),
            'company' => new COMPANY(),
        ];
    }

    // =============================================================================
    // Metody bez modules (dawne funkcje globalne)
    // =============================================================================

    /**
     * sprawdza czy uzytkownik jest zalogowany
     */
    private function checkLoggedIn(): void
    {
        include_once __DIR__ . '/../service/session.php';
        $session = new SESSION();
        $loggedIn = $session->getKey('id_users') !== null;
        echo json_encode(['loggedIn' => $loggedIn]);
    }
}

// Uruchomienie (zastępuje kod proceduralny z pliku)
(new VENDOR())->handleRequest();