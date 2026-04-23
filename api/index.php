<?php

declare(strict_types=1);

/**
 * index.php – punkt wejścia (entry point) dla wszystkich żądań API.
 *
 * Ładuje autoloader Composera (PSR-4), opcjonalnie wczytuje zmienne
 * środowiskowe z pliku .env, a następnie uruchamia Router.
 *
 * Wszystkie żądania POST trafiają tutaj i są kierowane przez Router
 * do właściwych modułów lub metod lokalnych.
 */

require_once __DIR__ . '/vendor/autoload.php';

use App\Core\Router;
use Dotenv\Dotenv;

// Wczytaj .env jeśli plik istnieje (środowisko deweloperskie i produkcyjne)
$dotenvPath = __DIR__;
if (file_exists($dotenvPath . '/.env')) {
    $dotenv = Dotenv::createImmutable($dotenvPath);
    $dotenv->load();
}

(new Router())->handleRequest();
