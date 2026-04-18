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



   // metody pomocnicze 
   private function dostemp_do_pobrania_danych() {
    
    $acces = $this->method->gestAccessTtables(['tables' => 'company']) ;
    if (!$acces['status'] || !$acces['access_table'] || !$acces ['read_record']) {
        return false;
    }
    return true ;
   }

}
