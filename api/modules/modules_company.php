<?php 
/** Obsługuje operacje na tabeli company (firmy). Wymaga dostępu do tabel company i users. */
class MODULES_COMPANY {

 
    private $company;// dostep do tabeli company
    private $param;//  parametry przekazane z vendor.php
    private $method;// dostep do klasy METHOD
    private $users;// dostep do tabeli users
    
    public function __construct( $method, $company, $users, $param = null)
    {
        $this->method = $method;
        $this->company = $company;//
        $this->users = $users;//
        $this->param = $param;
    }
        

        

  // pobranie z tabeli company danych firm   
   public function getAllCompanyData() {
    if (! $this->checkReadAccess('company')){
     return ['status'=> false , 'message'=>'Brak dostępu do pobierania danych'];
    }
    else{
     return $this->company->getAllCompanyData($this->method->getDatabaseConnect()['pdo']) ;    
    }
   }
  // pobranie z tabeli company  danych firmy o podanym id_company
   public function getCompanyDataById() {
     $id_company = $this->param['id_company'] ?? null;
     if ($id_company === null) {
         return ['status' => false, 'message' => 'ID firmy nie został przekazany'];
     }  
    if (! $this->checkReadAccess('company')){
     return ['status'=> false , 'message'=>'Brak dostępu do pobierania danych'];
    }
    else{
     return $this->company->getCompanyDataById($this->method->getDatabaseConnect()['pdo'], $id_company) ;    
    }
   }

   // pobranie danych uzytkownikow po id_company z tabeli users na podstawie tabeli company_users
   public function getUsersByCompanyId() {
    $id_company = $this->param['id_company'] ?? null;
    if ($id_company === null) {
        return ['status' => false, 'message' => 'ID firmy nie został przekazany'];
    }
    if (! $this->checkReadAccess('users')){
     return ['status'=> false , 'message'=>'Brak dostępu do pobierania danych'];
    }
    else{
     $users = $this->users->getUsersByCompanyId($this->method->getDatabaseConnect()['pdo'], $id_company);
     return ['status' => true, 'data' => $users];    
    }
   }

   /** dodanie firmy do bazy danych  */
   public function saveCompanyData(){
     //  sprawdzenie czy przekazaon dane firmy w param 
        $companyData = $this->param['companyData'] ?? null;
        if ($companyData === null) {
            return ['status' => false, 'message' => 'Dane firmy nie zostały przekazane'];
        }
     // sprawdzenie dostepu do zapisu danych w tabeli company
     if (! $this->checkWriteAccess('company')){
         return ['status'=> false , 'message'=>'Brak dostępu do zapisu danych'];
        }
    // pobranie danych firmy z parametru
   
   // walidacja danych firmy
   $validationResult = $this->validateCompanyData($companyData);
   if (!$validationResult['status']) {
       return ['status' => false, 'message' => $validationResult['message'] ];
   }

   // zapis danych firmy do bazy danych
    $saveResult = $this->company->addCompany($this->method->getDatabaseConnect()['pdo'], $companyData);
   // zwrocenie odpowiedzi o powodzeniu lub niepowodzeniu operacji
    return $saveResult;
   }









   // Metoda pomocnicza – sprawdza dostęp użytkownika do odczytu wskazanej tabeli.
   private function checkReadAccess($table) {
     $acces = $this->method->getAccessTables(['tables' => $table]) ;
    if (!$acces['status'] || !$acces['access_table'] || !$acces ['read_record']) {
        return false;
    }
    return true ;
   }
   // Metoda pomocnicza – sprawdza dostęp użytkownika do zapisu wskazanej tabeli.
   private function checkWriteAccess($table) {
    $acces = $this->method->getAccessTables(['tables' => $table]) ;
   if (!$acces['status'] || !$acces['access_table'] || !$acces ['add_record']) {
       return false;    
    }
    return true ;
   }

