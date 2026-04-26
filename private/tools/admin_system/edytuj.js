class EDYCJA_FIRMY {
    constructor(parent, id_company = null) {
        this.admin = parent;
        this.idCompany = id_company;
        this.nameCompany = '"nazwa firmy"';
    }
    
    /** otworzenie okna edycji firmy */
    async open(id_company = null) {
        if (id_company) {
            this.idCompany = id_company;
        }
        await this.showWindows();
    }

    async showWindows() {
        await this.admin.view.addWindow(this.configWindows());
    }






    configWindows() {
        return {
            id: 'edytuj_firme_' + (this.idCompany || 'unknown'),
            icon: '✏️',
            title: (this.admin?.config?.t?.label_zarzadzaj_firmami || 'Edytuj firmę') + (this.nameCompany ? `: ${this.nameCompany}` : ''),
            width: 400,
            height: 200
        };
    }
}

export default EDYCJA_FIRMY;