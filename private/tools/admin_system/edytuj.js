class EDYCJA_FIRMY  {
    constructor(parent) {
        this.parent = parent;
        this.idWindow = 'window-edytuj-firme';
        this.idMeniu = 'meniu-edytuj-firme';
     //   this.idCompany = id_company;
    }
    
    /** otworzenie okna edycji firmy */
    async open(id_company) {
     console.log('Otwieranie okna edycji firmy o ID:', id_company);
     // sprawdzenie czy firma istnieje
     const firmaData = await this.parent.getCompanyById(id_company);
        if (!firmaData) {
            alert('Nie można znaleźć danych firmy. Edycja niemożliwa.');
            return;
        }   
    }





  

}

export default EDYCJA_FIRMY;