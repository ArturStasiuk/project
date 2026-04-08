<?php

namespace App\Database;

use App\Connect\Session;

/**
 * Obsługuje operacje na użytkownikach: logowanie, wylogowanie, rejestracja.
 *
 * Hasła są przechowywane jako hash bcrypt (password_hash / password_verify).
 * Jeśli w bazie istnieją konta z hasłami w postaci czystego tekstu (ze
 * starszej wersji aplikacji), należy je ponownie zahashować przed użyciem.
 */
class Users
{
    /**
     * Logowanie użytkownika.
     *
     * @return array{status: bool, message?: string, data?: array<string, mixed>}
     */
    public function loginUsers(\mysqli $conn, ?string $email, ?string $password, Session $session): array
    {
        if (empty($email) || empty($password)) {
            $session->destroy();
            return ['status' => false, 'message' => 'Email and password are required'];
        }

        $stmt = $conn->prepare('SELECT * FROM users WHERE email = ? AND active = 1');
        if (!$stmt) {
            return ['status' => false, 'message' => 'Internal error'];
        }

        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $stmt->close();

            if (isset($user['password']) && password_verify($password, $user['password'])) {
                unset($user['password']);
                $session->setKey('logIn', true);
                $session->setKey('id', $user['id']);
                $session->setKey('email', $user['email']);
                $session->setKey('name', $user['name']);
                $session->setKey('last_name', $user['last_name'] ?? '');

                return ['status' => true, 'message' => 'Login successful', 'data' => $user];
            }
        }

        $session->destroy();
        return ['status' => false, 'message' => 'Invalid email or password'];
    }

    /**
     * Wylogowanie użytkownika.
     *
     * @return array{status: bool, message: string}
     */
    public function logoutUsers(Session $session): array
    {
        $session->destroy();
        return ['status' => true, 'message' => 'Logout successful'];
    }

    /**
     * Rejestracja nowego użytkownika.
     * Hasło jest automatycznie hashowane przed zapisem do bazy.
     *
     * @return array{status: bool, message?: string, error?: string}
     */
    public function registerUsers(\mysqli $conn, ?string $email, ?string $password, ?string $name): array
    {
        if (empty($email) || empty($password) || empty($name)) {
            return ['status' => false, 'message' => 'Email, password and name are required'];
        }

        $stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
        if (!$stmt) {
            return ['status' => false, 'message' => 'Internal error'];
        }
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->close();
            return ['status' => false, 'message' => 'Email is already registered'];
        }
        $stmt->close();

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt           = $conn->prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
        if (!$stmt) {
            return ['status' => false, 'message' => 'Internal error'];
        }
        $stmt->bind_param('sss', $email, $hashedPassword, $name);

        if ($stmt->execute()) {
            $stmt->close();
            return ['status' => true, 'message' => 'Registration successful'];
        }

        $error = $conn->error;
        $stmt->close();
        return ['status' => false, 'error' => 'Error during registration: ' . $error];
    }
}
