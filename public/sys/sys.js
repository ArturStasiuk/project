import view from '../view/app.js';
//import { desktop } from '../view/app.js';
import api from '../../api/api.js';
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
        const info = await this.api.getInfoModules();
        

        await this.view.refreshStartMenu(await this.con.getMenuStart());
        const icons = await this.con.getIconsPulpit();
        console.log('Pulpit:', icons);
        await this.view.addIcon(icons);
     




        console.log(info);
    }


}
const sys = new SYS();
export default sys;
