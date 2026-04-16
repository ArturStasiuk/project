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

    /** Zwraca obiekt tłumaczeń dla aktualnego języka. */
    _t() {
        return this.translations[this.lang] || this.translations['en'];
    }

    /** Zwraca konfigurację pozycji w menu startowym. */
    async getStartMenuItem() {
        const t = this._t();
        return {
            id: 'sm-admin_company',
            icon: t.icon,
            label: t.label,
            disabled: false,
            onClick: async () => await this.parent.openWindow()
        };
    }
}

export default CONFIG;