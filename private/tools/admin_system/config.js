import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.lang = parent.lang || 'English';
        this.translations = LAUNGE;
        this.initialize();
    }
    /** Inicjalizacja modułu CONFIG */
    initialize() {

    }

    // Zwraca konfigurację pozycji w menu startowym dla narzędzia ADMIN_SYSTEM
   async getMenuItem() {
        const t = this.translations[this.lang] || {};
        return {
            id: "zarzadaj_firmami",
            icon: t.icon || ' 🏬',
            label: t.label_admin_system || 'Zarządzaj firmami',
            disabled: false,
            onClick: async () => await this.parent.func.openWindow()
        };
   }

    async getWelcomeMessage() {
        const t = this.translations[this.lang] || {};
        return {
            message: t.welcome || 'Welcome to the admin panel!',
            title: t.title_welcome || 'Welcome'
        };
    }


}

export default CONFIG;