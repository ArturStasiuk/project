// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import view from 'view';
import api from 'api';
import CONFIG from './config.js';
class ADMIN_SYSTEM {
    
    constructor() {
        this.lang = 'en'; // Domyślny język angielski; można zmienić na obsługiwany kod języka (np. 'pl', 'sv')
        this.modal = modal;
        this.api = api;
        this.view = view;
        this.config = new CONFIG(this);

        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_SYSTEM */
    async initialize() {
        const { message, title } = await this.config.getWelcomeMessage();
        await this.modal.alert(message, title);
        await this.view.addStartMenuItem(await this.config.getMenuItem());
        await this.view.addStartMenuItem(await this.config.getMeniuItem2());
    }
    
}

const adminSystem = new ADMIN_SYSTEM();