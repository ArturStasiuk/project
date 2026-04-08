<?php

namespace App\Sys;

/**
 * Ładowacz modułów JS.
 *
 * Odpowiada za:
 * - zwracanie listy URL-i plików JS aktywnych modułów dostępnych dla użytkownika,
 * - bezpieczne serwowanie plików JS modułów przez proxy (z przepisaniem importów).
 */
class ModuleLoader
{
    private string $modulesDir;
    private string $proxyBase;

    public function __construct()
    {
        $this->modulesDir = realpath(__DIR__ . '/../../modules') ?: '';
        $this->proxyBase  = '/api/sys/module_loader.php?file=';
    }

    /**
     * Zwraca listę URL-i plików JS aktywnych modułów dostępnych dla użytkownika.
     *
     * @param list<array{modules_name: string, active: string}> $modules
     * @return array{status: bool, jsFiles: list<string>}
     */
    public function listUserModules(array $modules): array
    {
        $allowedModules = [];
        foreach ($modules as $mod) {
            if (isset($mod['active']) && $mod['active'] === '1') {
                $allowedModules[] = $mod['modules_name'];
            }
        }

        $jsFiles = [];
        if (!$this->modulesDir || !is_dir($this->modulesDir)) {
            return ['status' => true, 'jsFiles' => $jsFiles];
        }

        $dirHandle = opendir($this->modulesDir);
        if (!$dirHandle) {
            return ['status' => true, 'jsFiles' => $jsFiles];
        }

        while (($entry = readdir($dirHandle)) !== false) {
            if ($entry === '.' || $entry === '..' || !is_dir($this->modulesDir . '/' . $entry)) {
                continue;
            }
            if (!in_array($entry, $allowedModules, true)) {
                continue;
            }
            $jsFile = $this->modulesDir . '/' . $entry . '/' . $entry . '.js';
            if (file_exists($jsFile)) {
                $jsFiles[] = $this->proxyBase . rawurlencode($entry . '/' . $entry . '.js');
            }
        }
        closedir($dirHandle);

        return ['status' => true, 'jsFiles' => $jsFiles];
    }

    /**
     * Bezpiecznie serwuje plik JS modułu przez proxy.
     * Przepisuje relatywne importy ES-modułów tak, aby przechodziły przez ten proxy.
     *
     * @param string $file ścieżka relatywna, np. "notepad/notepad.js"
     */
    public function serveFile(string $file): void
    {
        $file = str_replace('\\', '/', $file);

        if (str_contains($file, '..') || str_starts_with($file, './') || str_starts_with($file, '/')) {
            http_response_code(403);
            exit;
        }

        $parts      = explode('/', $file, 2);
        $moduleName = $parts[0];
        $fullPath   = realpath($this->modulesDir . '/' . $file);

        if ($fullPath === false || !str_starts_with($fullPath, $this->modulesDir . DIRECTORY_SEPARATOR)) {
            http_response_code(403);
            exit;
        }

        if (pathinfo($fullPath, PATHINFO_EXTENSION) !== 'js') {
            http_response_code(403);
            exit;
        }

        if (!file_exists($fullPath)) {
            http_response_code(404);
            exit;
        }

        $content   = (string) file_get_contents($fullPath);
        $proxyBase = $this->proxyBase;

        $content = (string) preg_replace_callback(
            '/\bfrom\s+([\'"])\.\/([^\'"]+)\1/i',
            static function (array $matches) use ($moduleName, $proxyBase): string {
                return 'from ' . $matches[1] . $proxyBase . rawurlencode($moduleName . '/' . $matches[2]) . $matches[1];
            },
            $content
        );

        $content = (string) preg_replace_callback(
            '/\bimport\s+([\'"])\.\/([^\'"]+)\1/i',
            static function (array $matches) use ($moduleName, $proxyBase): string {
                return 'import ' . $matches[1] . $proxyBase . rawurlencode($moduleName . '/' . $matches[2]) . $matches[1];
            },
            $content
        );

        header('Content-Type: application/javascript; charset=UTF-8');
        header('Cache-Control: no-store, no-cache, must-revalidate');
        echo $content;
    }
}
