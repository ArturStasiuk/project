<?php

namespace App\Connect;

/**
 * Zarządza sesją PHP.
 */
class Session
{
    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function isActive(): bool
    {
        return session_status() === PHP_SESSION_ACTIVE;
    }

    public function setKey(string $key, mixed $value): void
    {
        $_SESSION[$key] = $value;
    }

    public function getKey(string $key): mixed
    {
        return $_SESSION[$key] ?? null;
    }

    public function deleteKey(string $key): void
    {
        unset($_SESSION[$key]);
    }

    public function getSession(): array
    {
        return $_SESSION;
    }

    public function destroy(): void
    {
        session_destroy();
    }
}
