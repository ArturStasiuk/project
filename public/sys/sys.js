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
        await this.fun.showMenuStart();
        await this.loadaPublicTools();
    }
    

    // restart striny 
    async restart() {
    window.location.href = 'index.php';
    }
    // ladowanie modulow publicznych 
    async loadaPublicTools() {
        const tools = await this.api.send({ method: 'getPublicTools' });
        if (Array.isArray(tools)) {
            for (const path of tools) {
                try {
                    await import(`../${path}`);
                    console.log(`Załadowano moduł: ${path}`);
                } catch (e) {
                    console.error(`Błąd ładowania modułu: ${path}`, e);
                }
            }
        }
    }
    // ladowanie modolow prywatnych
    async loadaPrivateTools() {
        
    }


}
const sys = new SYS();
//window.sys = sys; // Umożliwia dostęp do obiektu SYS z konsoli przeglądarki
export default sys;
