<?php 
/**
 * Dynamiczne szukanie bootstrapa w górę drzewa katalogów.
 * Szuka folderu 'src/bootstrap.php' startując od bieżącej lokalizacji.
 */
$currentDir = __DIR__;
while ($currentDir !== dirname($currentDir) && !file_exists($currentDir . '/src/bootstrap.php')) {
    $currentDir = dirname($currentDir);
}
if (file_exists($currentDir . '/src/bootstrap.php')) {
    require_once $currentDir . '/src/bootstrap.php';
}
class Access
{
    private $conn;

    public function __construct()
    {
      $this->conn = require PATH_CONNECT;

    }

//funkcje pomocnicze do obsługi żądań i odpowiedzi
   public function sprawdzSesje() {
        if (!isset($_SESSION['id'])) {
            exit(json_encode([
                'status' => false,
                'message' => 'no session'
            ]));
        }
        return (int)$_SESSION['id'];
    }
    // sprawdzenie czy uzytkownik ma aktywne konto
    public function sprawdzAktywneKonto(int $userId): bool{
    $stmt = $this->conn->prepare("SELECT 1 FROM users WHERE id = ? AND active = 1 LIMIT 1");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $stmt->store_result();
    $exists = $stmt->num_rows > 0;
    $stmt->close();

    if (!$exists) {
        exit(json_encode([
            'status' => false,
            'message' => 'no activ users'
        ]));
    }
    return true;
    }

    /** sprawdz czy uzytkownik ma dostep do wykonania akcji na danej tabeli
     * @param int $userId - id uzytkownika
     * @param string $tableName - nazwa tabeli
     * @param string $action - nazwa akcji (np. 'read', 'add', 'update', 'delete', 'access')
     * @return bool - true jesli uzytkownik ma dostep, false w przeciwnym razie
     */
    public function sprawdzDostepDoTabeli(int $userId, string $tableName, string $action): bool{
     $mapaAkcji = [
        'access' => 'access_table',
        'add'    => 'add_record',
        'read'   => 'read_record',
        'update' => 'update_record',
        'delete' => 'delete_record',
     ];

     if (!isset($mapaAkcji[$action])) {
        return false;
     }

     $kolumna = $mapaAkcji[$action];

     // Pobieramy cały wiersz, aby móc sprawdzić zarówno istnienie rekordu, jak i wartości kolumn
     $sql = "SELECT * FROM `access_tables` WHERE `id_users` = ? AND `tables` = ? LIMIT 1";

     if ($stmt = $this->conn->prepare($sql)) {
         $stmt->bind_param('is', $userId, $tableName);
         $stmt->execute();
         $result = $stmt->get_result();

         $row = $result->fetch_assoc();
         $stmt->close();

         // Jeśli rekord istnieje i wartość w kolumnie to 1 (dostęp przyznany)
         if ($row && (int)$row[$kolumna] === 1) {
            return true;
         }
     }

     exit(json_encode([
        'status' => false,
        'message' => 'no acces tables'
     ]));
    }

}
return new Access();
