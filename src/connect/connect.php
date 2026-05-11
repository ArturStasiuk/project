<?php
$c = require __DIR__ . '/database_config.php';
$conn = new mysqli($c['host'], $c['user'], $c['pass'], $c['name']);
if ($conn->connect_error) {
    throw new RuntimeException('Connection failed: ' . $conn->connect_error);
}
return $conn;
?>