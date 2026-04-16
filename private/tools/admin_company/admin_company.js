// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import view from 'view';
import api from 'api';
import CONFIG from './config.js';
class ADMIN_COMPANY{

    constructor() {
        this.modal = modal;
        this.config = new CONFIG(this);

        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_COMPANY */
    async initialize() {

       await modal.alert('ADMIN_COMPANY initialized', 'Initialization complete');
        await view.addStartMenuItem({
            id: "this.idadmin_company",
            icon: '🏢',
            label: 'Admin Company',
            disabled: false,
            onClick: async () => await this.openWindow()
        });
    }
        
}

const adminCompany = new ADMIN_COMPANY();