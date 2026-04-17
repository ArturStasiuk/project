

import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.api = parent.api;
        this.lang = 'English';
        this.t = LAUNGE[this.lang] || {};
    }
    /** Inicjalizacja modułu CONFIG */
    async initialize() {
        // Pobiera język użytkownika przez API i ustawia tłumaczenia
        const odp = await this.api.send({ method: "getUserLanguage" });
        this.lang = odp.lang || 'English';
        this.t = LAUNGE[this.lang] || {};
        console.log(`Język użytkownika: ${this.lang}`);
    }

    // Zwraca konfigurację pozycji w menu startowym dla narzędzia ADMIN_SYSTEM
   async getMenuItem() {
        return {
            id: "zarzadaj_firmami",
            icon: this.t.icon || ' 🏬',
            label: this.t.label_admin_system || 'Zarządzaj firmami',
            disabled: false,
            onClick: async () => await this.parent.func.openWindow()
        };
   }

    async getWelcomeMessage() {
        return {
            message: this.t.welcome || 'Welcome to the admin panel!',
            title: this.t.title_welcome || 'Welcome'
        };
    }


}

export default CONFIG;