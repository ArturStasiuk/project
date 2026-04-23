<?php

declare(strict_types=1);

namespace App\Database;

use PDO;

/**
 * CompanyUsers – obsługuje tabelę `company_users`.
 *
 * Tabela powiązuje użytkowników z firmami (relacja wiele-do-wielu).
 */
class CompanyUsers
{
    /**
     * Zwraca ID firmy, do której należy użytkownik (pierwsza aktywna relacja).
     *
     * @param PDO $pdo    Aktywne połączenie PDO.
     * @param int $userId ID użytkownika.
     * @return array{status: bool, message: string, data: int|null}
     */
    public function getCompanyIdUsers(PDO $pdo, int $userId): array
    {
        $stmt = $pdo->prepare(
            'SELECT id_company FROM company_users WHERE id_users = :userId AND active = 1'
        );
        $stmt->execute(['userId' => $userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && isset($row['id_company'])) {
            return [
                'status'  => true,
                'message' => 'Company ID retrieved successfully',
                'data'    => (int) $row['id_company'],
            ];
        }

        return [
            'status'  => false,
            'message' => 'No company association found for this user',
            'data'    => null,
        ];
    }
}
