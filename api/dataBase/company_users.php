<?php
class COMPANY_USERS
{

    public function __construct()
    {

    }
// pobranie z tabeli company_users do jakiej firmy id_company należy użytkownik 
    public function getCompanyUsers($conection, $userId) {
        $sql = "SELECT id_company FROM company_users WHERE id_users = '$userId'";
        $result = $conection->query($sql);
        if ($result && $result->num_rows > 0) {
            $companyIds = [];
            while ($row = $result->fetch_assoc()) {
                $companyIds[] = $row['id_company'];
            }
            return [
                'status' => true,
                'message' => 'Company IDs retrieved successfully',
                'data' => $companyIds
            ];
        }
        return [
            'status' => false,
            'message' => 'No company associations found for this user'
        ];
    }


}