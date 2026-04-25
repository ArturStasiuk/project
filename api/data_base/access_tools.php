
<?php // obsluga tabeli access_tools - tu bedzie trzeba zrobic sprawdzanie ma dostemp do prywatnych narzędzi
class ACCESS_TOOLS{
    
    public function __construct()
    {
  
    }
    // pobranie rekordów z tabeli access_tools dla id_users
    public function getAccessToolsByUserId($pdo,$id_users)
    {
        $sql = "SELECT * FROM access_tools WHERE id_users = :id_users";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_users', $id_users, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC); 
    }



}




