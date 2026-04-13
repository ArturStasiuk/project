<?php
class COMPANY_USERS
{

    public function __construct()
    {

    }
// pobranie z tabeli company_users do jakiej firmy id_company należy użytkownik 
    public function getCompanyIdUsers($pdo, $userId) {
        $sql = "SELECT id_company FROM company_users WHERE id_users = :userId AND active = 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['userId' => $userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && isset($row['id_company'])) {
            return [
                'status' => true,
                'message' => 'Company ID retrieved successfully',
                'data' => $row['id_company']
            ];
        }
        return [
            'status' => false,
            'message' => 'No company association found for this user',
            'data' => null
        ];
    }


}