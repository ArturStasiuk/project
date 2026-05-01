
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

    // pobranie pojedynczego rekordu z tabeli access_tools dla id_users i tools_name
    public function getAccessToolsByUserIdAndTool($pdo, $id_users, $tools_name)
    {
        $sql = "SELECT * FROM access_tools WHERE id_users = :id_users AND tools_name = :tools_name LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_users', $id_users, PDO::PARAM_INT);
        $stmt->bindParam(':tools_name', $tools_name, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


}




