class METHOD{
        constructor(parent) {
            this.parent = parent;
        }

    /** czy jest dostemp do modulu */
    async isAccessOpenWindow() {
        const odp = await this.parent.api.send({ method:'gestAccessTtables', param: { tables: 'company' } });
        return odp.access_table;
    }
    /** pobranie danych firm */
    async getCompanyData(data = null) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getAllCompanyData', param: {data} });
        return odp.data;
    }

    

}
export default METHOD;