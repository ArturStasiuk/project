<?php // odpowiada za pobranie sciezek do modułów
class TOOLS{
    public function __construct(){}

    /**
     * Zwraca ścieżki do wszystkich narzędzi (publiczne i prywatne)
     * @param bool $includePrivate Czy dołączyć narzędzia prywatne
     * @return array
     */
    public function getAllTools(bool $includePrivate = false): array
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
        // pomijamy sprawdzanie zalogowanego 
        $includePrivate = true; // ustawiamy na true, aby zawsze dołączać narzędzia prywatne
        if ($includePrivate) {
            $privateDir = __DIR__ . '/../../private/tools';
            if (is_dir($privateDir)) {
                $dirs = scandir($privateDir);
                foreach ($dirs as $dir) {
                    if ($dir !== '.' && $dir !== '..') {
                        $subDirPath = $privateDir . '/' . $dir;
                        if (is_dir($subDirPath)) {
                            $jsFile = $subDirPath . '/' . $dir . '.js';
                            if (file_exists($jsFile)) {
                                $relativePath = 'api/service/tools_loader.php?file=private/tools/' . $dir . '/' . $dir . '.js';
                                $toolsPaths[] = $relativePath;
                            }
                        }
                    }
                }
            }
        }
        return $toolsPaths;
    }
}
