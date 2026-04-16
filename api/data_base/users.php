<?php
class USERS  // 
{
  

    public function __construct()
    {
  
    }

    // sprawdzenie czy użytkownik o podanym emailu istnieje w bazie danych
 public function checkUserExistsByEmail($pdo, $email){
    $stmt = $pdo->prepare("SELECT 1 FROM users WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    return $stmt->fetchColumn() !== false;
 }
  
  // sprawdzenie czy użytkownik o podanym emailu ma aktywne konto
  public function checkUserActiveByEmail($pdo, $email){
    $stmt = $pdo->prepare("SELECT active FROM users WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return ($result && $result['active'] == 1);
  }

  // sprawdzenie poprawnosci hasla dla użytkownika o podanym emailu
  public function checkPasswordByEmail($pdo, $email, $password){
      $stmt = $pdo->prepare("SELECT password FROM users WHERE email = :email LIMIT 1");
      $stmt->execute(['email' => $email]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($result) {
         return password_verify($password, $result['password']);
      }
      return false;
  }

  // dodawanie uzytkownika do bazy danych z opcjonalnymi polami
  public function addUser($pdo, $email, $password, $name = null, $last_name = null, $role = null, $active = 1){
      $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
      $fields = ['email', 'password', 'active'];
      $values = [':email' => $email, ':password' => $hashedPassword, ':active' => $active];
      $sqlFields = 'email, password, active';
      $sqlValues = ':email, :password, :active';
      if ($name !== null) {
          $fields[] = 'name';
          $values[':name'] = $name;
          $sqlFields .= ', name';
          $sqlValues .= ', :name';
      }
      if ($last_name !== null) {
          $fields[] = 'last_name';
          $values[':last_name'] = $last_name;
          $sqlFields .= ', last_name';
          $sqlValues .= ', :last_name';
      }
      if ($role !== null) {
          $fields[] = 'role';
          $values[':role'] = $role;
          $sqlFields .= ', role';
          $sqlValues .= ', :role';
      }
      $sql = "INSERT INTO users ($sqlFields) VALUES ($sqlValues)";
      $stmt = $pdo->prepare($sql);
      return $stmt->execute($values);
  }

   // pobranie id uzytkownika po emailu
  public function getUserIdByEmail($pdo, $email){
      $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
      $stmt->execute(['email' => $email]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      return $result ? $result['id'] : null;
  }

  // pobranie danych uzytkownika po id bez hasla
  public function getUserDataById($pdo, $id){
      $stmt = $pdo->prepare("SELECT id, role, name, last_name, email, active ,lang FROM users WHERE id = :id LIMIT 1");
      $stmt->execute(['id' => $id]);
      return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  





}