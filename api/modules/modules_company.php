<?php 
/** Obsługuje operacje na tabeli company (firmy). Wymaga dostępu do tabel company i users. */
class MODULES_COMPANY {

 
    private $company;// dostep do tabeli company
    private $param;//  parametry przekazane z vendor.php
    private $method;// dostep do klasy METHOD
    private $users;// dostep do tabeli users
    private $company_users;// dostep do tabeli company_users
    
    public function __construct( $method, $company, $users, $company_users, $param = null)
    {
        $this->method = $method;
        $this->company = $company;//
        $this->users = $users;//
        $this->company_users = $company_users;//
        $this->param = $param;
    }
        

        

  // pobranie z tabeli company danych firm   
   public function getAllCompanyData() {
    if (! $this->checkReadAccess('company')){
     return ['status'=> false , 'message'=>'Access denied to read company data'];
    }
    else{
     return $this->company->getAllCompanyData($this->method->getDatabaseConnect()['pdo']) ;    
    }
   }
  // pobranie z tabeli company  danych firmy o podanym id_company
   public function getCompanyDataById() {
     $id_company = $this->param['id_company'] ?? null;
     if ($id_company === null) {
         return ['status' => false, 'message' => 'Company ID was not provided'];
     }  
    if (! $this->checkReadAccess('company')){
     return ['status'=> false , 'message'=>'Access denied to read company data'];
    }
    else{
     return $this->company->getCompanyDataById($this->method->getDatabaseConnect()['pdo'], $id_company) ;    
    }
   }

   // pobranie danych uzytkownikow po id_company z tabeli users na podstawie tabeli company_users
   public function getUsersByCompanyId() {
    $id_company = $this->param['id_company'] ?? null;
    if ($id_company === null) {
        return ['status' => false, 'message' => 'Company ID was not provided'];
    }
    if (! $this->checkReadAccess('users')){
     return ['status'=> false , 'message'=>'Access denied to read users data'];
    }
    else{
     $users = $this->users->getUsersByCompanyId($this->method->getDatabaseConnect()['pdo'], $id_company);
     return ['status' => true, 'data' => $users];    
    }
   }
   /** pobranie aktywnych użytkowników firmy */
   public function getActiveUsersByCompanyId() {
    $id_company = $this->param['id_company'] ?? null;
    if ($id_company === null) {
        return ['status' => false, 'message' => 'Company ID was not provided'];
    }
    if (! $this->checkReadAccess('users')){
     return ['status'=> false , 'message'=>'Access denied to read users data'];
    }
    else{
     $users = $this->company_users->getActiveUsersByCompanyId($this->method->getDatabaseConnect()['pdo'], $id_company);
     return ['status' => true, 'data' => $users];    
    }
   }

   /** pobranie nieaktywnych użytkowników firmy */
   public function getInactiveUsersByCompanyId() {
    $id_company = $this->param['id_company'] ?? null;
    if ($id_company === null) {
        return ['status' => false, 'message' => 'Company ID was not provided'];
    }
    if (! $this->checkReadAccess('users')){
     return ['status'=> false , 'message'=>'Access denied to read users data'];
    }
    else{
     $users = $this->company_users->getInactiveUsersByCompanyId($this->method->getDatabaseConnect()['pdo'], $id_company);
     return ['status' => true, 'data' => $users];    
    }
   }

   /** dodanie firmy do bazy danych  */
   public function saveCompanyData(){
     //  sprawdzenie czy przekazaon dane firmy w param 
        $companyData = $this->param['companyData'] ?? null;
        if ($companyData === null) {
            return ['status' => false, 'message' => 'Company data was not provided'];
        }
     // ustalenie trybu: dodawanie czy aktualizacja
     $isUpdate = isset($companyData['id']) && is_numeric($companyData['id']);
     if ($isUpdate) {
         if (! $this->checkUpdateAccess('company')){
             return ['status'=> false , 'message'=>'Access denied to update company data'];
         }
     } else {
         if (! $this->checkWriteAccess('company')){
             return ['status'=> false , 'message'=>'Access denied to write company data'];
         }
     }
    // pobranie danych firmy z parametru
   
   // walidacja danych firmy
   $validationResult = $isUpdate
       ? $this->validateCompanyDataForUpdate($companyData)
       : $this->validateCompanyData($companyData);
   if (!$validationResult['status']) {
       return ['status' => false, 'message' => $validationResult['message'] ];
   }

   // zapis danych firmy do bazy danych
   if ($isUpdate) {
       $saveResult = $this->company->updateCompany($this->method->getDatabaseConnect()['pdo'], $companyData);
   } else {
       $saveResult = $this->company->addCompany($this->method->getDatabaseConnect()['pdo'], $companyData);
   }
   // zwrocenie odpowiedzi o powodzeniu lub niepowodzeniu operacji
    return $saveResult;
   }

