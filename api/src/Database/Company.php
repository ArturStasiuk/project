<?php

declare(strict_types=1);

namespace App\Database;

use PDO;
use PDOException;

/**
 * Company – obsługuje operacje na tabeli `company` (firmy).
 */
class Company
{
    /**
     * Zwraca dane wszystkich firm.
     *
     * @param PDO $pdo Aktywne połączenie PDO.
     * @return array{status: bool, data?: array<int, array<string, mixed>>, message?: string}
     */
    public function getAllCompanyData(PDO $pdo): array
    {
        try {
            $stmt = $pdo->query('SELECT * FROM company');
            return ['status' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }

    /**
     * Zwraca dane jednej firmy na podstawie jej ID.
     *
     * @param PDO $pdo Aktywne połączenie PDO.
     * @param int $id  ID firmy.
     * @return array{status: bool, data?: array<string, mixed>, message?: string}
     */
    public function getCompanyDataById(PDO $pdo, int $id): array
    {
        try {
            $stmt = $pdo->prepare('SELECT * FROM company WHERE id = :id');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return ['status' => true, 'data' => $stmt->fetch(PDO::FETCH_ASSOC)];
        } catch (PDOException $e) {
            return ['status' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
}
