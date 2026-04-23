<?php

declare(strict_types=1);

namespace App\Modules;

use App\Database\AccessTables;
use App\Database\Company;
use App\Database\CompanyUsers;
use App\Database\Users;
use App\Service\Session;
use PDO;

/**
 * User – moduł obsługi użytkowników.
 *
 * Obsługuje logowanie, rejestrację, wylogowanie oraz pobieranie uprawnień.
 * Wywoływany przez Router gdy żądanie zawiera `"modules": "user"`.
 *
 * Zależności są wstrzykiwane przez konstruktor (Dependency Injection),
 * a dostarcza je ModuleBuilder::user().
 */
class User
{
    public function __construct(
        private readonly PDO          $pdo,
        private readonly Session      $session,
        private readonly Users        $users,
        private readonly AccessTables $accessTables,
        private readonly CompanyUsers $companyUsers,
        private readonly Company      $company,
        private readonly mixed        $params
    ) {}

    // =========================================================================
    // Publiczne metody API
    // =========================================================================

    /**
     * Loguje użytkownika.
     *
     * Sprawdza dane wejściowe, weryfikuje poświadczenia w bazie, ustawia sesję
     * i pobiera dane firmy powiązanej z użytkownikiem.
     *
     * @return array{status: bool, message: string, session?: array<string, mixed>}
     */
    public function loginUsers(): array
    {
        if ($this->checkLoggedIn()) {
            return ['status' => true, 'message' => 'User is already logged in'];
        }

        if (!$this->checkEmailParam() || !$this->checkPasswordParam()) {
            return ['status' => false, 'message' => 'Email and password are required'];
        }
        if (!$this->checkEmailCorrect()) {
            return ['status' => false, 'message' => 'No valid email address'];
        }
        if (!$this->checkPasswordLength()) {
            return ['status' => false, 'message' => 'Password must be at least 8 characters long'];
        }

        if (!$this->users->checkUserExistsByEmail($this->pdo, $this->params['email'])) {
            return ['status' => false, 'message' => 'User with this email does not exist'];
        }
        if (!$this->users->checkUserActiveByEmail($this->pdo, $this->params['email'])) {
            return ['status' => false, 'message' => 'User account is not active'];
        }
        if (!$this->users->checkPasswordByEmail($this->pdo, $this->params['email'], $this->params['password'])) {
            return ['status' => false, 'message' => 'Incorrect password'];
        }

        $userId   = $this->users->getUserIdByEmail($this->pdo, $this->params['email']);
        $userData = $this->users->getUserDataById($this->pdo, $userId);

        $this->session->setKey('id_users',  $userData['id']);
        $this->session->setKey('role',      $userData['role']);
        $this->session->setKey('name',      $userData['name']);
        $this->session->setKey('last_name', $userData['last_name']);
        $this->session->setKey('email',     $userData['email']);
        $this->session->setKey('active',    $userData['active']);
        $this->session->setKey('lang',      $userData['lang'] ?? 'English');

        $companyId = $this->companyUsers->getCompanyIdUsers($this->pdo, (int) $userData['id']);
        if ($companyId['status']) {
            $this->session->setKey('company_id', $companyId['data']);
            $companyData = $this->company->getCompanyDataById($this->pdo, (int) $companyId['data']);
            $this->session->setKey('company_name', $companyData['status'] ? ($companyData['data']['name'] ?? null) : null);
        } else {
            $this->session->setKey('company_id',   null);
            $this->session->setKey('company_name', null);
        }

        return [
            'status'  => true,
            'message' => 'User logged in successfully',
            'session' => $this->session->getSession(),
        ];
    }

    /**
     * Rejestruje nowego użytkownika.
     *
     * @return array{status: bool, message: string}
     */
    public function registerUser(): array
    {
        if (!$this->checkEmailParam() || !$this->checkPasswordParam()) {
            return ['status' => false, 'message' => 'Email and password are required'];
        }
        if (!$this->checkEmailCorrect()) {
            return ['status' => false, 'message' => 'No valid email address'];
        }
        if (!$this->checkPasswordLength()) {
            return ['status' => false, 'message' => 'Password must be at least 8 characters long'];
        }
        if ($this->users->checkUserExistsByEmail($this->pdo, $this->params['email'])) {
            return ['status' => false, 'message' => 'User with this email already exists'];
        }

        $added = $this->users->addUser(
            $this->pdo,
            $this->params['email'],
            $this->params['password'],
            $this->params['name']      ?? null,
            $this->params['last_name'] ?? null,
            $this->params['role']      ?? null,
            (int) ($this->params['active'] ?? 1)
        );

        return $added
            ? ['status' => true,  'message' => 'User registered successfully']
            : ['status' => false, 'message' => 'Error registering user'];
    }

    /**
     * Wylogowuje użytkownika (niszczy sesję).
     *
     * @return array{status: bool, message: string}
     */
    public function logoutUsers(): array
    {
        if (!$this->checkLoggedIn()) {
            return ['status' => false, 'message' => 'User is not logged in'];
        }
        $this->session->destroy();
        return ['status' => true, 'message' => 'User logged out successfully'];
    }

    /**
     * Zwraca uprawnienia zalogowanego użytkownika do wskazanej tabeli.
     *
     * @param int    $userId    ID użytkownika.
     * @param string $tableName Nazwa tabeli.
     * @return array<string, mixed>
     */
    public function getUserPermissionsTables(int $userId, string $tableName): array
    {
        if (!$this->session->getKey('id_users') || empty($userId) || empty($tableName)) {
            return ['status' => false, 'message' => 'User is not logged in or missing id_users/table_name parameter'];
        }

        $permissions = $this->accessTables->getUserPermissionsTables($this->pdo, $userId, $tableName);
        if ($permissions !== false) {
            return ['status' => true, 'permissions' => $permissions];
        }
        return ['status' => false, 'message' => 'Error getting user permissions'];
    }

    // =========================================================================
    // Walidacja wewnętrzna
    // =========================================================================

    private function checkLoggedIn(): bool
    {
        return $this->session->getKey('id_users') !== null;
    }

    private function checkEmailParam(): bool
    {
        return isset($this->params['email']);
    }

    private function checkPasswordParam(): bool
    {
        return isset($this->params['password']);
    }

    private function checkEmailCorrect(): bool
    {
        return (bool) filter_var($this->params['email'], FILTER_VALIDATE_EMAIL);
    }

    private function checkPasswordLength(): bool
    {
        return strlen($this->params['password']) >= 8;
    }
}