   // metoda do update_record - aktualizacja danych firmy w bazie danych
   public function update_record() {
      if (! $this->checkUpdateAccess('company')){
        return ['status'=> false , 'message'=>'Access denied to update company data'];
      }
      // walidacja danych firmy przed aktualizacją
      $companyData = $this->param['companyData'] ?? $this->param['formData'] ?? null;
      if ($companyData === null) {
          return ['status' => false, 'message' => 'Company data was not provided'];
      }
      $validationResult = $this->validateCompanyDataForUpdate($companyData);
      if (!$validationResult['status']) {
          return ['status' => false, 'message' => $validationResult['message'] ];
      }
      return $this->company->updateCompany($this->method->getDatabaseConnect()['pdo'], $companyData);
   }
   public function deleteCompanyById() {
    if (! $this->checkDeleteAccess('company')){
        return ['status'=> false , 'message'=>'Access denied to delete company data'];
      }
    $id_company = $this->param['id_company'] ?? null;
    if ($id_company === null) {
        return ['status' => false, 'message' => 'Company ID was not provided'];
    }
    return $this->company->deleteCompanyById($this->method->getDatabaseConnect()['pdo'], $id_company);
   }








   // Metoda pomocnicza – sprawdza dostęp użytkownika do odczytu wskazanej tabeli.
   private function checkReadAccess($table) {
     $acces = $this->method->getAccessTables(['tables' => $table]) ;
    if (!$acces['status'] || !$acces['access_table'] || !$acces ['read_record']) {
        return false;
    }
    return true ;
   }
   // Metoda pomocnicza – sprawdza dostęp użytkownika do zapisu .
   private function checkWriteAccess($table) {
    $acces = $this->method->getAccessTables(['tables' => $table]) ;
   if (!$acces['status'] || !$acces['access_table'] || !$acces ['add_record']) {
       return false;    
    }
    return true ;
   }
   // Metoda pomocnicza – sprawdza dostęp użytkownika do aktualizacji .
   private function checkUpdateAccess($table) {
    $acces = $this->method->getAccessTables(['tables' => $table]) ;
   if (!$acces['status'] || !$acces['access_table'] || !$acces ['update_record']) {
       return false;    
    }
    return true ;
   }
   private function checkDeleteAccess($table) {
    $acces = $this->method->getAccessTables(['tables' => $table]) ;
   if (!$acces['status'] || !$acces['access_table'] || !$acces ['delete_record']) {
       return false;    
    }
    return true ;
   }

