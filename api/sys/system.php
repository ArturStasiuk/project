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
    // odczyt z bazy danych jakie moduly sa dostempne dla danego uzytkowika narazie dane na sztywno ustawione
    private function getInfoModulesForUser($userId){
        $modules = [];
        $modules[] = [
           'modules_name' => 'usercontolpanel',
           'active' => '1',
           'read'=>'1',
           'append'=>'1',
           'clear'=>'1',
           'modify'=>'1',
        ];
       $modules[] = [
           'modules_name' => 'notepad',
           'active' => '1',
           'read' => '1',
           'append' => '1',
           'clear' => '1',
           'modify' => '1',
       ];
       return ['status' => true, 'modules' => $modules];
    }



}