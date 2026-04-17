import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.api = parent.api;
        this.lang = 'English';
        this.t = LAUNGE[this.lang] || {};
        this.idWindow = 'win-notepad';

    }
    /** Inicjalizacja modułu CONFIG */
    async initialize() {
        // Pobiera język użytkownika przez API i ustawia tłumaczenia
        const odp = await this.api.send({ method: "getUserLanguage" });
        this.lang = odp.lang || 'English';
        this.t = LAUNGE[this.lang] || {};
    
    }



    /**
     * Zwraca konfigurację pozycji w menu startowym.
     * Po kliknięciu otwiera okno notatnika.
     * @returns {object}
     */
    async getStartMenuItem() {
        return {
            id:       'sm-notepad',
            icon:     this.t.icon,
            label:    this.t.label,
            disabled: false,
           // onClick:  async () => await this.parent.func.openWindow()
        };
    }

    /**
     * Zwraca konfigurację okna notatnika (id, tytuł, ikona, tekst statusu).
     * @returns {object}
     */
    async getWindowItem() {
  
        return {
            id:         this.idWindow,
            title:      this.t.title,
            icon:       this.t.icon,
            statusText: this.t.status_new_doc
        };
    }

    /**
     * Zwraca konfigurację paska menu okna notatnika.
     * @returns {object}
     */
    async getWindowMenu() {
  
        return {
            id: this.idWindow,
            menus: [
                {
                    label: this.t.menu_file,
                    id:    'notepad-file',
                    items: [
                        { icon: '📂', label: this.t.menu_open, onClick: async () =>{} },
                        { icon: '💾', label: this.t.menu_save, onClick: async () => {} }
                    ]
                },
                {
                    label: this.t.menu_options,
                    id:    'notepad-options',
                    items: [
                        { icon: '⚙️', label: this.t.menu_settings, onClick: () => alert(this.t.menu_settings) },
                        { icon: '❓', label: this.t.menu_help,     onClick: () => alert(this.t.menu_help) }
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
      
        const cardTitle = title ?? this.t.card_title_doc;
        const content = text ?? `
            <div class="notepad-editor">
                <textarea class="notepad-textarea"
                    placeholder="${this.t.placeholder}"></textarea>
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
