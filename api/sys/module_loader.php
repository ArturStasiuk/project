<?php
/**
 * Moduł ładowania plików JS.
 * Zawiera funkcje do pobierania listy modułów oraz proxy do serwowania plików JS modułów.
 */

// Zwraca listę modułów dostępnych dla użytkownika – narazie dane na sztywno, docelowo z bazy danych
// $userId – narazie nieużywany, docelowo będzie filtrować moduły z bazy danych dla konkretnego użytkownika
function getInfoModulesForUser($userId = null) {
    $modules = [];
    $modules[] = [
        'modules_name' => 'usercontolpanel',
        'active' => '1',
        'read' => '1',
        'append' => '1',
        'clear' => '1',
        'modify' => '1',
    ];
    $modules[] = [
        'modules_name' => 'notepad',
        'active' => '0',
        'read' => '1',
        'append' => '1',
        'clear' => '1',
        'modify' => '1',
    ];
    return ['status' => true, 'modules' => $modules];
}

// Zwraca listę URL-i plików JS aktywnych modułów dostępnych dla użytkownika
function getInfoModules($userId = null) {
    $modulesDir = __DIR__ . '/../../modules';
    $jsFiles = [];

    // Pobierz listę aktywnych modułów dla użytkownika
    // Sprawdzenie czy użytkownik jest zalogowany – narazie zakomentowane
    // if ($userId !== null) { ... }

    // Narazie aktywne moduły na sztywno
    $allowedModules = null;
    $userModulesInfo = getInfoModulesForUser($userId);
    if ($userModulesInfo['status']) {
        $allowedModules = [];
        foreach ($userModulesInfo['modules'] as $mod) {
            if (isset($mod['active']) && $mod['active'] === '1') {
                $allowedModules[] = $mod['modules_name'];
            }
        }
    }

    $resolvedDir = realpath($modulesDir);
    if ($resolvedDir && is_dir($resolvedDir)) {
        $dirHandle = opendir($resolvedDir);
        if ($dirHandle) {
            while (($entry = readdir($dirHandle)) !== false) {
                if ($entry !== '.' && $entry !== '..' && is_dir($resolvedDir . '/' . $entry)) {
                    if ($allowedModules !== null && !in_array($entry, $allowedModules)) {
                        continue;
                    }
                    $jsFile = $resolvedDir . '/' . $entry . '/' . $entry . '.js';
                    if (file_exists($jsFile)) {
                        $jsFiles[] = '/api/sys/module_loader.php?file=' . rawurlencode($entry . '/' . $entry . '.js');
                    }
                }
            }
            closedir($dirHandle);
        }
    }
    return ['status' => true, 'jsFiles' => $jsFiles];
}

// Jeśli plik jest dołączony (included) przez inny skrypt, nie wykonujemy kodu serwowania pliku
if (defined('MODULE_LOADER_INCLUDED')) {
    return;
}

// --- Proxy do bezpiecznego serwowania plików modułów JS ---

// Sprawdzenie czy użytkownik jest zalogowany – narazie zakomentowane
// require_once __DIR__ . '/../conect/session.php';
// $session = new SESSION();
// if (!$session->getKey('logIn')) {
//     http_response_code(403);
//     exit;
// }
// $userId = $session->getKey('id');


$file = $_GET['file'] ?? null;
error_log("[module_loader] file param: " . var_export($file, true));

if (!$file) {
    error_log("[module_loader] Brak parametru file");
    http_response_code(400);
    exit;
}

// Wczesny fast-fail przed path traversal (PHP dekoduje wartości GET przed tym sprawdzeniem,
// więc %2e%2e zostanie odczytane jako '..').
// Ostateczną barierą bezpieczeństwa jest sprawdzenie realpath() poniżej.
$file = str_replace('\\', '/', $file);
if (strpos($file, '..') !== false || str_starts_with($file, './') || str_starts_with($file, '/')) {
    error_log("[module_loader] Niedozwolona ścieżka: $file");
    http_response_code(403);
    exit;
}

// Wyciągnięcie nazwy modułu (pierwszy segment ścieżki)
$parts = explode('/', $file, 2);
$moduleName = $parts[0];

// Pobierz listę aktywnych modułów z funkcji przeniesionej z system.php
$userModulesInfo = getInfoModulesForUser();
$allowedModules = [];
foreach ($userModulesInfo['modules'] as $mod) {
    if (isset($mod['active']) && $mod['active'] === '1') {
        $allowedModules[] = $mod['modules_name'];
    }
}

if (!in_array($moduleName, $allowedModules)) {
    error_log("[module_loader] Moduł niedozwolony: $moduleName");
    http_response_code(403);
    exit;
}

// Budowanie bezpiecznej ścieżki do pliku

$modulesDir = realpath(__DIR__ . '/../../modules');
$fullPath = realpath($modulesDir . '/' . $file);
error_log("[module_loader] modulesDir: $modulesDir, fullPath: $fullPath");

// Zabezpieczenie: upewnij się że plik jest wewnątrz katalogu modules
if ($fullPath === false || !str_starts_with($fullPath, $modulesDir . DIRECTORY_SEPARATOR)) {
    error_log("[module_loader] Plik poza katalogiem modules lub nie istnieje: $fullPath");
    http_response_code(403);
    exit;
}

// Sprawdzenie rozszerzenia – serwujemy tylko pliki .js
if (pathinfo($fullPath, PATHINFO_EXTENSION) !== 'js') {
    error_log("[module_loader] Niedozwolone rozszerzenie: $fullPath");
    http_response_code(403);
    exit;
}

if (!file_exists($fullPath)) {
    error_log("[module_loader] Plik nie istnieje: $fullPath");
    http_response_code(404);
    exit;
}

$content = file_get_contents($fullPath);

// Przepisanie względnych importów ES-modułów tak, aby przechodziły przez ten proxy.
// Obsługuje wzorce: import X from './file.js' oraz import './file.js'
$proxyBase = '/api/sys/module_loader.php?file=';
$content = preg_replace_callback(
    '/\bfrom\s+([\'"])\.\/([^\'"]+)\1/i',
    function ($matches) use ($moduleName, $proxyBase) {
        $quote = $matches[1];
        $relFile = $matches[2];
        return 'from ' . $quote . $proxyBase . rawurlencode($moduleName . '/' . $relFile) . $quote;
    },
    $content
);
$content = preg_replace_callback(
    '/\bimport\s+([\'"])\.\/([^\'"]+)\1/i',
    function ($matches) use ($moduleName, $proxyBase) {
        $quote = $matches[1];
        $relFile = $matches[2];
        return 'import ' . $quote . $proxyBase . rawurlencode($moduleName . '/' . $relFile) . $quote;
    },
    $content
);

header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
echo $content;