   // metoda do walidacji danych firmy 
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
        return ['status' => false, 'message' => 'Nazwa firmy nie może być pusta'];
    }
    if (mb_strlen($name) > 255) {
        return ['status' => false, 'message' => 'Nazwa firmy nie może przekraczać 255 znaków'];
    }
    if ($this->companyFieldExists($pdo, 'name', $name, $excludeId)) {
        return ['status' => false, 'message' => 'Firma o takiej nazwie już istnieje'];
    }

    if ($type === '') {
        return ['status' => false, 'message' => 'Typ firmy nie może być pusty'];
    }
    if (mb_strlen($type) > 100) {
        return ['status' => false, 'message' => 'Typ firmy nie może przekraczać 100 znaków'];
    }

    if ($active !== null) {
        if (!in_array($active, [0, 1, '0', '1'], true)) {
            return ['status' => false, 'message' => 'Pole aktywne musi mieć wartość 0 lub 1'];
        }
    }

    if ($taxId !== '') {
        if (mb_strlen($taxId) > 50) {
            return ['status' => false, 'message' => 'NIP nie może przekraczać 50 znaków'];
        }
        $cleanTaxId = preg_replace('/[^0-9]/', '', $taxId);
        if (!in_array(strlen($cleanTaxId), [10, 12, 14], true)) {
            return ['status' => false, 'message' => 'NIP musi zawierać 10, 12 lub 14 cyfr'];
        }
        if ($this->companyFieldExists($pdo, 'tax_id', $taxId, $excludeId)) {
            return ['status' => false, 'message' => 'NIP jest już używany'];
        }
    }

    if ($regon !== '') {
        if (mb_strlen($regon) > 50) {
            return ['status' => false, 'message' => 'REGON nie może przekraczać 50 znaków'];
        }
        if (!preg_match('/^(?:[0-9]{9}|[0-9]{14})$/', $regon)) {
            return ['status' => false, 'message' => 'REGON musi mieć 9 lub 14 cyfr'];
        }
        if ($this->companyFieldExists($pdo, 'regon', $regon, $excludeId)) {
            return ['status' => false, 'message' => 'REGON jest już używany'];
        }
    }

    if ($krs !== '') {
        if (mb_strlen($krs) > 50) {
            return ['status' => false, 'message' => 'KRS nie może przekraczać 50 znaków'];
        }
        if (!preg_match('/^[0-9]{10}$/', preg_replace('/[^0-9]/', '', $krs))) {
            return ['status' => false, 'message' => 'KRS musi mieć 10 cyfr'];
        }
        if ($this->companyFieldExists($pdo, 'krs', $krs, $excludeId)) {
            return ['status' => false, 'message' => 'KRS jest już używany'];
        }
    }

    if ($address !== '' && mb_strlen($address) > 255) {
        return ['status' => false, 'message' => 'Adres nie może przekraczać 255 znaków'];
    }
    if ($city !== '' && mb_strlen($city) > 100) {
        return ['status' => false, 'message' => 'Miasto nie może przekraczać 100 znaków'];
    }
    if ($postalCode !== '' && mb_strlen($postalCode) > 20) {
        return ['status' => false, 'message' => 'Kod pocztowy nie może przekraczać 20 znaków'];
    }
    if ($postalCode !== '' && !preg_match('/^[A-Za-z0-9\- ]+$/', $postalCode)) {
        return ['status' => false, 'message' => 'Kod pocztowy zawiera niedozwolone znaki'];
    }
    if ($country !== '' && mb_strlen($country) > 100) {
        return ['status' => false, 'message' => 'Kraj nie może przekraczać 100 znaków'];
    }
    if ($phone !== '' && mb_strlen($phone) > 50) {
        return ['status' => false, 'message' => 'Telefon nie może przekraczać 50 znaków'];
    }
    if ($phone !== '' && !preg_match('/^[0-9+\-() ]+$/', $phone)) {
        return ['status' => false, 'message' => 'Telefon zawiera niedozwolone znaki'];
    }

    if ($email !== '') {
        if (mb_strlen($email) > 100) {
            return ['status' => false, 'message' => 'Email nie może przekraczać 100 znaków'];
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['status' => false, 'message' => 'Nieprawidłowy format adresu email'];
        }
        if ($this->companyFieldExists($pdo, 'email', $email, $excludeId)) {
            return ['status' => false, 'message' => 'Email jest już używany'];
        }
    }

    if ($website !== '') {
        if (mb_strlen($website) > 100) {
            return ['status' => false, 'message' => 'Website nie może przekraczać 100 znaków'];
        }
        $websiteToValidate = $website;
        if (!preg_match('/^https?:\/\//i', $websiteToValidate)) {
            $websiteToValidate = 'http://' . $websiteToValidate;
        }
        if (!filter_var($websiteToValidate, FILTER_VALIDATE_URL)) {
            return ['status' => false, 'message' => 'Nieprawidłowy format adresu strony internetowej'];
        }
    }

    return ['status' => true];
   }

   private function companyFieldExists($pdo, $field, $value, $excludeId = null) {
    return $this->company->companyExists($pdo, $field, $value, $excludeId);
   }
}
