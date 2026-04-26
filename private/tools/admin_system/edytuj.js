class EDYCJA_FIRMY {
    constructor(parent, id_company = null) {
        this.admin = parent;
        this.idCompany = id_company;
        this.nameCompany = null;
        this.daneFirmy = null;
    }
    
    /** otworzenie okna edycji firmy */
    async open(id_company = null) {
        if (id_company) {
            this.idCompany = id_company;
        }
        this.daneFirmy = await this.pobiezDaneFirmy();
        await this.showWindows();
    }

    async showWindows() {
        await this.admin.view.addWindow(await this.configWindows());
    }




    async pobiezDaneFirmy() {
        if (!this.idCompany) {
            return null;
        }
        try {
         const data = await this.admin.method.getCompanyDataById(this.idCompany);
         return data;
        }
        catch (error) {
            console.error("Error fetching company data:", error);
            return null;
        }
    }

    async configWindows() {
        const defaultTitle = this.admin?.config?.t?.menu_edytuj || 'Edytuj firmę';
        const companyTitle = this.daneFirmy?.name ? `${defaultTitle}: ${this.daneFirmy.name}` : defaultTitle;
        return {
            id: 'edytuj_firme_' + (this.idCompany || 'unknown'),
            icon: '✏️',
            title: companyTitle,
            width: 400,
            height: 200
        };
    }
}

export default EDYCJA_FIRMY;