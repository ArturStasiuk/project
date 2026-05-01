class DATA {
    constructor(parent) {
        this.api = parent.api;
        this.idCompany = parent.idCompany;
    }
        // pobranie konfiguracji językowej
    async getLang() {
        return await this.api.send({ method: "getUserLanguage" });
        
    }
    // pobranie danych firmy po id
    async getCompanyDataById() {
        const odp = await this.api.send({ modules: 'modules_company', method:'getCompanyDataById', param: { id_company: this.idCompany } });
        return odp.data;
    }
    // pobranie danych uzytkownikow firmy po ID firmy
    async getUsersByCompanyId() {
        const odp = await this.api.send({ modules: 'modules_company', method:'getUsersByCompanyId', param: { id_company: this.idCompany} });
        return odp.data;
    }
    // pobranie dostempu do meniu w oknie zarzadzaj uzytkownikami
    async getAccessMenu() {
        const odp = await this.api.getAccessTables('users');
        return {
            "access_table": !!odp.access_table,
            "read": !!odp.read_record,
            "create": !!odp.add_record,
            "update": !!odp.update_record,
            "delete": !!odp.delete_record
        };
    }
    // sprawdzenie czy uzytkownik jest zalogowany i ma dostep do tego narzedzia
    async getAccessTools() {
        const odp = await this.api.send({ modules: 'modules_access_tools', method: "getAccessTools", param: { tools: "users" } });
        return odp;
    }

}
export default DATA;