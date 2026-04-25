<?php
/**
 * Klasa SESSION – zarządza sesją PHP użytkownika.
 * Umożliwia ustawianie, pobieranie i usuwanie kluczy sesji
 * oraz zniszczenie całej sesji (np. przy wylogowaniu).
 */
class SESSION {

    /**
     * Konstruktor – uruchamia sesję natychmiast po utworzeniu obiektu.
     */
    public function __construct()
    {
        session_start();
    }

    /**
     * Uruchamia sesję, jeśli nie jest jeszcze aktywna.
     */
    public function start()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Sprawdza, czy sesja jest aktualnie aktywna.
     * @return bool
     */
    public function isActive()
    {
        return session_status() === PHP_SESSION_ACTIVE;
    }

    /**
     * Ustawia wartość klucza w sesji.
     * @param string $key   Nazwa klucza.
     * @param mixed  $value Wartość do zapisania.
     */
    public function setKey($key, $value)
    {
        $_SESSION[$key] = $value;
    }

    /**
     * Pobiera wartość klucza z sesji.
     * @param string $key Nazwa klucza.
     * @return mixed|null Wartość lub null, jeśli klucz nie istnieje.
     */
    public function getKey($key)
    {
        return $_SESSION[$key] ?? null;
    }

    /**
     * Usuwa klucz z sesji.
     * @param string $key Nazwa klucza do usunięcia.
     */
    public function deleteKey($key)
    {
        unset($_SESSION[$key]);
    }

    /**
     * Zwraca całą tablicę $_SESSION.
     * @return array
     */
    public function getSession()
    {
        return $_SESSION;
    }

    /**
     * Niszczy aktywną sesję (np. przy wylogowaniu użytkownika).
     */
    public function destroy()
    {
        session_destroy();
    }
}
