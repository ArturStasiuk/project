<?php

/**
 * Proxy do bezpiecznego serwowania plików JS modułów.
 *
 * Endpoint: GET /api/sys/module_loader.php?file=<modul>/<plik>.js
 *
 * URL tego pliku jest generowany przez ModuleLoader::listUserModules()
 * i nie powinien być zmieniany bez jednoczesnej aktualizacji klasy ModuleLoader.
 */

require_once __DIR__ . '/../autoload.php';

use App\Sys\ModuleLoader;

$file = $_GET['file'] ?? null;

if (!$file || !is_string($file)) {
    http_response_code(400);
    exit;
}

$loader = new ModuleLoader();
$loader->serveFile($file);
