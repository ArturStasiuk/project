class CONFIG {
    constructor(parent) {
        this.parent   = parent;
        /** Unikalny identyfikator okna notatnika */
        this.idWindow = 'win-notepad';
    }

    /**
     * Zwraca konfigurację pozycji w menu startowym.
     * Po kliknięciu otwiera okno notatnika.
     * @returns {object}
     */
    async getStartMenuItem() {
        return {
            id:       'sm-notepad',
            icon:     '📝',
            label:    'Notatnik',
            disabled: false,
            onClick:  async () => await this.parent.func.openWindow()
        };
    }

    /**
     * Zwraca konfigurację okna notatnika (id, tytuł, ikona, tekst statusu).
     * @returns {object}
     */
    async getWindowItem() {
        return {
            id:         this.idWindow,
            title:      'Notatnik',
            icon:       '📝',
            statusText: 'Nowy dokument'
        };
    }

    /**
     * Zwraca konfigurację paska menu okna notatnika.
     * @returns {object}
     */
    async getWindowMenu() {
        const view = this.parent.view;
        const id   = this.idWindow;
        return {
            id,
            menus: [
                {
                    label: 'Widok',
                    id:    'notepad-view',
                    items: [
                        { icon: '🔢', label: 'Standardowy', onClick: () => view.setWindowStatus({ id, text: 'Tryb standardowy' }) },
                        { icon: '📐', label: 'Naukowy',     onClick: () => view.setWindowStatus({ id, text: 'Tryb naukowy' }) }
                    ]
                },
                {
                    label: 'Opcje',
                    id:    'notepad-options',
                    items: [
                        { icon: '⚙️', label: 'Ustawienia', onClick: () => alert('Ustawienia!') },
                        { icon: '❓', label: 'Pomoc',       onClick: () => alert('Pomoc!') }
                    ]
                }
            ]
        };
    }

    /**
     * Zwraca zawartość okna notatnika – karta z polem tekstowym.
     * @param {string} [cardId='card-1'] – identyfikator karty
     * @param {string} [title='📄 Dokument'] – tytuł karty
     * @param {string} [text] – opcjonalna niestandardowa zawartość HTML
     * @returns {object}
     */
    async getWindowContent(cardId = 'card-1', title = '📄 Dokument', text) {
        const content = text ?? `
            <div class="notepad-editor">
                <textarea class="notepad-textarea"
                          placeholder="Wpisz tutaj swoje notatki..."></textarea>
            </div>`;
        return {
            id:     this.idWindow,
            cardId,
            title,
            text:   content
        };
    }
}

export default CONFIG;
