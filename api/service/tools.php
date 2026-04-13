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
                            // Zwróć ścieżkę względną względem katalogu 'public', czyli 'tools/nazwa/nazwa.js'
                            $relativePath = 'tools/' . $dir . '/' . $dir . '.js';
                            $toolsPaths[] = $relativePath;
                        }
                    }
                }
            }
        }
        return $toolsPaths;
    }


}