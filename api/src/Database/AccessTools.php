<?php

declare(strict_types=1);

namespace App\Database;

use PDO;

/**
 * AccessTools – obsługuje tabelę `access_tools`.
 *
 * Kontroluje dostęp użytkowników do prywatnych narzędzi aplikacji.
 */
class AccessTools
{
    /**
     * Pobiera wszystkie rekordy uprawnień do narzędzi dla podanego użytkownika.
     *
     * @param PDO $pdo    Aktywne połączenie PDO.
     * @param int $userId ID użytkownika.
     * @return array<int, array<string, mixed>> Lista wierszy z tabeli access_tools.
     */
    public function getAccessToolsByUserId(PDO $pdo, int $userId): array
    {
        $stmt = $pdo->prepare('SELECT * FROM access_tools WHERE id_users = :id_users');
        $stmt->bindParam(':id_users', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
