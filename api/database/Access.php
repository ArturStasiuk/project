<?php

namespace App\Database;

/**
 * Obsługuje tabelę uprawnień dostępu do modułów.
 */
class Access
{
    /**
     * Pobiera listę aktywnych modułów przypisanych do użytkownika.
     *
     * @return array{status: bool, modules?: list<array<string, string>>, error?: string}
     */
    public function getActiveModulesForUser(\mysqli $conn, int $userId): array
    {
        $sql  = 'SELECT modules_name, active, `read`, `append`, `clear`, `modify`
                 FROM acess
                 WHERE id_users = ? AND active = 1';
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            return ['status' => false, 'error' => 'Failed to prepare statement'];
        }

        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result  = $stmt->get_result();
        $modules = [];
        while ($row = $result->fetch_assoc()) {
            $modules[] = [
                'modules_name' => $row['modules_name'],
                'active'       => (string) $row['active'],
                'read'         => (string) $row['read'],
                'append'       => (string) $row['append'],
                'clear'        => (string) $row['clear'],
                'modify'       => (string) $row['modify'],
            ];
        }
        $stmt->close();

        return ['status' => true, 'modules' => $modules];
    }
}
