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
   /** pobranie danych jednej firmy po ID */
    public function getCompanyDataById($pdo, $id) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM company WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $companyData = $stmt->fetch(PDO::FETCH_ASSOC);
            return ['status' => true, 'data' => $companyData];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
    
    // wyszukanie firmy po nazwie lub NIP / tax_id lub regon lub email
    public function searchCompany($pdo, $searchTerm) {
        try {
            $likeSearchTerm = '%' . $searchTerm . '%';
            $numericSearchTerm = preg_replace('/\D+/', '', $searchTerm);
            $query = "SELECT * FROM company WHERE name LIKE :searchTerm OR email LIKE :searchTerm";
            $params = [':searchTerm' => $likeSearchTerm];

            if ($numericSearchTerm !== '') {
                $likeNumericSearchTerm = '%' . $numericSearchTerm . '%';
                $query .= " OR REPLACE(REPLACE(REPLACE(REPLACE(tax_id, ' ', ''), '-', ''), '.', ''), '/', '') LIKE :numericSearchTerm";
                $query .= " OR REPLACE(REPLACE(REPLACE(REPLACE(regon, ' ', ''), '-', ''), '.', ''), '/', '') LIKE :numericSearchTerm";
                $params[':numericSearchTerm'] = $likeNumericSearchTerm;
            }

            $stmt = $pdo->prepare($query);
            foreach ($params as $param => $value) {
                $stmt->bindValue($param, $value, PDO::PARAM_STR);
            }
            $stmt->execute();
            $companyData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['status' => true, 'data' => $companyData];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    public function companyExists($pdo, $field, $value, $excludeId = null) {
        $allowedFields = ['name', 'tax_id', 'regon', 'email', 'krs'];
        if (!in_array($field, $allowedFields, true)) {
            return false;
        }

        $searchValue = trim($value);
        if ($searchValue === '') {
            return false;
        }

        switch ($field) {
            case 'name':
                $sql = "SELECT id FROM company WHERE LOWER(name) = LOWER(:value)";
                break;
            case 'email':
                $sql = "SELECT id FROM company WHERE LOWER(email) = LOWER(:value)";
                break;
            case 'tax_id':
                $searchValue = preg_replace('/\D+/', '', $searchValue);
                if ($searchValue === '') {
                    return false;
                }
                $sql = "SELECT id FROM company WHERE REPLACE(REPLACE(REPLACE(REPLACE(tax_id, ' ', ''), '-', ''), '.', ''), '/', '') = :value";
                break;
            case 'regon':
                $searchValue = preg_replace('/\D+/', '', $searchValue);
                if ($searchValue === '') {
                    return false;
                }
                $sql = "SELECT id FROM company WHERE REPLACE(REPLACE(REPLACE(REPLACE(regon, ' ', ''), '-', ''), '.', ''), '/', '') = :value";
                break;
            case 'krs':
                $searchValue = preg_replace('/\D+/', '', $searchValue);
                if ($searchValue === '') {
                    return false;
                }
                $sql = "SELECT id FROM company WHERE REPLACE(REPLACE(REPLACE(REPLACE(krs, ' ', ''), '-', ''), '.', ''), '/', '') = :value";
                break;
            default:
                return false;
        }

        if ($excludeId !== null) {
            $sql .= ' AND id != :excludeId';
        }

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':value', $searchValue, PDO::PARAM_STR);
        if ($excludeId !== null) {
            $stmt->bindValue(':excludeId', $excludeId, PDO::PARAM_INT);
        }
        $stmt->execute();

        return $stmt->fetchColumn() !== false;
    }

    // dodanie nowej firmy do bazy danych
    public function addCompany($pdo, $companyData) {
        try {
            $stmt = $pdo->prepare("INSERT INTO company (name, type, active, tax_id, regon, krs, address, city, postal_code, country, phone, email, website) VALUES (:name, :type, :active, :tax_id, :regon, :krs, :address, :city, :postal_code, :country, :phone, :email, :website)");
            $stmt->bindParam(':name', $companyData['name'], PDO::PARAM_STR);
            $stmt->bindParam(':type', $companyData['type'], PDO::PARAM_STR);
            $stmt->bindParam(':active', $companyData['active'], PDO::PARAM_INT);
            $stmt->bindParam(':tax_id', $companyData['tax_id'], PDO::PARAM_STR);
            $stmt->bindParam(':regon', $companyData['regon'], PDO::PARAM_STR);
            $stmt->bindParam(':krs', $companyData['krs'], PDO::PARAM_STR);
            $stmt->bindParam(':address', $companyData['address'], PDO::PARAM_STR);
            $stmt->bindParam(':city', $companyData['city'], PDO::PARAM_STR);
            $stmt->bindParam(':postal_code', $companyData['postal_code'], PDO::PARAM_STR);
            $stmt->bindParam(':country', $companyData['country'], PDO::PARAM_STR);
            $stmt->bindParam(':phone', $companyData['phone'], PDO::PARAM_STR);
            $stmt->bindParam(':email', $companyData['email'], PDO::PARAM_STR);
            $stmt->bindParam(':website', $companyData['website'], PDO::PARAM_STR);
            $stmt->execute();
            return ['status' => true, 'message' => 'Company added successfully'];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

     // aktualizacja danych firmy w bazie danych
    public function updateCompany($pdo, $companyData) {
        try {
            $stmt = $pdo->prepare("UPDATE company SET name = :name, type = :type, active = :active, tax_id = :tax_id, regon = :regon, krs = :krs, address = :address, city = :city, postal_code = :postal_code, country = :country, phone = :phone, email = :email, website = :website WHERE id = :id");
            $stmt->bindParam(':id', $companyData['id'], PDO::PARAM_INT);
            $stmt->bindParam(':name', $companyData['name'], PDO::PARAM_STR);
            $stmt->bindParam(':type', $companyData['type'], PDO::PARAM_STR);
            $stmt->bindParam(':active', $companyData['active'], PDO::PARAM_INT);
            $stmt->bindParam(':tax_id', $companyData['tax_id'], PDO::PARAM_STR);
            $stmt->bindParam(':regon', $companyData['regon'], PDO::PARAM_STR);
            $stmt->bindParam(':krs', $companyData['krs'], PDO::PARAM_STR);
            $stmt->bindParam(':address', $companyData['address'], PDO::PARAM_STR);
            $stmt->bindParam(':city', $companyData['city'], PDO::PARAM_STR);
            $stmt->bindParam(':postal_code', $companyData['postal_code'], PDO::PARAM_STR);
            $stmt->bindParam(':country', $companyData['country'], PDO::PARAM_STR);
            $stmt->bindParam(':phone', $companyData['phone'], PDO::PARAM_STR);
            $stmt->bindParam(':email', $companyData['email'], PDO::PARAM_STR);
            $stmt->bindParam(':website', $companyData['website'], PDO::PARAM_STR);
            $stmt->execute();
            return ['status' => true, 'message' => 'Company updated successfully'];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
    // usuniecie firmy z bazy danych po ID
    public function deleteCompanyById($pdo, $id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM company WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return ['status' => true, 'message' => 'Company deleted successfully'];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }


}
/* tabela company
 * CREATE TABLE `company` (
 *   `id` int(11) NOT NULL COMMENT 'Company unique ID',
 *   `name` varchar(255) NOT NULL COMMENT 'Company name',
 *   `type` varchar(100) NOT NULL COMMENT 'Company type',
 *   `active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Is active',
 *   `tax_id` varchar(50) DEFAULT NULL COMMENT 'NIP',
 *   `regon` varchar(50) DEFAULT NULL COMMENT 'REGON',
 *   `krs` varchar(50) DEFAULT NULL COMMENT 'KRS',
 *   `address` varchar(255) DEFAULT NULL COMMENT 'Address',
 *   `city` varchar(100) DEFAULT NULL COMMENT 'City',
 *   `postal_code` varchar(20) DEFAULT NULL COMMENT 'Postal code',
 *   `country` varchar(100) DEFAULT NULL COMMENT 'Country',
 *   `phone` varchar(50) DEFAULT NULL COMMENT 'Phone',
 *   `email` varchar(100) DEFAULT NULL COMMENT 'Email',
 *   `website` varchar(100) DEFAULT NULL COMMENT 'Website',
 *   `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created at',
 *   `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updated at'
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Company data table';
 */