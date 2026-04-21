<?php 
/** odpowaida za obsluge tabeli company  */
class MODULES_COMPANY {

 
    private $company;// dostep do tabeli company
    private $param;//  parametry przekazane z vendor.php
    private $method;// dostep do klasy METHOD
    
    public function __construct( $method, $company, $param = null)
    {
        $this->method = $method;
        $this->company = $company;//
        $this->param = $param;
    }
        

        

  // pobranie z tabeli company danych firm   
   public function getAllCompanyData() {
    if (! $this->dostemp_do_pobrania_danych()){
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
    if (! $this->dostemp_do_pobrania_danych()){
     return ['status'=> false , 'message'=>'brak dostempu do pobierania daych'];
    }
    else{
     return $this->company->getCompanyDataById($this->method->getDatabaseConect()['pdo'], $id_company) ;    
    }
    return false ;
   }



   // metody pomocnicze dostemp do pobrania danych z tabeli company
   private function dostemp_do_pobrania_danych() {
     $acces = $this->method->getAccessTables(['tables' => 'company']) ;
    if (!$acces['status'] || !$acces['access_table'] || !$acces ['read_record']) {
        return false;
    }
    return true ;
   }

}
