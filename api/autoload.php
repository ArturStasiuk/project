<?php

/**
 * PSR-4 Autoloader
 *
 * Automatycznie ładuje klasy na podstawie ich namespace i nazwy pliku.
 * Namespace App\ jest mapowany na katalog api/.
 *
 * Konwencja nazewnictwa:
 *   App\Connect\Router      => api/connect/Router.php
 *   App\Database\Users      => api/database/Users.php
 *   App\Sys\ModuleLoader    => api/sys/ModuleLoader.php
 *
 * Aby dodać nową klasę: utwórz plik PHP w odpowiednim podkatalogu api/
 * z namespace App\<NazwaKatalogu> i klasą o tej samej nazwie co plik.
 * Nie trzeba nic zmieniać w autoloaderze ani w routerze.
 */

spl_autoload_register(function (string $class): void {
    $prefix  = 'App\\';
    $baseDir = __DIR__ . '/';

    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    $relativeClass = substr($class, strlen($prefix));
    $file          = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});
