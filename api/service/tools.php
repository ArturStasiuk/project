<?php // odpowiada za pobranie sciezek do modułów
class TOOLS{
    public function __construct(){}

    /**
     * Zwraca ścieżki do wszystkich narzędzi (publiczne i prywatne)
     * @param bool $includePrivate Czy dołączyć narzędzia prywatne
     * @return array
     */
    public function getAllTools(bool $includePrivate = false, array $accessTools = []): array
    {
        $toolsPaths = [];
        // Publiczne narzędzia
        $publicDir = __DIR__ . '/../../public/tools';
        if (is_dir($publicDir)) {
            $dirs = scandir($publicDir);
            foreach ($dirs as $dir) {
                if ($dir !== '.' && $dir !== '..') {
                    $subDirPath = $publicDir . '/' . $dir;
                    if (is_dir($subDirPath)) {
                        $jsFile = $subDirPath . '/' . $dir . '.js';
                        if (file_exists($jsFile)) {
                            $relativePath = 'tools/' . $dir . '/' . $dir . '.js';
                            $toolsPaths[] = $relativePath;
                        }
                    }
                }
            }
        }

        // Prywatne narzędzia
        if ($includePrivate && is_array($accessTools)) {
            $privateDir = __DIR__ . '/../../private/tools';
            if (is_dir($privateDir)) {
                $dirs = scandir($privateDir);
                foreach ($dirs as $dir) {
                    if ($dir !== '.' && $dir !== '..') {
                        $subDirPath = $privateDir . '/' . $dir;
                        if (is_dir($subDirPath)) {
                            // Sprawdź dostęp na podstawie $accessTools
                            foreach ($accessTools as $tool) {
                                if (
                                    isset($tool['tools_name'], $tool['access_tools']) &&
                                    $tool['tools_name'] === $dir &&
                                    (int)$tool['access_tools'] === 1
                                ) {
                                    $jsFile = $subDirPath . '/' . $dir . '.js';
                                    if (file_exists($jsFile)) {
                                        $relativePath = 'private-tool://' . $dir;
                                        $toolsPaths[] = $relativePath;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        return $toolsPaths;
    }
}
