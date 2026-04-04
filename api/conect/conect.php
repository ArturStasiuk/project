<?php
class CONECT {
	private $host = 'localhost';
	private $user = 'root';
	private $password = 'azv470047azv';
	private $database = 'project';

 public function __construct()
     {
      
     }

 public function connect()
      {
        try {
           mysqli_report(MYSQLI_REPORT_OFF); // wyłącz raportowanie wyjątków przez mysqli
          $conn = @new mysqli($this->host, $this->user, $this->password, $this->database);
         if ($conn->connect_error) {
            return false;
        }
        return $conn;
        } catch (mysqli_sql_exception $e) {
        return false;
        }
  }
 
 public function disconnect($conn)
     {
       if ($conn) {
        $conn->close();
         }
     } 


 public function getConectInfo($conn)
 {
    if ($conn) {
        return [
    'host_info' => $conn->host_info,
    'server_info' => $conn->server_info,
    'protocol_version' => $conn->protocol_version,
    'client_info' => $conn->client_info,
    'client_version' => $conn->client_version,
    'server_version' => $conn->server_version,
    'thread_id' => $conn->thread_id,
    'stat' => $conn->stat(),
    'sqlstate' => $conn->sqlstate,
    'info' => $conn->info,
    'errno' => $conn->errno,
    'error' => $conn->error
        ];
    }
    return null;
 }


  
}