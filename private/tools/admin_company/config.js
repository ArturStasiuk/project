class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.initialize();
    }
    /** Inicjalizacja modułu CONFIG */
    initialize() {
        this.parent.modal.alert('Konfiguracja narzędzia ADMIN_COMPANY została załadowana!');
        // Tutaj możesz dodać kod inicjalizacyjny, np. rejestrację w menu startowym
        // lub innych elementów interfejsu użytkownika.
    }
}

export default CONFIG;