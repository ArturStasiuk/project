// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import view from 'view';
import api from 'api';
import CONFIG from './config.js';
class ADMIN_COMPANY{

    constructor() {
        this.lang = 'English';
        this.modal = modal;
        this.api = api;
        this.view = view;
        this.config = new CONFIG(this);

        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_COMPANY */
    async initialize() {
        const t = this.config._t();
        await modal.alert(t.initialized, t.init_complete);
        await view.addStartMenuItem(await this.config.getStartMenuItem());
    }
        
}

const adminCompany = new ADMIN_COMPANY();