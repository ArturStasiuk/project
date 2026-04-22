<?php
// Ten plik jest głównym entry pointem dla wszystkich zapytań do API. To tutaj trafiają wszystkie żądania POST, a następnie są kierowane do odpowiednich modułów i metod. nie zapomnij w produkcji usunąć error_reporting, a także ustawić odpowiednie nagłówki (np. CORS, jeśli potrzebujesz).
class VENDOR
{
    private MODULES $modules;
    private METHOD $method;

    public function __construct()
    {
        $this->enableErrors();
        $this->setJsonHeader();

        // Podpinamy klasy odpowiedzialne za:
        // - dostarczanie zależności do modułów
        // - metody lokalne (bez modules)
        include_once __DIR__ . '/modules.php';
        include_once __DIR__ . '/method.php';

        $this->modules = new MODULES();
        $this->method  = new METHOD();
    }

    public function handleRequest(): void
    {
        if (!$this->isPost()) {
            echo json_encode(['status' => false, 'message' => null]);
            return;
        }

        $data = $this->readJsonInput();

        $modulesName = $data['modules'] ?? null;
        $methodName  = $data['method'] ?? null;
        $param       = $data['param'] ?? null;

        // 1) Jeżeli przekazano modules -> ładuj moduł, twórz klasę, wywołaj metodę
        if (!empty($modulesName)) {
            $this->handleModuleCall($modulesName, $methodName, $param);
            return;
        }


        // 2) Jeżeli nie ma modules, ale jest method -> wywołaj metodę lokalną (METHOD)
        if ($modulesName === null && $methodName !== null) {
            $result = $this->method->call($methodName, $param);
            echo json_encode($result);
            return;
        }

        echo json_encode(['status' => true, 'message' => 'no module specified']);
    }

    // =============================================================================
    // Module handling
    // =============================================================================
    private function handleModuleCall(string $modulesName, ?string $methodName, mixed $param): void
    {
        $moduleFile = __DIR__ . '/../modules/' . $modulesName . '.php';

        if (!file_exists($moduleFile)) {
            echo json_encode(['status' => false, 'message' => 'Module file not found']);
            return;
        }

        include_once $moduleFile;

        if (!class_exists($modulesName)) {
            echo json_encode(['status' => false, 'message' => 'Class not found']);
            return;
        }

        // Zaleznosci dla modułu bierzemy z klasy MODULES
        $instances = $this->modules->build($modulesName);

        // Tworzenie instancji modułu:
        if (!empty($instances)) {
            $args = array_merge(array_values($instances), [$param]);
            $moduleInstance = new $modulesName(...$args);
        } else {
            // fallback kompatybilny z Twoim kodem (gdy brak provider'a)
            $moduleInstance = new $modulesName(null, $param);
        }

        if (!$methodName) {
            echo json_encode(['status' => false, 'message' => 'Method not specified']);
            return;
        }

        if (!method_exists($moduleInstance, $methodName)) {
            echo json_encode(['status' => false, 'message' => 'Method not found']);
            return;
        }

        // Jeśli metody modułów zawsze zwracają dane (array/bool/string),
        // to możesz tak jak miałeś:
        echo json_encode($moduleInstance->$methodName());
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
        $raw  = file_get_contents('php://input');
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
}

// Uruchomienie
(new VENDOR())->handleRequest();