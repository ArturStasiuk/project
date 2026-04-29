import LAUNGE from "./launge.js";
class CONFIG {
    constructor(parent) {
        this.user = parent;
        this.lang = "English"; // domyślny język
        this.lang = LAUNGE[this.lang]; // tłumaczenia
        this.idWindow ="windows-users" + this.user.idUrzytkownika + "-" + this.user.idFirmy; // unikalne id okna
        this.method = this.user.method; // metody i funkcje
    }


   // konfiguracja okna glownego 
  async configWindow () {
        return {
            id: this.idWindow,// unikalne id okna
            icon: this.lang.iconWindow, // ikona okna
            title: this.lang.nameWindow,// tytuł okna
            width: 300,
            height: 300,

        };

    }
    // konfiguracja na pasku nawigacji     
   async configNav () {
        return {
            id: "nav-users", // unikalne id elementu nawigacji
            icon: this.lang.iconWindow, // ikona elementu nawigacji
            title: this.lang.nameWindow, // tytuł elementu nawigacji
            onClick: () => this.user.windows.main.open(), // funkcja otwierająca okno po kliknięciu
        };  
    }





}
export default CONFIG;