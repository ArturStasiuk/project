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

    async accessMenu_Window_ZarzadzajFirmami() {
        const odp = await this.parent.api.getAccessTables('company');
        return {
            "read": !!odp.read_record,
            "create": !!odp.add_record,
            "update": !!odp.update_record,
            "delete": !!odp.delete_record
        };
    }



}
export default METHOD;