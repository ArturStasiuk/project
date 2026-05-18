<?php
require_once PATH_LOAD_PRIVATE_MODULES;

class Modules {
    private $procedureSql;
    private $access;
    private $constructorArgs;

    public function __construct($conn, $procedureSql, $getData, $access, ...$args) {
        $this->procedureSql = $procedureSql;
        $this->access = $access;
        $this->constructorArgs = $args;
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