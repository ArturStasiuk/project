<?php
// src/bootstrap.php

/**
 * Rejestr ścieżek absolutnych.
 * Użycie __DIR__ gwarantuje, że ścieżka będzie poprawna niezależnie od tego, 
 * skąd bootstrap zostanie dołączony.
 */
// sciezka do polaczenia z baza danych
define('PATH_CONNECT', __DIR__ . '/connect/connect.php');
// sciezka do procedur php
define('PATH_PROCEDURES_PHP', __DIR__ . '/procedure/procedure_php.php');
// sciezka do procedur sql
define('PATH_PROCEDURES_SQL', __DIR__ . '/procedure/procedure_sql.php');
// sciezka do pliku access.php
define('PATH_ACCESS', __DIR__ . '/modules/access.php');
// sciezka do pliku get_data.php
define('PATH_GET_DATA', __DIR__ . '/modules/get_data.php');
// sciezka do pliku loadPrivateModules.php
define('PATH_LOAD_PRIVATE_MODULES', __DIR__ . '/modules/loadPrivateModules.php');
