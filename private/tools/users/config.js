import LAUNGE from "./launge.js";
class CONFIG {
    constructor(parent) {
        this.user = parent;
        this.lang = "English"; // domyślny język
        this.lang = LAUNGE[this.lang]; // tłumaczenia
        this.method = this.user.method; // metody i funkcje
        this.data = this.user.data; // dane i logika biznesowa
    }
   // pobranie konfiguracji językowej
    async configLang() {
        // Pobiera język użytkownika przez API i ustawia tłumaczenia
        const odp = await this.data.getLang();
        this.lang = (odp && odp.lang) ? odp.lang : 'English';
        this.lang = LAUNGE[this.lang] || {};
    }

   // konfiguracja okna glownego 
  async configWindow () {
         const odp = await this.data.getCompanyDataById(this.user.idCompany);
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
    // konfiguracja menu w oknie zarządzaj użytkownikami
    async configMenu() {
        const accessMenu = await this.data.getAccessMenu();
        return {

            id: this.user.name, // unikalne id okna USERS
            menuId: "menu-users-" + this.user.name, // unikalne id menu
            label: this.lang.menuLabelUsers, // etykieta menu z tłumaczeniem
            items: [
                {
                    icon: this.lang.meniuIconUsers1,
                    label: this.lang.menuItemsUsers1,
                    onClick: async () => { /* akcja dla menu item 1 */ }
                },
                {
                    icon: this.lang.meniuIconUsers2,
                    label: this.lang.menuItemsUsers2,
                    onClick: async () => { /* akcja dla menu item 2 */ }
                }
            ]
        }

    }




}
export default CONFIG;