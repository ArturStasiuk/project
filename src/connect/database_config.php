<?php
declare(strict_types=1);

/**
 * Wspolna konfiguracja polaczenia z MySQL (uzywana przez connect.php i bootstrap newAdmin).
 *
 * @return array{host: string, user: string, pass: string, name: string}
 */
return [
    'host' => 'localhost',
    'user' => 'root',
    'pass' => '',
    'name' => 'project',
];
