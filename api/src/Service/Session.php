<?php

declare(strict_types=1);

namespace App\Service;

/**
 * Session – zarządza sesją PHP użytkownika.
 *
 * Umożliwia bezpieczne ustawianie, pobieranie i usuwanie kluczy sesji
 * oraz zniszczenie całej sesji (np. przy wylogowaniu).
 *
 * Sesja jest uruchamiana automatycznie w konstruktorze tylko wtedy,
 * gdy nie jest jeszcze aktywna.
 */
class Session
{
    /**
     * Konstruktor – uruchamia sesję, jeśli nie jest jeszcze aktywna.
     */
    public function __construct()
    {
        $this->start();
    }

    /**
     * Uruchamia sesję, jeśli jest w stanie PHP_SESSION_NONE.
     */
    public function start(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Sprawdza, czy sesja jest aktualnie aktywna.
     */
    public function isActive(): bool
    {
        return session_status() === PHP_SESSION_ACTIVE;
    }

    /**
     * Ustawia wartość klucza w sesji.
     *
     * @param string $key   Nazwa klucza.
     * @param mixed  $value Wartość do zapisania.
     */
    public function setKey(string $key, mixed $value): void
    {
        $_SESSION[$key] = $value;
    }

    /**
     * Pobiera wartość klucza z sesji.
     *
     * @param string $key Nazwa klucza.
     * @return mixed|null Wartość lub null, jeśli klucz nie istnieje.
     */
    public function getKey(string $key): mixed
    {
        return $_SESSION[$key] ?? null;
    }

    /**
     * Usuwa klucz z sesji.
     *
     * @param string $key Nazwa klucza do usunięcia.
     */
    public function deleteKey(string $key): void
    {
        unset($_SESSION[$key]);
    }

    /**
     * Zwraca całą tablicę $_SESSION.
     *
     * @return array<string, mixed>
     */
    public function getSession(): array
    {
        return $_SESSION;
    }

    /**
     * Niszczy aktywną sesję (np. przy wylogowaniu użytkownika).
     */
    public function destroy(): void
    {
        session_destroy();
    }
}
