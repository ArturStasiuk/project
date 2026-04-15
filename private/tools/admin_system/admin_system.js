// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';

class ADMIN_SYSTEM {
    
    constructor() {
        this.modal = modal;
       
        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_SYSTEM */
    initialize() {
       console.log('Inicjalizacja ADMIN_SYSTEM...');
        // Tutaj możesz dodać kod inicjalizacyjny, np. rejestrację w menu startowym
        // lub innych elementów interfejsu użytkownika.
    }
    
}

const adminSystem = new ADMIN_SYSTEM();