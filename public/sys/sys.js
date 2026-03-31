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
        this.view.refreshStartMenu([
            { id: 'sm-notes', icon: '📝', label: 'Notatnik', onClick: () => view.restore('win-notes') },
            { id: 'sm-calc', icon: '🧮', label: 'Kalkulator', onClick: () => view.restore('win-calc') },
            'separator',
            { id: 'sm-settings', icon: '⚙️', label: 'Ustawienia', onClick: () => alert('Ustawienia') },
            { id: 'sm-off', icon: '⏻', label: 'Wyłącz', disabled: true }
        ]);






        console.log(info);
    }


}
const sys = new SYS();
export default sys;
