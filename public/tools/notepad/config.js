import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent   = parent;
        this.lang = parent?.lang || 'en';
        this.translations = LAUNGE;
        /** Unikalny identyfikator okna notatnika */
        this.idWindow = 'win-notepad';
    }

    /** Zwraca obiekt tłumaczeń dla aktualnego języka. */
    _t() {
        return this.translations[this.lang] || this.translations['en'];
    }

    /**
     * Zwraca konfigurację pozycji w menu startowym.
     * Po kliknięciu otwiera okno notatnika.
     * @returns {object}
     */
    async getStartMenuItem() {
        const t = this._t();
        return {
            id:       'sm-notepad',
            icon:     t.icon,
            label:    t.label,
            disabled: false,
            onClick:  async () => await this.parent.func.openWindow()
        };
    }

    /**
     * Zwraca konfigurację okna notatnika (id, tytuł, ikona, tekst statusu).
     * @returns {object}
     */
    async getWindowItem() {
        const t = this._t();
        return {
            id:         this.idWindow,
            title:      t.title,
            icon:       t.icon,
            statusText: t.status_new_doc
        };
    }

    /**
     * Zwraca konfigurację paska menu okna notatnika.
     * @returns {object}
     */
    async getWindowMenu() {
        const t = this._t();
        return {
            id: this.idWindow,
            menus: [
                {
                    label: t.menu_file,
                    id:    'notepad-file',
                    items: [
                        { icon: '📂', label: t.menu_open, onClick: async () =>{} },
                        { icon: '💾', label: t.menu_save, onClick: async () => {} }
                    ]
                },
                {
                    label: t.menu_options,
                    id:    'notepad-options',
                    items: [
                        { icon: '⚙️', label: t.menu_settings, onClick: () => alert(t.menu_settings) },
                        { icon: '❓', label: t.menu_help,     onClick: () => alert(t.menu_help) }
                    ]
                }
            ]
        };
    }

    /**
     * Zwraca zawartość okna notatnika – karta z polem tekstowym.
     * @param {string} [cardId='card-1'] – identyfikator karty
     * @param {string} [title] – tytuł karty
     * @param {string} [text] – opcjonalna niestandardowa zawartość HTML
     * @returns {object}
     */
    async getWindowContent(cardId = 'card-1', title, text) {
        const t = this._t();
        const cardTitle = title ?? t.card_title_doc;
        const content = text ?? `
            <div class="notepad-editor">
                <textarea class="notepad-textarea"
                    placeholder="${t.placeholder}"></textarea>
            </div>`;
        return {
            id:     this.idWindow,
            cardId,
            title:  cardTitle,
            text:   content
        };
    }
}

export default CONFIG;
