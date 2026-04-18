class METHOD{
        constructor(parent) {
            this.parent = parent;
        }

    /** czy jest dostemp do modulu */
    async isAccess() {
        const odp = await this.parent.api.send({ method:'gestAccessTtables', param: { tables: 'company' } });
        return odp.status;

    }





    

}
export default METHOD;