class METHOD{
        constructor(parent) {
            this.parent = parent;
        }
    
    /** czy jest dostemp do modulu */
    async isAccessOpenWindow() {
        const odp = await this.accessTable();
        return odp.access_table;
    }
    /** pobranie danych firm */
    async getCompanyData(data = null) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getAllCompanyData', param: {data} });
        return odp.data;
    }

    async accessMenu_Window_ZarzadzajFirmami() {
        const odp = await this.accessTable();
        return {
            "read": !!odp.read_record,
            "create": !!odp.add_record,
            "update": !!odp.update_record,
            "delete": !!odp.delete_record
        };
    }

    /** sprawdza dostęp do tabeli company */
    async accessTable() {
        const odp = await this.parent.api.send({ method:'gestAccessTtables', param: { tables: 'company' } });

        return odp
    }
}
export default METHOD;