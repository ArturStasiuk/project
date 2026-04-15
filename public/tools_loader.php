<?php
// Loader JS z katalogu private/tools/ z kontrolą dostępu

// Sprawdź czy parametr file jest ustawiony
if (!isset($_GET['file'])) {
    error_log('tools_loader.php: Brak parametru file');
    http_response_code(400);
    exit('Brak parametru file');
}

$file = $_GET['file'];
error_log('tools_loader.php: Otrzymano żądanie pliku: ' . $file);

// Zezwalaj tylko na ścieżki zaczynające się od 'private/tools/'
if (strpos($file, 'private/tools/') !== 0) {
    error_log('tools_loader.php: Niedozwolona ścieżka (prefix) - ' . $file);
    http_response_code(403);
    exit('Niedozwolona ścieżka');
}

// Zabezpieczenie przed ../
if (strpos($file, '..') !== false) {
    error_log('tools_loader.php: Niedozwolona ścieżka (.. w ścieżce) - ' . $file);
    http_response_code(403);
    exit('Niedozwolona ścieżka');
}

$fullPath = realpath(__DIR__ . '/../' . $file);
$privateToolsDir = realpath(__DIR__ . '/../private/tools/');
error_log('tools_loader.php: Pełna ścieżka resolved: ' . $fullPath);
error_log('tools_loader.php: Katalog private/tools resolved: ' . $privateToolsDir);

// Sprawdź czy plik istnieje i jest w katalogu private/tools
if (!$fullPath || strpos($fullPath, $privateToolsDir) !== 0 || !file_exists($fullPath)) {
    error_log('tools_loader.php: Plik nie istnieje lub poza katalogiem private/tools: ' . $fullPath);
    http_response_code(404);
    exit('Plik nie istnieje');
}

header('Content-Type: application/javascript');
readfile($fullPath);
