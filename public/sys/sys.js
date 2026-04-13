import view from '../view/app.js';
import api from '../../api/api.js';
import CONFIG from './conf.js';
import FUN from './func.js';
class SYS {
    constructor() {
        this.api = api;
        this.view = view;
        
        this.con = new CONFIG(this);
        this.fun = new FUN(this);
        this.init();

    }

    //================================================
    async init() {
        console.log('Inicjalizacja systemu...');
        const dat = await this.api.send({ method: 'checkLoggedIn' });
       
        await this.fun.showMenuStart(dat.loggedIn);
       
        
        if (dat.loggedIn) {
         await this.loadaPrivateTools();
        };    
        await this.loadaPublicTools();

    }
    

    // restart strony 
    async restart() {
    window.location.href = 'index.php';
    }
    // ladowanie modulow publicznych 
    async loadaPublicTools() {
        const tools = await this.api.send({ method: 'getPublicTools' });
        if (Array.isArray(tools)) {
            for (const path of tools) {
                const script = document.createElement('script');
                script.type = 'module';
                script.src = path;
                script.onload = () => {
                    console.log(`Załadowano moduł: ${path}`);
                };
                script.onerror = (e) => {
                    console.error(`Błąd ładowania modułu: ${path}`, e);
                };
                document.head.appendChild(script);
            }
        }
    }
    // ladowanie modolow prywatnych
    async loadaPrivateTools() {
      console.log('Ładowanie modułów prywatnych...');  
    }


}
const sys = new SYS();
//window.sys = sys; // Umożliwia dostęp do obiektu SYS z konsoli przeglądarki
export default sys;
