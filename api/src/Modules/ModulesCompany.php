<?php

declare(strict_types=1);

namespace App\Modules;

use App\Core\Method;
use App\Database\Company;
use App\Database\Users;

/**
 * ModulesCompany – moduł operacji na danych firm.
 *
 * Obsługuje pobieranie danych firm i ich użytkowników.
 * Kontrola dostępu realizowana jest przez metodę checkReadAccess(),
 * która korzysta z Method::getAccessTables().
 *
 * Wywoływany przez Router gdy żądanie zawiera `"modules": "modules_company"`.
 */
class ModulesCompany
{
    public function __construct(
        private readonly Method  $method,
        private readonly Company $company,
        private readonly Users   $users,
        private readonly mixed   $param
    ) {}

    /**
     * Pobiera dane wszystkich firm.
     *
     * @return array<string, mixed>
     */
    public function getAllCompanyData(): array
    {
        if (!$this->checkReadAccess('company')) {
            return ['status' => false, 'message' => 'Brak dostępu do pobierania danych'];
        }
        return $this->company->getAllCompanyData($this->getDatabasePdo());
    }

    /**
     * Pobiera dane firmy o podanym id_company.
     *
     * @return array<string, mixed>
     */
    public function getCompanyDataById(): array
    {
        $idCompany = $this->param['id_company'] ?? null;
        if ($idCompany === null) {
            return ['status' => false, 'message' => 'ID firmy nie został przekazany'];
        }
        if (!$this->checkReadAccess('company')) {
            return ['status' => false, 'message' => 'Brak dostępu do pobierania danych'];
        }
        return $this->company->getCompanyDataById($this->getDatabasePdo(), (int) $idCompany);
    }

    /**
     * Pobiera listę użytkowników należących do firmy o podanym id_company.
     *
     * @return array<string, mixed>
     */
    public function getUsersByCompanyId(): array
    {
        $idCompany = $this->param['id_company'] ?? null;
        if ($idCompany === null) {
            return ['status' => false, 'message' => 'ID firmy nie został przekazany'];
        }
        if (!$this->checkReadAccess('users')) {
            return ['status' => false, 'message' => 'Brak dostępu do pobierania danych'];
        }
        $usersList = $this->users->getUsersByCompanyId($this->getDatabasePdo(), (int) $idCompany);
        return ['status' => true, 'data' => $usersList];
    }

    // =========================================================================
    // Pomocnicze
    // =========================================================================

    /**
     * Sprawdza, czy zalogowany użytkownik ma prawo odczytu wskazanej tabeli.
     *
     * @param string $table Nazwa tabeli.
     * @return bool True, jeśli dostęp jest dozwolony.
     */
    private function checkReadAccess(string $table): bool
    {
        $access = $this->method->getAccessTables(['tables' => $table]);
        return $access['status'] && $access['access_table'] && $access['read_record'];
    }

    /**
     * Pobiera obiekt PDO z Method::getDatabaseConnect().
     *
     * @return \PDO
     */
    private function getDatabasePdo(): \PDO
    {
        return $this->method->getDatabaseConnect()['pdo'];
    }
}
