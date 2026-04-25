
<?php // obsluga tabeli access_tables
class ACCESS_TABLES{
    
    public function __construct()
    {
  
    }

    /** pobranie uprawnien users po id_users jakie ma uprawnienia do tabeli */
    public function getUserPermissionsTables($pdo , $id_users, $table_name) {
        $sql = "SELECT access_table, add_record, read_record, update_record, delete_record FROM access_tables WHERE id_users = :id_users AND tables = :table_name LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_users', $id_users, PDO::PARAM_INT);
        $stmt->bindParam(':table_name', $table_name, PDO::PARAM_STR);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return [
                'status' => true,
                'access_table' => (bool)$row['access_table'],
                'add_record' => (bool)$row['add_record'],
                'read_record' => (bool)$row['read_record'],
                'update_record' => (bool)$row['update_record'],
                'delete_record' => (bool)$row['delete_record'],
            ];
        } else {
            return [
                'status' => false,
                'access_table' => false,
                'add_record' => false,
                'read_record' => false,
                'update_record' => false,
                'delete_record' => false,
            ];
        }
    }




}




