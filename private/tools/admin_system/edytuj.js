class EDYCJA_FIRMY extends ADMIN_SYSTEM {
    constructor(id_company) {
        super();
        this.idWindow = 'window-edytuj-firme';
        this.idMeniu = 'meniu-edytuj-firme';
        this.idCompany = id_company;
    }
    
    /** otworzenie okna edycji firmy */
    async open() {
     console.log('Otwieranie okna edycji firmy o ID:', this.idCompany);
    }



}