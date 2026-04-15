// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import CONFIG from './config.js';
class ADMIN_COMPANY{

    constructor() {
        this.modal = modal;
        this.config = new CONFIG(this);

        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_COMPANY */
    initialize() {
        modal.alert('Witaj w panelu company');
        //console.log('Inicjalizacja ADMIN_COMPANY...');
        // Tutaj możesz dodać kod inicjalizacyjny, np. rejestrację w menu startowym
        // lub innych elementów interfejsu użytkownika.
    }

}

const adminCompany = new ADMIN_COMPANY();