<?php

class SYSTEM {
    
     public function __construct()
     {
 
         }
     
    // odczyt jakie katalogi i pliki sa dostempne w katalogu modules     
    public function getInfoModules(){
        $modulesDir = __DIR__ . '/../../modules';
        $jsFiles = [];
        if (is_dir($modulesDir)) {
            $dirHandle = opendir($modulesDir);
            if ($dirHandle) {
                while (($entry = readdir($dirHandle)) !== false) {
                    if ($entry !== '.' && $entry !== '..' && is_dir($modulesDir . '/' . $entry)) {
                        $jsFile = $modulesDir . '/' . $entry . '/' . $entry . '.js';
                        if (file_exists($jsFile)) {
                            // Ścieżka względem katalogu public
                            $relativePath = '../modules/' . $entry . '/' . $entry . '.js';
                            $jsFiles[] = $relativePath;
                        }
                    }
                }
                closedir($dirHandle);
            }
        }
        return ['status' => true, 'jsFiles' => $jsFiles];
    }     
    //

}