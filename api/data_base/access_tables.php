
<?php // obsluga tabeli access_tables
class ACCESS_TABLES{
    
    public function __construct()
    {
  
    }

    // pobranie wszystkich i danych o podanym id_users z tabeli access_tables
    public function getAccessTablesByUserId($pdo, $id_users){
        $stmt = $pdo->prepare("SELECT * FROM access_tables WHERE id_users = :id_users");
        $stmt->execute(['id_users' => $id_users]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }






}




