<?php 
class COMPANY {

    public function __construct()
    {

    }
    // pobranie z tabeli company danych firmy
    public function getAllCompanyData($param) {
      return ['status' => true, 'przesane parametry' => $param];
    }





}