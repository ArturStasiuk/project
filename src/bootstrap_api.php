<?php
declare(strict_types=1);

/**
 * Wspólna inicjalizacja dla całego endpointu JSON (src/api.php):
 * sesja, nagłówek Content-Type, przekształcenie ostrzeżeń PHP w wyjątki,
 * żeby odpowiedź nie była HTML-em parsowanym jako JSON po stronie klienta.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
}

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});
