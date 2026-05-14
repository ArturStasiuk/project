<?php

class TestClass
{
    public function test(...$args): array
    {
        return [
            'status' => true,
            'message' => 'This is a test response.',
            'data' => $args,
        ];
    }
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

function canCallMethod(object $object, string $method): bool
{
    if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $method) || !method_exists($object, $method)) {
        return false;
    }

    $reflection = new ReflectionMethod($object, $method);

    return $reflection->isPublic();
}

function jsonResponse($data): void
{
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

header('Content-Type: application/json; charset=utf-8');

$handler = new TestClass();
$method = getRequestMethodName();

if (!canCallMethod($handler, $method)) {
    jsonResponse([
        'status' => false,
        'message' => 'no method',
    ]);

    exit;
}

try {
    jsonResponse(call_user_func_array([$handler, $method], getRequestArguments()));
} catch (Throwable $exception) {
    jsonResponse([
        'status' => false,
        'message' => $exception->getMessage(),
    ]);
}
