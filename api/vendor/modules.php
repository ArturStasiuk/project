<?php
// Ten plik jest odpowiedzialny za dostarczanie klas MODULES i METHOD do głównego vendor.php
// Dzięki temu możemy trzymać te klasy w osobnych plikach, co poprawiaczytelność i organizację kodu.
class MODULES
{
    /**
     * Zwraca tablicę zależności dla danego modułu, np. "user".
     * To jest odpowiednik Twoich dawnych prywatnych metod user(), itp.
     */
    public function build(string $moduleName): array
    {
        if (!method_exists($this, $moduleName)) {
            return [];
        }
        return $this->$moduleName();
    }

    /**
     * modules user - wszystko co zwiazane z uzytkownikami
     */
    private function user(): array
    {
        include_once __DIR__ . '/../config/config_db.php';
        include_once __DIR__ . '/../connect/connect_db.php';

        $config_db  = new CONFIG_DB();
        $connect_db = new CONNECT();

        include_once __DIR__ . '/../service/session.php';
        include_once __DIR__ . '/../data_base/users.php';
        include_once __DIR__ . '/../data_base/access_tables.php';
        include_once __DIR__ . '/../data_base/company_users.php';
        include_once __DIR__ . '/../data_base/company.php';

        return [
            'pdo' => $connect_db->connect($config_db->getConfig()),
            'session' => new SESSION(),
            'users' => new USERS(),
            'access_tables' => new ACCESS_TABLES(),
            'company_users' => new COMPANY_USERS(),
            'company' => new COMPANY(),
        ];
    }

}