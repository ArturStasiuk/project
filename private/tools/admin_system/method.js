class METHOD {
        constructor(parent) {
            this.parent = parent;
        }
    
    /** czy jest dostemp do modulu */
    async isAccessOpenWindow() {
        const odp = await this.parent.api.getAccessTables('company');
        return odp.access_table;
    }
    /** pobranie danych firm */
    async getCompanyData(data = null) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getAllCompanyData', param: {data} });
        return odp.data;
    }
     /** pobranie  dostepu meniu w oknie zarzadzaj firmami */
    async accessMenu_Window_ZarzadzajFirmami() {
        const odp = await this.parent.api.getAccessTables('company');
        return {
            "read": !!odp.read_record,
            "create": !!odp.add_record,
            "update": !!odp.update_record,
            "delete": !!odp.delete_record
        };
    }
    /** pobranie danych firmy po ID */
    async getCompanyDataById(id) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getCompanyDataById', param: { id_company: id } });
        return odp.data;
    }
    /** pobranie danych uzytkownikow firmy po ID firmy */
    async getUsersByCompanyId(id) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getUsersByCompanyId', param: { id_company: id } });
        return odp.data;
    }




}
export default METHOD;