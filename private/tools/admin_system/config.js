import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.lang = parent?.lang || 'en';
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
            id: "sm-admin_system",
            icon: t.icon || '⚙️',
            label: t.label_admin_system || 'Admin System',
            disabled: false,
            onClick: async () => await this.parent.func.openWindow()
        };
   }
    async getMeniuItem2() {
        const t = this.translations[this.lang] || {};
        return {
            id: "sm-admin_system_2",
            icon: t.icon2 || '🔧',
            label: t.label_admin_system_2 || 'Admin System 2',
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