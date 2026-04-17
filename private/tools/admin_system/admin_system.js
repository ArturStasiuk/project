// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import view from 'view';
import api from 'api';
import CONFIG from './config.js';
class ADMIN_SYSTEM {
    
    constructor() {
        this.modal = modal;
        this.api = api;
        this.view = view;
        this.config = new CONFIG(this);
        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_SYSTEM */
    async initialize() {
        await this.config.initialize();
        const { message, title } = await this.config.getWelcomeMessage();
        await this.modal.alert(message, title);
        await this.view.addStartMenuItem(await this.config.getMenuItem());
    }
    
    /** otwieranie okna o pdanym id */
    async open_Window_ZarzadzajFirmami() { 
        await this.view.addWindow(await this.config.get_Window_ZarzadzajFirmami());
        /** dodanie meniu do okna  */
        await this.view.addMeniuWindow(await this.config.getMenu_Window_ZarzadzajFirmami());
        await this.api.send({ modules: 'modules_company', method: 'getAllCompanyData', param: {parametr1: 'value1'} });
    }






}

const adminSystem = new ADMIN_SYSTEM();