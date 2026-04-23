<?php

declare(strict_types=1);

namespace App\Core;

use App\Config\ConfigDb;
use App\Connect\Connect;
use App\Database\AccessTables;
use App\Database\Company;
use App\Database\CompanyUsers;
use App\Database\Users;
use App\Service\Session;

/**
 * ModuleBuilder – fabryka zależności dla modułów aplikacji.
 *
 * Dla każdego modułu (klucz `modules` w żądaniu) ta klasa buduje
 * tablicę gotowych instancji, które są wstrzykiwane do konstruktora modułu.
 *
 * Dodanie nowego modułu wymaga:
 *  1. Dodania prywatnej metody o tej samej nazwie co klucz modułu.
 *  2. Zarejestrowania modułu w Router::MODULE_MAP.
 */
class ModuleBuilder
{
    /**
     * Buduje zależności dla danego modułu.
     *
     * @param string $moduleName Nazwa modułu (odpowiada kluczu w Router::MODULE_MAP).
     * @return array<string, mixed> Tablica instancji zależności lub pusta tablica.
     */
    public function build(string $moduleName): array
    {
        if (!method_exists($this, $moduleName)) {
            return [];
        }
        return $this->$moduleName();
    }

    // =========================================================================
    // Definicje zależności dla poszczególnych modułów
    // =========================================================================

    /**
     * Zależności dla modułu `user` (logowanie, rejestracja, wylogowanie).
     *
     * @return array{pdo: \PDO, session: Session, users: Users, access_tables: AccessTables, company_users: CompanyUsers, company: Company}
     */
    private function user(): array
    {
        $config  = new ConfigDb();
        $connect = new Connect();

        return [
            'pdo'           => $connect->connect($config->getConfig()),
            'session'       => new Session(),
            'users'         => new Users(),
            'access_tables' => new AccessTables(),
            'company_users' => new CompanyUsers(),
            'company'       => new Company(),
        ];
    }

    /**
     * Zależności dla modułu `modules_company` (operacje na danych firm).
     *
     * @return array{method: Method, table_company: Company, table_users: Users}
     */
    private function modules_company(): array
    {
        return [
            'method'        => new Method(),
            'table_company' => new Company(),
            'table_users'   => new Users(),
        ];
    }
}
