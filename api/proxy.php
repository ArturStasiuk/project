<?php
// Prosty proxy do zapytań do Google Suggest
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

if (!isset($_GET['q'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak parametru q']);
    exit;
}

// Budujemy URL do Google Suggest
$params = http_build_query($_GET);
$url = 'https://www.google.com/complete/search?' . $params;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
