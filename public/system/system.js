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
        this.privateModules = new Map();// zaladowane prywatne moduly
      //  this.init();// inicjalizacja systemu
        
    
    }

    async init() {
        // sprawdzenie czy system jest już inicjalizowany
        if (this.isInitialized) return;
        this.isInitialized = true;
       // sprwdzenie stanu logowania 
      const odp = await this.api.getSessionData();
       if(odp.data.id) {
        // ladowanie systemu po zalogowaniu uzytkownika
         // console.log(odp);
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
        window.dataSystem.lauguage = LAUNGE_LOGIN[code];
    }

    // ladowanie systeu po gdy zalogowany uzytkownik
    async loadSystemLoggedIn() {
      //  console.log(window.dataSystem);
       //    console.log(userData);
       // await this.api.sendData( 'Auth',  'getSessionData', {});
       // await this.loadLanguageUser();
        // tools wylogowywania
        await this.logut.init();
        // ladowanie prywatnych modulow systemu
      //  const modulesResponse = await this.api.loadPrivateModules();
// await this.loadPrivateModules(modulesResponse);

    }

    isValidPrivateModuleRow(row) {
        if (!row || typeof row !== 'object') return false;
        if (typeof row.name !== 'string' || typeof row.import_path !== 'string') return false;

        const nameValid = /^[a-z0-9_]+$/.test(row.name);
        const importValid = /^\.\.\/\.\.\/private\/tools\/[a-z0-9_]+\/[a-z0-9_]+\.js$/.test(row.import_path);

        return nameValid && importValid;
    }

    async loadPrivateModules(modulesResponse) {
        const status = modulesResponse?.status_response?.status;
        if (status !== true) {
            console.warn('Nie mozna zaladowac modulow prywatnych.', modulesResponse);
            return;
        }

        const rows = Array.isArray(modulesResponse?.data) ? modulesResponse.data : [];
        const loadedModuleNames = [];
        for (const row of rows) {
            if (!this.isValidPrivateModuleRow(row)) {
                console.warn('Pominieto niepoprawny wpis modulu.', row);
                continue;
            }

            try {
                const moduleRef = await import(row.import_path);
                const resolved = moduleRef?.default ?? moduleRef;
                this.privateModules.set(row.name, resolved);
                loadedModuleNames.push(row.name);
            } catch (error) {
                console.error('Blad ladowania modulu prywatnego:', row.name, error);
            }
        }

        window.dataSystem.privateModules = loadedModuleNames;
    }
     // ladowanie konfiguracji systemu po zalogowaniu  ;

    
    // ladowanie systemu po nie zalogowaniu
    async loadSystemLoggedOut(){
        // ladowanie jezyka
       // await this.loadLanguageUser();




        await this.login.init();

    }



            
}

const system = new System();

export default system;
