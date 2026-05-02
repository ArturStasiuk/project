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
    
  /** pobranie aktywnych użytkowników firmy na podstawie tabel company_users i users */
  public function getActiveUsersByCompanyId($pdo, $companyId){
      $stmt = $pdo->prepare("SELECT u.id, u.role, u.name, u.last_name, u.email, cu.active AS active, u.lang 
                             FROM users u
                             INNER JOIN company_users cu ON u.id = cu.id_users
                             WHERE cu.id_company = :company_id AND cu.active = 1");
      $stmt->execute(['company_id' => $companyId]);
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  /** pobranie nieaktywnych użytkowników firmy na podstawie tabel company_users i users */
  public function getInactiveUsersByCompanyId($pdo, $companyId){
      $stmt = $pdo->prepare("SELECT u.id, u.role, u.name, u.last_name, u.email, cu.active AS active, u.lang 
                             FROM users u
                             INNER JOIN company_users cu ON u.id = cu.id_users
                             WHERE cu.id_company = :company_id AND cu.active = 0");
      $stmt->execute(['company_id' => $companyId]);
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}