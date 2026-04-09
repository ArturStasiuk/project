
<?php // obsluga tabeli acess
class ACESS{

 // pobranie listy aktywnych modolow dla uzytkownika
public function getActiveModulesForUser($conect, $userId) {
	$modules = [];
	// Walidacja userId - tylko liczby całkowite
	if (!is_numeric($userId) || intval($userId) != $userId || $userId < 1) {
		return ['status' => false, 'error' => 'Nieprawidłowy identyfikator użytkownika'];
	}
	$userId = intval($userId);
	$sql = "SELECT modules_name, active, `read`, `append`, `clear`, `modify` FROM acess WHERE id_users = ? AND active = 1";
	if ($stmt = $conect->prepare($sql)) {
		$stmt->bind_param("i", $userId);
		$stmt->execute();
		$result = $stmt->get_result();
		while ($row = $result->fetch_assoc()) {
			$modules[] = [
				'modules_name' => $row['modules_name'],
				'active' => (string)$row['active'],
				'read' => (string)$row['read'],
				'append' => (string)$row['append'],
				'clear' => (string)$row['clear'],
				'modify' => (string)$row['modify'],
			];
		}
		$stmt->close();
	}
	return ['status' => true, 'modules' => $modules];
}




}