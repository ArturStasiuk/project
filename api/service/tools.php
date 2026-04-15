<?php // odpowiada za pobranie sciezek do modułów
class TOOLS{
    public function __construct(){}

    public function getPublicTools(): array
    {
        $toolsPaths = [];
        // Szukaj w katalogu 'public/tools' względem katalogu projektu
        $toolsDir = __DIR__ . '/../../public/tools';
        if (is_dir($toolsDir)) {
            $dirs = scandir($toolsDir);
            foreach ($dirs as $dir) {
                if ($dir !== '.' && $dir !== '..') {
                    $subDirPath = $toolsDir . '/' . $dir;
                    if (is_dir($subDirPath)) {
                        $jsFile = $subDirPath . '/' . $dir . '.js';
                        if (file_exists($jsFile)) {
                            // Zwróć ścieżkę względną względem katalogu publicznego serwera www, czyli 'tools/nazwa/nazwa.js'
                            $relativePath = 'tools/' . $dir . '/' . $dir . '.js';
                            $toolsPaths[] = $relativePath;
                        }
                    }
                }
            }
        }
        return $toolsPaths;
    }

    /** metoda zwraca listę ścieżek do prywatnych narzędzi */
   public function getPrivateTools(): array
    {
        $toolsPaths = [];
        // Szukaj w katalogu 'private/tools' względem katalogu projektu
        $toolsDir = __DIR__ . '/../../private/tools';
        if (is_dir($toolsDir)) {
            $dirs = scandir($toolsDir);
            foreach ($dirs as $dir) {
                if ($dir !== '.' && $dir !== '..') {
                    $subDirPath = $toolsDir . '/' . $dir;
                    if (is_dir($subDirPath)) {
                        $jsFile = $subDirPath . '/' . $dir . '.js';
                        if (file_exists($jsFile)) {
                            // Zwróć ścieżkę do loadera PHP, który udostępni plik z private/tools
                            $relativePath = 'tools_loader.php?file=private/tools/' . $dir . '/' . $dir . '.js';
                            $toolsPaths[] = $relativePath;
                        }
                    }
                }
            }
        }
        return $toolsPaths;
    }

}
