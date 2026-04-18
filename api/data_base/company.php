<?php 
class COMPANY {

    public function __construct()
    {

    }
    // pobranie z tabeli company danych wszystkich firm
    public function getAllCompanyData($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM company");
            $companyData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['status' => true, 'data' => $companyData];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
  
    }





}