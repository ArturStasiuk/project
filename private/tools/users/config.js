import LAUNGE from "./launge.js";
class CONFIG {
    constructor(parent) {
        this.user = parent;
        this.lang = "English"; // domyślny język
        this.lang = LAUNGE[this.lang]; // tłumaczenia
        this.idWindow ="windows-users" + this.user.idUrzytkownika + "-" + this.user.idFirmy; // unikalne id okna
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
        return {
            id: this.idWindow,// unikalne id okna
            icon: this.lang.iconWindow, // ikona okna
            title: this.lang.nameWindow,// tytuł okna
           size: { width: 300, height: 300 }, // rozmiar okna

        };

    }
    // konfiguracja na pasku nawigacji     
   async configNavBar () {
        return {
            
            id:"nav-users-",// unikalne id elementu nawigacji 
            icon: this.lang.iconWindow,
            label: this.lang.nameTaskBar,
            disabled: false, // na początku wyłączony, będzie włączony po załadowaniu okna
            onClick: async () => {await this.user.openWindow();} // otwarcie okna po kliknięciu        
        };  
    }





}
export default CONFIG;