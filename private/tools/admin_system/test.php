<?php

function test(): array
{
    return [
        'status' => true,
        'message' => 'This is a test response.',
    ];
}

function getRequestMethodName(): string
{
    return (string) ($_REQUEST['method'] ?? $_REQUEST['action'] ?? '');
}

function getRequestArguments(): array
{
    $arguments = $_REQUEST['args'] ?? [];

    if (is_string($arguments)) {
        $decodedArguments = json_decode($arguments, true);

        return is_array($decodedArguments) ? $decodedArguments : [$arguments];
    }

    return is_array($arguments) ? $arguments : [];
}

function canCallMethod(string $method): bool
{
    if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $method) || !function_exists($method)) {
        return false;
    }

    $reflection = new ReflectionFunction($method);

    return $reflection->getFileName() === __FILE__;
}

header('Content-Type: application/json; charset=utf-8');

$method = getRequestMethodName();

if (!canCallMethod($method)) {
    echo json_encode([
        'status' => false,
        'message' => 'no method',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    exit;
}

$result = call_user_func_array($method, getRequestArguments());

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
