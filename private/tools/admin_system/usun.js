class USUN_FIRME {
    constructor(parent,idCompany) {
        this.admin = parent;
        this.idCompany = idCompany;
    }
    async usunFirme() {
        const confirm = await this.confirmTitle();
        if (!confirm) {
            return; // użytkownik anulował usunięcie
        }
       const odp = await this.admin.method.deleteCompanyById(this.idCompany);
       if (odp.status) {
        const info = await this.admin.config.getInfoWindow('success', 'usunieto_firme');
        await this.admin.modal.alert(info.title,info.message);
        await this.admin.przegladajFirmy(); // odświeżenie listy firm po usunięciu
       } else {
        const info = await this.admin.config.getInfoWindow('error', odp.message || 'blad_przy_usuwaniu_firmy');
        await this.admin.modal.alert(info.title,info.message);
       }

    }

        
    async confirmTitle() {        
        const title = this.admin.config?.t?.confirm_delete_title || 'Potwierdzenie usunięcia';
        const message = this.admin.config?.t?.confirm_delete_message || 'Czy na pewno chcesz usunąć tę firmę?';
        return await this.admin.modal.confirm(title, message);
    }



}
export default USUN_FIRME;