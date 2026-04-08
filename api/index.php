<?php

/**
 * Punkt wejścia API (entry point).
 *
 * Wszystkie żądania POST z przeglądarki (przez api.js) trafiają tutaj.
 * Plik ładuje autoloader, ustawia nagłówki i uruchamia router.
 */

ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'error' => 'Only POST requests are allowed']);
    exit;
}

require_once __DIR__ . '/autoload.php';

use App\Connect\Router;

new Router();
