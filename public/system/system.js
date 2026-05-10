import view from '../view/app.js';
import api from '../../private/api/api.js';
import login from '../tools/login/login.js';
import logut from '../tools/logut/logut.js';
import LAUNGE_LOGIN from '../tools/login/laungue_login.js';
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

    /** Ustawia window.dataSystem.language i window.dataSystem.launge z API oraz LAUNGE_LOGIN. */
    async loadLanguageUser() {
        const res = await this.api.getLanguageUser();
        const raw = res?.language ?? res?.data?.language ?? 'English';
        const supported = Object.keys(LAUNGE_LOGIN);
        const code = supported.includes(raw) ? raw : 'English';
        window.dataSystem.language = code;
        window.dataSystem.launge = LAUNGE_LOGIN[code];
    }

    // ladowanie systeu po gdy zalogowany uzytkownik
    async loadSystemLoggedIn(){
        console.log("ladowanie systemu po zalogowaniu");
        // ladowanie jezyka
        await this.loadLanguageUser();
        // tools wylogowywania
        await this.logut.init();
    }


    
    // ladowanie systemu po nie zalogowaniu
    async loadSystemLoggedOut(){
        // ladowanie jezyka
        await this.loadLanguageUser();




        await this.login.init();

    }



            
}

const system = new System();

export default system;
