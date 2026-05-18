<?php
require_once PATH_LOAD_PRIVATE_MODULES;

class Modules {
    private $procedureSql;
    private $access;

    public function __construct($conn, $procedureSql, $getData, $access) {
        $this->procedureSql = $procedureSql;
        $this->access = $access;
    }

    public function loadPrivateModules() {
        $id_users = $this->access->sprawdzSesje();
        $result = $this->procedureSql->sp_get_access_tools($id_users);
        if (isset($result['data']) && is_array($result['data'])) {
            $result['data'] = PrivateModulesLoader::buildSafeModules($result['data']);
        }
        return $result;
    }
}
return Modules::class;