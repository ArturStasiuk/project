import LAUNGE from "./launge.js";
class CONFIG {
    constructor(parent) {
        this.user = parent;
        this.lang = "English"; // domyślny język
        this.lang = LAUNGE[this.lang]; // tłumaczenia
        //this.idWindow ="windows-users" + this.user.idUrzytkownika + "-" + this.user.idFirmy; // unikalne id okna
        this.method = this.user.method; // metody i funkcje
    }
   // pobranie konfiguracji językowej
    async configLang() {
        // Pobiera język użytkownika przez API i ustawia tłumaczenia
        const odp = await this.method.getLang();
        this.lang = (odp && odp.lang) ? odp.lang : 'English';
        this.lang = LAUNGE[this.lang] || {};
    }

   // konfiguracja okna glownego 
  async configWindow () {
         const odp = await this.method.getCompanyDataById(this.user.idCompany);
         const companyName = odp ? odp.name : 'Unknown Company';
        return {
            id: this.user.name,// unikalne id okna z nazwy instancji USERS
            icon: this.lang.iconWindow, // ikona okna
            title: `${this.lang.nameWindow}${companyName ? ': ' + companyName : ''}`, // tytuł okna z tłumaczeniem i nazwą firmy
            size: { width: 600, height: 500 }, // rozmiar okna

        };

    }
    // konfiguracja na pasku nawigacji     
   async configNavBar () {
        return {
            
            id:"nav-users-" + this.user.name,// unikalne id elementu nawigacji 
            icon: this.lang.iconWindow,
            label: this.lang.nameTaskBar,
            disabled: false, // na początku wyłączony, będzie włączony po załadowaniu okna
            onClick: async () => { this.users = await users(this.user.name, null, null);} // otwarcie pustego okna po kliknięciu        
        };  
    }





}
export default CONFIG;