<?php

/**
 * Konfiguracja aplikacji.
 *
 * W środowisku produkcyjnym zaleca się ustawienie wartości przez zmienne
 * środowiskowe (np. przez .env + bibliotekę vlucas/phpdotenv lub przez
 * konfigurację serwera) i usunięcie wartości domyślnych z tego pliku.
 */

return [
    'database' => [
        'host'     => $_ENV['DB_HOST']     ?? 'localhost',
        'user'     => $_ENV['DB_USER']     ?? 'root',
        'password' => $_ENV['DB_PASSWORD'] ?? 'azv470047azv',
        'database' => $_ENV['DB_NAME']     ?? 'project',
    ],
];
