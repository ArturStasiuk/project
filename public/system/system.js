import view from '../view/app.js';
import api from '../../private/api/api.js';
import login from '../tools/login/login.js';

class System {
    constructor() {
        this.api = api;// api do komunikacji z backendem
        this.isInitialized = false;// czy system jest już inicjalizowany
        this.widok = view;// widok aplikacji
        this.login = login;// tool do logowania
        this.init();// inicjalizacja systemu
    
    }

    async init() {
        // sprawdzenie czy system jest już inicjalizowany
        if (this.isInitialized) return;
        this.isInitialized = true;
        // ukrycie widoku paska meniu 
      // this.widok.hideTaskbar();
        console.log("ladowanie systemu");
       // sprwdzenie stanu logowania 
      const odp = await this.api.getSessionData();
       if(odp.data.id_user) {
        // wywolanie po zalogowaniu strony głównej
        alert('Zalogowano');
       }
       else {
        // wywolanie po niezalogowaniu strony głównej
        this.login.init(null);
       }
    }
            
}

const system = new System();

export default system;
/**
 * ↩️ ⬅️ 🔙
 */