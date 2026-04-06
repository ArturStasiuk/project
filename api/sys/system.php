<?php

class SYSTEM {
    
     public function __construct()
     {
 
         }
     
    // odczyt jakie katalogi i pliki sa dostempne w katalogu modules,
    // filtrowane do aktywnych modułów danego użytkownika
    public function getInfoModules($userId = null){
        $modulesDir = __DIR__ . '/../../modules';
        $jsFiles = [];

        // Pobierz listę aktywnych modułów dla użytkownika
        $allowedModules = null;
        if ($userId !== null) {
            $userModulesInfo = $this->getInfoModulesForUser($userId);
            if ($userModulesInfo['status']) {
                $allowedModules = [];
                foreach ($userModulesInfo['modules'] as $mod) {
                    if (isset($mod['active']) && $mod['active'] === '1') {
                        $allowedModules[] = $mod['modules_name'];
                    }
                }
            }
        }

        if (is_dir($modulesDir)) {
            $dirHandle = opendir($modulesDir);
            if ($dirHandle) {
                while (($entry = readdir($dirHandle)) !== false) {
                    if ($entry !== '.' && $entry !== '..' && is_dir($modulesDir . '/' . $entry)) {
                        // Pomiń moduły, do których użytkownik nie ma dostępu
                        if ($allowedModules !== null && !in_array($entry, $allowedModules)) {
                            continue;
                        }
                        $jsFile = $modulesDir . '/' . $entry . '/' . $entry . '.js';
                        if (file_exists($jsFile)) {
                            // Ścieżka przez proxy PHP (zamiast bezpośrednio do pliku statycznego)
                            $jsFiles[] = '/api/sys/module_loader.php?file=' . rawurlencode($entry . '/' . $entry . '.js');
                        }
                    }
                }
                closedir($dirHandle);
            }
        }
        return ['status' => true, 'jsFiles' => $jsFiles];
    }
    // odczyt z bazy danych jakie moduly sa dostempne dla danego uzytkowika narazie dane na sztywno ustawione
    public function getInfoModulesForUser($userId){
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