<?php
class AdminSystem
{
    private $conn;
    private $access;
    private $getData;

    private $procedureSql;

    public function __construct($conn, $procedureSql, $getData, $access, )
    {
        $this->conn = $conn;
        $this->procedureSql = $procedureSql;
        $this->getData = $getData;
        $this->access = $access;
     
    }

    public function readAdminSystem(...$args): array
    {
        $idUsers = $this->access->sprawdzSesje();
        $this->access->sprawdzAktywneKonto($idUsers);
        $this->access->sprawdzDostepDoTabeli($idUsers, 'users', 'read');
        $table = 'users';
        $column = 'role';
        $value = 'admin system';

        // Przykład użycia nowego modułu
        // $this->setData->updateSomeValue(1, 'New Role');

        $data = $this->getData->get_records_by_value($table, $column, $value);

        return [
            'status' => true,
            'message' => 'success',
            'data' => $data,
        ];
    }
}
return AdminSystem::class;