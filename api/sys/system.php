<?php

class SYSTEM {
    
     public function __construct()
     {
 
         }
     
    // odczyt jakie katalogi i pliki sa dostempne w katalogu modules     
    public function getInfoModules(){
        $modulesDir = __DIR__ . '/../../modules';
        $modules = [];
        if (is_dir($modulesDir)) {
            $dirHandle = opendir($modulesDir);
            if ($dirHandle) {
                while (($entry = readdir($dirHandle)) !== false) {
                    if ($entry !== '.' && $entry !== '..' && is_dir($modulesDir . '/' . $entry)) {
                        $modules[] = $entry;
                    }
                }
                closedir($dirHandle);
            }
        }
        return ['status' => true, 'modules' => $modules];
    }     


}