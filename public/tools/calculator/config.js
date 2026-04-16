import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.lang = parent?.lang || 'en';
        this.translations = LAUNGE;
        /** Unikalny identyfikator okna kalkulatora */
        this.idWindow = 'win-calculator';
    }

    /** Zwraca obiekt tłumaczeń dla aktualnego języka. */
    _t() {
        return this.translations[this.lang] || this.translations['en'];
    }

    /**
     * Zwraca konfigurację pozycji w menu startowym.
     * Po kliknięciu otwiera okno kalkulatora.
     * @returns {object}
     */
    async getStartMenuItem() {
        const t = this._t();
        return {
            id:       'sm-calculator',
            icon:     t.icon,
            label:    t.label,
            disabled: false,
            onClick:  async () => await this.parent.func.openWindow()
        };
    }

    /**
     * Zwraca konfigurację okna kalkulatora (id, tytuł, ikona, tekst statusu).
     * @returns {object}
     */
    async getWindowItem() {
        const t = this._t();
        return {
            id:         this.idWindow,
            title:      t.title,
            icon:       t.icon,
            statusText: t.status_ready,
            size:       { width: 320, height: 520 },
            controls:   { minimize: true, maximize: false, close: true }
        };
    }

    /**
     * Zwraca konfigurację paska menu okna kalkulatora.
     * @returns {object}
     */
    async getWindowMenu() {
        const t = this._t();
        return {
            id: this.idWindow,
            menus: [
                {
                    label: t.menu_view,
                    id:    'calculator-view',
                    items: [
                        { icon: '🔢', label: t.menu_standard,   onClick: async () => await this.parent.func.setMode('standard') },
                        { icon: '📐', label: t.menu_scientific, onClick: async () => await this.parent.func.setMode('scientific') }
                    ]
                },
                {
                    label: t.menu_options,
                    id:    'calculator-options',
                    items: [
                        { icon: '⚙️', label: t.menu_settings, onClick: () => alert(t.menu_settings) },
                        { icon: '❓', label: t.menu_help,     onClick: () => alert(t.menu_help) }
                    ]
                }
            ]
        };
    }

    /**
     * Zwraca zawartość okna kalkulatora – przyciski i wyświetlacz.
     * @param {string} [cardId='card-1'] – identyfikator karty
     * @param {string} [title] – tytuł karty
     * @param {string} [text] – opcjonalna niestandardowa zawartość HTML
     * @returns {object}
     */
    async getWindowContent(cardId = 'card-1', title, text) {
        const t = this._t();
        const cardTitle = title ?? t.card_title;
        const content = text ?? `
            <div class="calc-wrap">
                <div class="calc-display">
                    <div class="calc-display-expr" id="calc-expr"></div>
                    <div class="calc-display-val" id="calc-val">0</div>
                </div>
                <div class="calc-buttons">
                    <button class="calc-btn calc-btn-wide calc-btn-fn" data-action="clear">C</button>
                    <button class="calc-btn calc-btn-fn" data-action="sign">±</button>
                    <button class="calc-btn calc-btn-fn" data-action="percent">%</button>
                    <button class="calc-btn calc-btn-op" data-action="op" data-op="÷">÷</button>

                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="7">7</button>
                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="8">8</button>
                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="9">9</button>
                    <button class="calc-btn calc-btn-op" data-action="op" data-op="×">×</button>

                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="4">4</button>
                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="5">5</button>
                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="6">6</button>
                    <button class="calc-btn calc-btn-op" data-action="op" data-op="−">−</button>

                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="1">1</button>
                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="2">2</button>
                    <button class="calc-btn calc-btn-num" data-action="digit" data-digit="3">3</button>
                    <button class="calc-btn calc-btn-op" data-action="op" data-op="+">+</button>

                    <button class="calc-btn calc-btn-wide calc-btn-num" data-action="digit" data-digit="0">0</button>
                    <button class="calc-btn calc-btn-num" data-action="dot">.</button>
                    <button class="calc-btn calc-btn-eq" data-action="equals">=</button>
                </div>
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
