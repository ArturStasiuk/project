<?php

declare(strict_types=1);

namespace App\Core;

use App\Modules\ModulesCompany;
use App\Modules\User;

/**
 * Router – główny kontroler żądań HTTP dla API.
 *
 * Odbiera dane JSON metodą POST, kieruje wywołanie do odpowiedniego modułu
 * lub metody lokalnej (z klasy Method), a wynik odsyła jako JSON.
 *
 * Schemat żądania:
 * ```json
 * {
 *   "modules": "user",          // opcjonalne – nazwa modułu
 *   "method":  "loginUsers",    // wymagane – nazwa metody
 *   "param":   { ... }          // opcjonalne – dowolne dane
 * }
 * ```
 *
 * Gdy `modules` jest puste, wywołanie trafia do klasy Method (metody globalne).
 * Gdy `modules` jest wypełnione, Router tworzy instancję modułu za pomocą
 * ModuleBuilder i wywołuje na niej wskazaną metodę.
 */
class Router
{
    /**
     * Mapa: klucz modułu (z żądania) → w pełni kwalifikowana nazwa klasy.
     *
     * Aby zarejestrować nowy moduł:
     *  1. Dodaj wpis tutaj.
     *  2. Dodaj prywatną metodę w ModuleBuilder::build() z tą samą nazwą klucza.
     *
     * @var array<string, class-string>
     */
    private const MODULE_MAP = [
        'user'            => User::class,
        'modules_company' => ModulesCompany::class,
    ];

    private ModuleBuilder $moduleBuilder;
    private Method        $method;

    public function __construct()
    {
        $this->enableErrors();
        $this->setJsonHeader();
        $this->moduleBuilder = new ModuleBuilder();
        $this->method        = new Method();
    }

    /**
     * Obsługuje bieżące żądanie HTTP.
     */
    public function handleRequest(): void
    {
        if (!$this->isPost()) {
            echo json_encode(['status' => false, 'message' => null]);
            return;
        }

        $data        = $this->readJsonInput();
        $moduleName  = $data['modules'] ?? null;
        $methodName  = $data['method']  ?? null;
        $param       = $data['param']   ?? null;

        if (!empty($moduleName)) {
            $this->handleModuleCall((string) $moduleName, $methodName, $param);
            return;
        }

        if ($methodName !== null) {
            echo json_encode($this->method->call((string) $methodName, $param));
            return;
        }

        echo json_encode(['status' => true, 'message' => 'no module specified']);
    }

    // =========================================================================
    // Obsługa modułów
    // =========================================================================

    /**
     * Tworzy instancję modułu, wstrzykuje zależności i wywołuje metodę.
     *
     * @param string      $moduleName Klucz modułu z MODULE_MAP.
     * @param string|null $methodName Nazwa metody do wywołania.
     * @param mixed       $param      Parametry żądania.
     */
    private function handleModuleCall(string $moduleName, ?string $methodName, mixed $param): void
    {
        if (!isset(self::MODULE_MAP[$moduleName])) {
            echo json_encode(['status' => false, 'message' => 'Module not found']);
            return;
        }

        $className = self::MODULE_MAP[$moduleName];

        if (!$methodName) {
            echo json_encode(['status' => false, 'message' => 'Method not specified']);
            return;
        }

        $instances = $this->moduleBuilder->build($moduleName);
        $args      = !empty($instances)
            ? array_merge(array_values($instances), [$param])
            : [null, $param];

        $moduleInstance = new $className(...$args);

        if (!method_exists($moduleInstance, $methodName)) {
            echo json_encode(['status' => false, 'message' => 'Method not found']);
            return;
        }

        echo json_encode($moduleInstance->$methodName());
    }

    // =========================================================================
    // Pomocnicze
    // =========================================================================

    /**
     * Włącza wyświetlanie błędów PHP (tylko w środowisku deweloperskim).
     * W produkcji ustaw w .env: APP_ENV=production
     */
    private function enableErrors(): void
    {
        $env = $_ENV['APP_ENV'] ?? 'development';
        if ($env !== 'production') {
            ini_set('display_errors', '1');
            ini_set('display_startup_errors', '1');
            error_reporting(E_ALL);
        }
    }

    private function setJsonHeader(): void
    {
        header('Content-Type: application/json');
    }

    private function isPost(): bool
    {
        return ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
    }

    /**
     * @return array<string, mixed>
     */
    private function readJsonInput(): array
    {
        $raw  = file_get_contents('php://input');
        $data = json_decode((string) $raw, true);
        return is_array($data) ? $data : [];
    }
}
