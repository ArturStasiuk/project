import view from '../view/app.js';
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
        

        await this.view.refreshStartMenu({ items: await this.con.getMenuStart() });

        await this.view.addIcon(await this.con.getIconsPulpit());
        await this.view.create(await this.con.getWinLogin());
        await this.view.addCard(await this.con.getContentWinLogin());




        console.log(info);
    }


}
const sys = new SYS();
export default sys;