   /**  metoda do walidacji danych firmy przed zapisem do bazy danych
    * sprawdz unikalnosc nazwy firmy, tax_id, regon, krs i email w bazie danych
     * sprawdz format email i website
      * sprawdz dlugosc poszczegolnych pol
       * sprawdz czy pola active zawiera tylko 0 lub 1
         * zwroc odpowiedni komunikat o bledzie w przypadku nieprawidlowych danych
          * zwroc status true w przypadku poprawnych danych
   */  
   private function validateCompanyData($companyData) {
    $pdo = $this->method->getDatabaseConnect()['pdo'];
    $excludeId = isset($companyData['id']) && is_numeric($companyData['id']) ? (int)$companyData['id'] : null;

    $name = trim($companyData['name'] ?? '');
    $type = trim($companyData['type'] ?? '');
    $active = $companyData['active'] ?? null;
    $taxId = trim($companyData['tax_id'] ?? '');
    $regon = trim($companyData['regon'] ?? '');
    $krs = trim($companyData['krs'] ?? '');
    $address = trim($companyData['address'] ?? '');
    $city = trim($companyData['city'] ?? '');
    $postalCode = trim($companyData['postal_code'] ?? '');
    $country = trim($companyData['country'] ?? '');
    $phone = trim($companyData['phone'] ?? '');
    $email = trim($companyData['email'] ?? '');
    $website = trim($companyData['website'] ?? '');

    if ($name === '') {
        return ['status' => false, 'message' => 'Company name cannot be empty'];
    }
    if (mb_strlen($name) > 255) {
        return ['status' => false, 'message' => 'Company name cannot exceed 255 characters'];
    }
    if ($this->companyFieldExists($pdo, 'name', $name, $excludeId)) {
        return ['status' => false, 'message' => 'A company with this name already exists'];
    }

    if ($type === '') {
        return ['status' => false, 'message' => 'Company type cannot be empty'];
    }
    if (mb_strlen($type) > 100) {
        return ['status' => false, 'message' => 'Company type cannot exceed 100 characters'];
    }

    if ($active !== null) {
        if (!in_array($active, [0, 1, '0', '1'], true)) {
            return ['status' => false, 'message' => 'Active field must be 0 or 1'];
        }
    }

    if ($taxId !== '') {
        if (mb_strlen($taxId) > 50) {
            return ['status' => false, 'message' => 'Tax ID cannot exceed 50 characters'];
        }
        $cleanTaxId = preg_replace('/[^0-9]/', '', $taxId);
        if (!in_array(strlen($cleanTaxId), [10, 12, 14], true)) {
            return ['status' => false, 'message' => 'Tax ID must contain 10, 12 or 14 digits'];
        }
        if ($this->companyFieldExists($pdo, 'tax_id', $taxId, $excludeId)) {
            return ['status' => false, 'message' => 'Tax ID is already in use'];
        }
    }

    if ($regon !== '') {
        if (mb_strlen($regon) > 50) {
            return ['status' => false, 'message' => 'REGON cannot exceed 50 characters'];
        }
        if (!preg_match('/^(?:[0-9]{9}|[0-9]{14})$/', $regon)) {
            return ['status' => false, 'message' => 'REGON must have 9 or 14 digits'];
        }
        if ($this->companyFieldExists($pdo, 'regon', $regon, $excludeId)) {
            return ['status' => false, 'message' => 'REGON is already in use'];
        }
    }

    if ($krs !== '') {
        if (mb_strlen($krs) > 50) {
            return ['status' => false, 'message' => 'KRS cannot exceed 50 characters'];
        }
        if (!preg_match('/^[0-9]{10}$/', preg_replace('/[^0-9]/', '', $krs))) {
            return ['status' => false, 'message' => 'KRS must have 10 digits'];
        }
        if ($this->companyFieldExists($pdo, 'krs', $krs, $excludeId)) {
            return ['status' => false, 'message' => 'KRS is already in use'];
        }
    }

    if ($address !== '' && mb_strlen($address) > 255) {
        return ['status' => false, 'message' => 'Address cannot exceed 255 characters'];
    }
    if ($city !== '' && mb_strlen($city) > 100) {
        return ['status' => false, 'message' => 'City cannot exceed 100 characters'];
    }
    if ($postalCode !== '' && mb_strlen($postalCode) > 20) {
        return ['status' => false, 'message' => 'Postal code cannot exceed 20 characters'];
    }
    if ($postalCode !== '' && !preg_match('/^[A-Za-z0-9\- ]+$/', $postalCode)) {
        return ['status' => false, 'message' => 'Postal code contains invalid characters'];
    }
    if ($country !== '' && mb_strlen($country) > 100) {
        return ['status' => false, 'message' => 'Country cannot exceed 100 characters'];
    }
    if ($phone !== '' && mb_strlen($phone) > 50) {
        return ['status' => false, 'message' => 'Phone cannot exceed 50 characters'];
    }
    if ($phone !== '' && !preg_match('/^[0-9+\-() ]+$/', $phone)) {
        return ['status' => false, 'message' => 'Phone contains invalid characters'];
    }

    if ($email !== '') {
        if (mb_strlen($email) > 100) {
            return ['status' => false, 'message' => 'Email cannot exceed 100 characters'];
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['status' => false, 'message' => 'Invalid email format'];
        }
        if ($this->companyFieldExists($pdo, 'email', $email, $excludeId)) {
            return ['status' => false, 'message' => 'Email is already in use'];
        }
    }

    if ($website !== '') {
        if (mb_strlen($website) > 100) {
            return ['status' => false, 'message' => 'Website cannot exceed 100 characters'];
        }
        $websiteToValidate = $website;
        if (!preg_match('/^https?:\/\//i', $websiteToValidate)) {
            $websiteToValidate = 'http://' . $websiteToValidate;
        }
        if (!filter_var($websiteToValidate, FILTER_VALIDATE_URL)) {
            return ['status' => false, 'message' => 'Invalid website URL'];
        }
    }

    return ['status' => true];
   }
  /** walidacja danych przed aktualizacją danych firmy w bazie danych
   * pomijając sprawdzanie rekordu o id firmy w bazie danych, ponieważ ten rekord jest aktualizowany
   * i może zawierać te same dane co przed aktualizacją
   * sprawdź unikalność nazwy firmy, tax_id, regon, krs i email w bazie danych z wyjątkiem rekordu
   * o id firmy, która jest aktualizowana
   * sprawdź format email i website
   * sprawdź długość poszczególnych pól
   * sprawdź czy pole active zawiera tylko 0 lub 1
   * zwróć odpowiedni komunikat o błędzie w przypadku nieprawidłowych danych
   * zwróć status true w przypadku poprawnych danych
   */
   private function validateCompanyDataForUpdate($companyData) {
    if (!isset($companyData['id']) || !is_numeric($companyData['id'])) {
        return ['status' => false, 'message' => 'Company ID is required for update'];
    }
    return $this->validateCompanyData($companyData);
   }
   private function companyFieldExists($pdo, $field, $value, $excludeId = null) {
    return $this->company->companyExists($pdo, $field, $value, $excludeId);
   }
}
