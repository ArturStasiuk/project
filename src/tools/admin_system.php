<?php
class AdminSystem
{
    private $conn;
    private $access;
    private $getData;

    private $procedureSql;
    private $constructorArgs;

    public function __construct($conn, $procedureSql, $getData, $access, ...$args)
    {
        $this->conn = $conn;
        $this->procedureSql = $procedureSql;
        $this->getData = $getData;
        $this->access = $access;
        $this->constructorArgs = $args;
     
    }

    public function getAdminSystem(...$args): array
    {
        $idUsers = $this->access->sprawdzSesje();
        $this->access->sprawdzAktywneKonto($idUsers);
        $this->access->sprawdzDostepDoTabeli($idUsers, 'users', 'read');
        $table = 'users';
        $column = 'role';
        $value = 'admin system';
        $data = $this->getData->get_records_by_value($table, $column, $value);
        $dat1 = $this->getData->get_records_by_value('company', 'name', 'administracja systemu');
        return [
            'status' => true,
            'message' => 'success',
            'admin_sytemu' => $data,
            'company_data' => $dat1,
        ];
    }
}
return AdminSystem::class;