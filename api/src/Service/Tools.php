<?php

declare(strict_types=1);

namespace App\Service;

/**
 * Tools – skanuje katalogi narzędzi i zwraca ścieżki do ich plików JS.
 *
 * Narzędzia publiczne są dostępne bezpośrednio przez przeglądarkę.
 * Narzędzia prywatne wymagają autoryzacji i są serwowane przez API
 * (metody getPrivateToolContent / getPrivateToolFile w Method).
 */
class Tools
{
    /**
     * Zwraca listę ścieżek/identyfikatorów wszystkich dostępnych narzędzi.
     *
     * Publiczne narzędzia – względna ścieżka URL (np. 'tools/notepad/notepad.js').
     * Prywatne narzędzia – identyfikator w schemacie 'private-tool://nazwa'.
     *
     * @param bool                        $includePrivate Czy dołączyć narzędzia prywatne.
     * @param array<int, array<string, mixed>> $accessTools    Lista uprawnień z tabeli access_tools.
     * @return string[] Tablica identyfikatorów narzędzi.
     */
    public function getAllTools(bool $includePrivate = false, array $accessTools = []): array
    {
        $toolsPaths = [];

        // --- Narzędzia publiczne ---
        $publicDir = __DIR__ . '/../../../public/tools';
        if (is_dir($publicDir)) {
            foreach (scandir($publicDir) as $dir) {
                if ($dir === '.' || $dir === '..') {
                    continue;
                }
                $subDirPath = $publicDir . '/' . $dir;
                if (is_dir($subDirPath) && file_exists("{$subDirPath}/{$dir}.js")) {
                    $toolsPaths[] = "tools/{$dir}/{$dir}.js";
                }
            }
        }

        // --- Narzędzia prywatne ---
        if ($includePrivate) {
            $privateDir = __DIR__ . '/../../../private/tools';
            if (is_dir($privateDir)) {
                foreach (scandir($privateDir) as $dir) {
                    if ($dir === '.' || $dir === '..') {
                        continue;
                    }
                    $subDirPath = $privateDir . '/' . $dir;
                    if (!is_dir($subDirPath)) {
                        continue;
                    }
                    // Sprawdź uprawnienia użytkownika do tego narzędzia
                    foreach ($accessTools as $tool) {
                        if (
                            isset($tool['tools_name'], $tool['access_tools']) &&
                            $tool['tools_name'] === $dir &&
                            (int) $tool['access_tools'] === 1 &&
                            file_exists("{$subDirPath}/{$dir}.js")
                        ) {
                            $toolsPaths[] = "private-tool://{$dir}";
                            break;
                        }
                    }
                }
            }
        }

        return $toolsPaths;
    }
}
