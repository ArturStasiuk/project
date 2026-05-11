<?php
declare(strict_types=1);

/**
 * Bezpieczne ladowanie definicji prywatnych modulow:
 * - tylko rekordy access_tools=1
 * - tylko poprawne nazwy modułów
 * - tylko istniejace pliki wejscia wewnatrz private/tools
 */
final class PrivateModulesLoader
{
    /**
     * Buduje bezpieczna odpowiedz dla frontendu.
     *
     * @param array<int, array<string, mixed>> $rows
     * @return array<int, array<string, mixed>>
     */
    public static function buildSafeModules(array $rows): array
    {
        $safeModules = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $moduleName = self::readModuleName($row);
            if ($moduleName === null) {
                continue;
            }

            if (!self::hasAccessEnabled($row)) {
                continue;
            }

            $importPath = self::buildImportPath($moduleName);
            if (!self::entryFileExists($moduleName)) {
                continue;
            }

            $safeModules[] = [
                'name' => $moduleName,
                'import_path' => $importPath,
            ];
        }

        return $safeModules;
    }

    /**
     * @param array<string, mixed> $row
     */
    private static function readModuleName(array $row): ?string
    {
        $moduleName = $row['tools_name'] ?? null;
        if (!is_string($moduleName)) {
            return null;
        }

        $moduleName = trim($moduleName);
        if ($moduleName === '') {
            return null;
        }

        if (!preg_match('/^[a-z0-9_]+$/', $moduleName)) {
            return null;
        }

        return $moduleName;
    }

    /**
     * @param array<string, mixed> $row
     */
    private static function hasAccessEnabled(array $row): bool
    {
        return self::toBool($row['access_tools'] ?? 0);
    }

    /**
     * @param mixed $value
     */
    private static function toBool($value): bool
    {
        return $value === true
            || $value === 1
            || $value === '1'
            || $value === 'true';
    }

    private static function buildImportPath(string $moduleName): string
    {
        // Sciezka wzgledem pliku public/system/system.js
        return '../../private/tools/' . $moduleName . '/' . $moduleName . '.js';
    }

    private static function entryFileExists(string $moduleName): bool
    {
        $path = __DIR__ . '/../../private/tools/' . $moduleName . '/' . $moduleName . '.js';
        return is_file($path);
    }
}