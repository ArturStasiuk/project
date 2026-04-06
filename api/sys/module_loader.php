<?php
/**
 * Proxy do bezpiecznego serwowania plików modułów JS.
 * Sprawdza uprawnienia użytkownika przed wysłaniem pliku.
 */

// Sprawdzenie czy użytkownik jest zalogowany – narazie zakomentowane
// require_once __DIR__ . '/../conect/session.php';
// $session = new SESSION();
// if (!$session->getKey('logIn')) {
//     http_response_code(403);
//     exit;
// }
// $userId = $session->getKey('id');

$file = $_GET['file'] ?? null;

if (!$file) {
    http_response_code(400);
    exit;
}

// Wczesny fast-fail przed path traversal (PHP dekoduje wartości GET przed tym sprawdzeniem,
// więc %2e%2e zostanie odczytane jako '..').
// Ostateczną barierą bezpieczeństwa jest sprawdzenie realpath() poniżej.
$file = str_replace('\\', '/', $file);
if (strpos($file, '..') !== false || str_starts_with($file, './') || str_starts_with($file, '/')) {
    http_response_code(403);
    exit;
}

// Wyciągnięcie nazwy modułu (pierwszy segment ścieżki)
$parts = explode('/', $file, 2);
$moduleName = $parts[0];

// Lista aktywnych modułów – narazie na sztywno, docelowo pobierana z bazy danych
// Przeniesiona z system.php (getInfoModulesForUser)
$allowedModules = ['usercontolpanel', 'notepad'];

if (!in_array($moduleName, $allowedModules)) {
    http_response_code(403);
    exit;
}

// Budowanie bezpiecznej ścieżki do pliku
$modulesDir = realpath(__DIR__ . '/../../modules');
$fullPath = realpath($modulesDir . '/' . $file);

// Zabezpieczenie: upewnij się że plik jest wewnątrz katalogu modules
if ($fullPath === false || !str_starts_with($fullPath, $modulesDir . DIRECTORY_SEPARATOR)) {
    http_response_code(403);
    exit;
}

// Sprawdzenie rozszerzenia – serwujemy tylko pliki .js
if (pathinfo($fullPath, PATHINFO_EXTENSION) !== 'js') {
    http_response_code(403);
    exit;
}

if (!file_exists($fullPath)) {
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
