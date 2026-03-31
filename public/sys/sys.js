import view from '../view/app.js';
import api from '../../api/api.js';
class SYS {
    constructor() {
       this.api = api;
        this.view = view;
        this.init();

    }

    //================================================
    async init() {
        console.log('Inicjalizacja systemu...');
        const info = await this.api.getInfoModules();
       





        console.log(info);
    }


}
const sys = new SYS();
export default sys;
