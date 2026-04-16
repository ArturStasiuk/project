// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import view from 'view';
import api from 'api';
import CONFIG from './config.js';
class ADMIN_SYSTEM {
    
    constructor() {
        this.lang = null; // Domyślny język polski; można zmienić na obsługiwany kod języka (np. 'Polski', 'English', 'Svenska')
        this.modal = modal;
        this.api = api;
        this.view = view;
        this.config = new CONFIG(this);

        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_SYSTEM */
    async initialize() {
        const odp = await this.api.send({ method: "getUserLanguage" });
        this.lang = odp.lang || 'English';
        this.config.lang = this.lang;
        console.log(`Język użytkownika: ${this.lang}`);
        const { message, title } = await this.config.getWelcomeMessage();
        await this.modal.alert(message, title);
        await this.view.addStartMenuItem(await this.config.getMenuItem());

    }
    
}

const adminSystem = new ADMIN_SYSTEM();