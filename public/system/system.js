import view from '../view/app.js';
import api from '../../private/api/api.js';
import login from '../tools/login/login.js';

class System {
    constructor() {
        this.api = api;// api do komunikacji z backendem
        this.isInitialized = false;// czy system jest już inicjalizowany
        this.widok = view;// widok aplikacji
        this.login = login;// tool do logowania
      //  this.init();// inicjalizacja systemu
    
    }

    async init() {
        // sprawdzenie czy system jest już inicjalizowany
        if (this.isInitialized) return;
        this.isInitialized = true;
       // this.widok.hideTaskbar();
       // sprwdzenie stanu logowania 
      const odp = await this.api.getSessionData();
       if(odp.data.id) {
        // ladowanie systemu po zalogowaniu
          await this.loadSystem();

       }
       else {
        // jezeli nie zalogowany dodanie ikony logowaniana do paska menu
        const icon = {
            id: 'login_icon',
            icon: '🔐',
            label: 'Login',
            onClick: async () => {
                await this.login.showLoginWindow();
            }
        }
        this.widok.addTaskbarItem(icon);
      //  await this.login.init();
     
       }
    }





    // ladowanie systeu po gdy zalogowany uzytkownik
    async loadSystem(){


        console.log("ladowanie systemu po zalogowaniu");
    }




            
}

const system = new System();

export default system;
/**
 * ↩️ ⬅️ 🔙
 */