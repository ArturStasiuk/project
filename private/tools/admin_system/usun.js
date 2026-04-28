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

    }

        
    async confirmTitle() {        
        const title = this.admin.config?.t?.confirm_delete_title || 'Potwierdzenie usunięcia';
        const message = this.admin.config?.t?.confirm_delete_message || 'Czy na pewno chcesz usunąć tę firmę?';
        return await this.admin.modal.confirm(title, message);
    }



}
export default USUN_FIRME;