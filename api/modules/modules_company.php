<?php 
/** odpowaida za obsluge tabeli company  */
class MODULES_COMPANY {

    private $access_tables;// dostep do tabeli access_tables
    private $company;// dostep do tabeli company
    private $param;//  parametry przekazane z vendor.php
    private $method;// dostep do klasy METHOD
    
    public function __construct( $method,$access_tables, $company, $param = null)
    {
        $this->method = $method;
        $this->access_tables = $access_tables;
        $this->company = $company;
        $this->param = $param;
   
        

        
    }
  // pobranie z tabeli company danych firm   
   public function getAllCompanyData() {

       $companyData = $this->company->getAllCompanyData( $this->param);
       return $companyData;
   }

}
