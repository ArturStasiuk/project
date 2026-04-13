<?php /** automatyczne ladowanie klas  */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
/** tu bedzie przekazane jaki plik z modules bedzie ladowany 
 * np test.php i beda include pliki potrzebne do jego dzialania np polaczenie z baza danych, autoload itp
 */
// ustaw naglowek odpowiedzi na JSON
header('Content-Type: application/json');
// sprawdz metode HTTP
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    //http_response_code(405);
    echo json_encode(['status' => 'false', 'message' => null]);
    exit;
}
// Odczytaj dane wejściowe
$data = json_decode(file_get_contents('php://input'), true);
// jaki modules ma byc zaladowany 
$modulesName= isset($data['modules']) ? $data['modules'] : null; 
// jaka funkcja ma byc wywolana w modules
$methodName = isset($data['method']) ? $data['method'] : null;
// jakie parametry sa przekazane do funkcji
$param = isset($data['param']) ? $data['param'] : null;
//============================================================================
// jezeli przekazano modules i method i param to sprawdz czy plik z modules istnieje i czy metoda istnieje w klasie i ja wywolaj
if ($modulesName) {
        // sprawdz czy plik z modules istnieje
        $moduleFile = __DIR__ . '/../modules/' . $modulesName . '.php';
        if (file_exists($moduleFile)) {
            include_once $moduleFile;
            // sprawdz czy klasa istnieje
            if (class_exists($modulesName)) {
                $instances = [];
                if (function_exists($modulesName)) {
                    $instances = $modulesName(); // np. ['conn'=>...]
                }
                // Jeśli konstruktor klasy modułu przyjmuje instancje, przekaż je wraz z $param
                if (!empty($instances)) {
                    $args = array_merge(array_values($instances), [$param]);
                    $moduleInstance = new $modulesName(...$args);
                } else {
                    $moduleInstance = new $modulesName(null, $param); // zakładamy, że pierwszy argument to instancja, drugi to $param
                }
                // sprawdz czy metoda istnieje w klasie
                if (method_exists($moduleInstance, $methodName)) {
                    // wywolaj metode i przekaż parametry
                    echo json_encode($moduleInstance->$methodName());
                    exit;
                } else {
                    echo json_encode(['status' => 'false', 'message' => 'Method not found']);
                    exit;
                }
            } else {
                echo json_encode(['status' => 'false', 'message' => 'Class not found']);
                exit;
            }
        } else {
            echo json_encode(['status' => 'false', 'message' => 'Module file not found']);
            exit;
        }




}
//============================================================================

// jezeli przeazano tylko metode i parametry bez modules to sprawdz czy funkcja istnieje i ja wywolaj
if ($modulesName === null && $methodName !== null ) {
    // sprawdz czy funkcja istnieje
    if (function_exists($methodName)) {
        // wywolaj funkcje
        $methodName();
    } 
}
//============================================================================



echo json_encode(['status' => true, 'message' => 'no module specified']);
//============================================================================
//==========includowanie plikow w zaleznosci jakie modules jest wywolywany ===========================================================
// modules user - wszystko co zwiazane z uzytkownikami - logowanie, rejestracja, dane uzytkownika itd
function user(){
    include_once __DIR__ . '/../config/config_db.php';
    include_once __DIR__ . '/../connect/connect_db.php';
    $config_db = new CONFIG_DB();
    $connect_db = new CONNECT();
    include_once __DIR__ . '/../service/session.php';
    include_once __DIR__ . '/../data_base/users.php';
    include_once __DIR__ . '/../data_base/access_tables.php';
    include_once __DIR__ . '/../data_base/company_users.php';
    include_once __DIR__ . '/../data_base/company.php';

  return [
    'pdo' => $connect_db->connect($config_db->getConfig()), // przekazanie instancji POD do modulu /polaczenie z baza danych
    'session' => new SESSION(), // przekazanie instancji SESSION do modulu
    'users' => new USERS(), // przekazanie instancji USERS do modulu
    'access_tables' => new ACCESS_TABLES(), // przekazanie instancji ACCESS do modulu
    'company_users' => new COMPANY_USERS(), // przekazanie instancji COMPANY_USERS do modulu
    'company' => new COMPANY(), // przekazanie instancji COMPANY do modulu
    

  ];
}

// =========================================================
// metody bez modules -
// sprawdza czy uzytkownik jest zalogowany 
function checkLoggedIn(){
    include_once __DIR__ . '/../service/session.php';
    $session = new SESSION();
    $loggedIn = $session->getKey('id_users') !== null;
    echo json_encode(['loggedIn' => $loggedIn]);
    exit;


}