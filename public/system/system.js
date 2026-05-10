import view from '../view/app.js';
import api from '../../private/api/api.js';
import login from '../tools/login/login.js';

class System {
    constructor() {
        this.api = api;
        this.isInitialized = false;
        this.widok = view;
        this.login = login;
        this.init();
    
    }

    async init() {
        // sprawdzenie czy system jest już inicjalizowany
        if (this.isInitialized) return;
        this.isInitialized = true;
        // ukrycie widoku paska meniu 
       this.widok.hideTaskbar();
        console.log("ladowanie systemu");
       // sprwdzenie stanu logowania 
      const odp = await this.api.getSessionData();
       if(odp.data.id_user) {
        // wywolanie po zalogowaniu strony głównej
        alert('Zalogowano');
       }
       else {
        // wywolanie po niezalogowaniu strony głównej
        alert('Nie zalogowano');
       }
    }
            
}

const system = new System();

export default system;
/**
 * ↩️ ⬅️ 🔙
 */