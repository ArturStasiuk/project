import CONFIG   from './config.js';
import FUNCTION from './function.js';
import view from '../../view/app.js';
import modal from '../../view/modal.js';
import api from '../../../api/api.js';
// ladowanie styli CSS dla notatnika
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './tools/notepad/notepad.css';
document.head.appendChild(link);

/**
 * NOTEPAD – prosty notatnik tekstowy.
 *
 * Narzędzie rejestruje się w menu startowym i po kliknięciu otwiera
 * okno z edytorem tekstowym. Jest ładowane dynamicznie przez SYS.

 */
class NOTEPAD {
    constructor() {
        this.api = api;
        this.modal = modal;
        this.view = view;
        this.config = new CONFIG(this);
        this.func = new FUNCTION(this);
        this.init();
    }

    /**
     * Inicjalizacja narzędzia: dodaje pozycję w menu startowym.
     * Wywoływana automatycznie po załadowaniu skryptu.
     */
    async init() {
        await this.config.initialize();
        await this.func.addStartMenuItem();
    }




}

const notepad = new NOTEPAD();
export default notepad;
