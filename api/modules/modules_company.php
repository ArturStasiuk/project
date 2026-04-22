<?php 
/** odpowaida za obsluge tabeli company  */
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
    if (! $this->dostemp_do_pobrania_danych('company')){
     return ['status'=> false , 'message'=>'brak dostempu do pobierania daych'];
    }
    else{
     return $this->company->getAllCompanyData($this->method->getDatabaseConect()['pdo']) ;    
    }
    return false ;
   }
  // pobranie z tabeli company  danych firmy o podanym id_company
   public function getCompanyDataById() {
     $id_company = $this->param['id_company'] ?? null;
     if ($id_company === null) {
         return ['status' => false, 'message' => 'ID firmy nie został przekazany'];
     }  
    if (! $this->dostemp_do_pobrania_danych('company')){
     return ['status'=> false , 'message'=>'brak dostempu do pobierania daych'];
    }
    else{
     return $this->company->getCompanyDataById($this->method->getDatabaseConect()['pdo'], $id_company) ;    
    }
    return false ;
   }

   // pobranie danych uzytkownikow po id_company z tabeli users na podstawie tabeli company_users
   public function getUsersByCompanyId() {
    $id_company = $this->param['id_company'] ?? null;
    if ($id_company === null) {
        return ['status' => false, 'message' => 'ID firmy nie został przekazany'];
    }
    if (! $this->dostemp_do_pobrania_danych('users')){
     return ['status'=> false , 'message'=>'brak dostempu do pobierania daych'];
    }
    else{
     $users = $this->users->getUsersByCompanyId($this->method->getDatabaseConect()['pdo'], $id_company);
     return ['status' => true, 'data' => $users];    
    }
    return false ;
   }


   // metody pomocnicze dostemp do pobrania danych z tabeli company
   private function dostemp_do_pobrania_danych($table) {
     $acces = $this->method->getAccessTables(['tables' => $table]) ;
    if (!$acces['status'] || !$acces['access_table'] || !$acces ['read_record']) {
        return false;
    }
    return true ;
   }

}
