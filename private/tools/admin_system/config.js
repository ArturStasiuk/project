import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.api = parent.api;
        this.translations = LAUNGE;
        this.lang = null;
    }
    /** Inicjalizacja modułu CONFIG */
    async initialize() {
        const { lang = 'English' } = await this.api.send({ method: "getUserLanguage" }) || {};
        this.lang = lang;
        this.t = this.translations[lang] || {};
        console.log(`Język użytkownika: ${lang}`);
    }

    // Zwraca konfigurację pozycji w menu startowym dla narzędzia ADMIN_SYSTEM
   async getMenuItem() {
        const t = this.t;
        return {
            id: "zarzadaj_firmami",
            icon: t.icon || ' 🏬',
            label: t.label_admin_system || 'Zarządzaj firmami',
            disabled: false,
            onClick: async () => await this.parent.func.openWindow()
        };
   }

    async getWelcomeMessage() {
        const t = this.t;
        return {
            message: t.welcome || 'Welcome to the admin panel!',
            title: t.title_welcome || 'Welcome'
        };
    }


}

export default CONFIG;