import view from '../view/app.js';
import api from '../../api/api.js';
//
import CONFIG from './conf.js';
import FUN from './func.js';
class SYS {
    constructor() {
        this.api = api;
        this.view =  view;
        this.con = new CONFIG(this);
        this.fun = new FUN(this);
        this.init();

    }

    //================================================
    async init() {
        console.log('Inicjalizacja systemu...');

        



        
        await this.fun.showMenuStart();
        await this.fun.showIconsPulpit();
        await this.api.crud({ function: 'getUserInfo' });




    }


}
const sys = new SYS();
window.sys = sys; // Umożliwia dostęp do obiektu SYS z konsoli przeglądarki
export default sys;
