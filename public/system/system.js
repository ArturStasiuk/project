import view from '../view/app.js';
import api from '../../private/api/api.js';
import login from '../tools/login/login.js';
import logut from '../tools/logut/logut.js';
class System {
    constructor() {
        this.api = api;// api do komunikacji z backendem
        this.isInitialized = false;// czy system jest już inicjalizowany
        this.widok = view;// widok aplikacji
        this.login = login;// tool do logowania
        this.logut = logut;// tool do wylogowywania
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
          await this.loadSystemLoggedIn();

       }
       else {
        // ladowanie systemu po nie zalogowaniu
        await this.loadSystemLoggedOut();
       }
    }
   

    // ladowanie systeu po gdy zalogowany uzytkownik
    async loadSystemLoggedIn(){
        console.log("ladowanie systemu po zalogowaniu");
        // tools wylogowywania
        await this.logut.init();
    }
    // ladowanie systemu po nie zalogowaniu
    async loadSystemLoggedOut(){
        // dodanie ikony logowania do paska menu
        await this.login.init();
        // ladowanie systemu po nie zalogowaniu
        console.log("ladowanie systemu po nie zalogowaniu");
    }



            
}

const system = new System();

export default system;
/**
 * ↩️ ⬅️ 🔙
 */