import view from '../view/app.js';
import api from '../../private/api/api.js';

class System {
    constructor() {
        this.api = api;
        this.isInitialized = false;
        this.widok = view;
        this.init();
    
    }

    async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        // ukrycie widoku paska meniu 
       this.widok.hideTaskbar();
        console.log("ladowanie systemu");
       // sprwdzenie stanu logowania 



  
    }






            
}

const system = new System();

export default system;
/**
 * ↩️ ⬅️ 🔙
 */