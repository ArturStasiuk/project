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

   // zapis danych firmy do bazy danych

   // zwrocenie odpowiedzi o powodzeniu lub niepowodzeniu operacji
    return ['status' => true, 'message' => 'Dane firmy zostały zapisane'];
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

}
