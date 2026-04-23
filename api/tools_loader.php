<?php

declare(strict_types=1);

/**
 * tools_loader.php – serwuje prywatne pliki JS z kontrolą dostępu.
 *
 * Dostęp możliwy tylko do plików w katalogu private/tools/.
 * Zabezpiecza przed path traversal (brak '..' w ścieżce, realpath).
 *
 * Przykład użycia (GET):
 *   /api/tools_loader.php?file=private/tools/my_tool/helper.js
 */

// Sprawdź czy parametr file jest ustawiony
if (!isset($_GET['file'])) {
    http_response_code(400);
    exit('Brak parametru file');
}

$file = $_GET['file'];

// Zezwalaj tylko na ścieżki zaczynające się od 'private/tools/'
if (!str_starts_with($file, 'private/tools/')) {
    http_response_code(403);
    exit('Niedozwolona ścieżka');
}

// Zabezpieczenie przed path traversal
if (str_contains($file, '..')) {
    http_response_code(403);
    exit('Niedozwolona ścieżka');
}

$fullPath        = realpath(__DIR__ . '/../' . $file);
$privateToolsDir = realpath(__DIR__ . '/../private/tools/');

if (
    !$fullPath ||
    !$privateToolsDir ||
    !str_starts_with($fullPath, $privateToolsDir . DIRECTORY_SEPARATOR) ||
    !file_exists($fullPath)
) {
    http_response_code(404);
    exit('Plik nie istnieje');
}

header('Content-Type: application/javascript');
readfile($fullPath);
