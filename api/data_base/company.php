<?php 
class COMPANY {

    public function __construct()
    {

    }
    // pobranie z tabeli company danych firmy po id firmy
    public function getCompanyData($pdo, $companyId) {
        $sql = "SELECT * FROM company WHERE id = :companyId AND active = 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['companyId' => $companyId]);
        $companyData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($companyData) {
            return [
                'status' => true,
                'message' => 'Company data retrieved successfully',
                'data' => $companyData
            ];
        }else {
            return [
                'status' => false,
                'message' => 'Company not found or inactive',
                'data' => null
            ];
        }
    }





}