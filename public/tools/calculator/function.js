class FUNCTION {
    constructor(parent) {
        this.parent = parent;
        this._current = '0';
        this._expr    = '';
        this._operand = null;
        this._op      = null;
        this._newVal  = true;
    }

    /**
     * Dodaje pozycję kalkulatora do menu startowego paska zadań.
     */
    async addStartMenuItem() {
        await this.parent.view.addStartMenuItem(await this.parent.conf.getStartMenuItem());
    }

    /**
     * Otwiera okno kalkulatora i podłącza obsługę przycisków.
     */
    async openWindow() {
        await this.parent.view.addWindow(await this.parent.conf.getWindowItem());
        await this.parent.view.refreshWindowMenubar(await this.parent.conf.getWindowMenu());
        await this.parent.view.addWindowCard(await this.parent.conf.getWindowContent());
        this._bindButtons();
    }

    /**
     * Przełącza tryb kalkulatora (standard / scientific).
     * @param {string} mode
     */
    async setMode(mode) {
        const t = this.parent.conf._t();
        await this.parent.view.setWindowStatus({ id: this.parent.conf.idWindow, text: mode === 'scientific' ? t.menu_scientific : t.menu_standard });
    }

    // ── Prywatne ─────────────────────────────────────────────

    /** Podłącza obsługę kliknięć do przycisków kalkulatora. */
    _bindButtons() {
        const win = document.getElementById(this.parent.conf.idWindow);
        if (!win) return;
        win.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            switch (action) {
                case 'digit':   this._onDigit(btn.dataset.digit); break;
                case 'dot':     this._onDot(); break;
                case 'op':      this._onOp(btn.dataset.op); break;
                case 'equals':  this._onEquals(); break;
                case 'clear':   this._onClear(); break;
                case 'sign':    this._onSign(); break;
                case 'percent': this._onPercent(); break;
            }
            this._updateDisplay();
        });
    }

    _onDigit(d) {
        if (this._newVal) { this._current = d; this._newVal = false; }
        else this._current = this._current === '0' ? d : this._current + d;
    }

    _onDot() {
        if (this._newVal) { this._current = '0.'; this._newVal = false; return; }
        if (!this._current.includes('.')) this._current += '.';
    }

    _onOp(op) {
        if (this._op && !this._newVal) this._calculate();
        this._operand = parseFloat(this._current);
        this._op      = op;
        this._expr    = this._current + ' ' + op;
        this._newVal  = true;
    }

    _onEquals() {
        if (this._op === null) return;
        this._expr = this._expr + ' ' + this._current + ' =';
        this._calculate();
        this._op    = null;
        this._newVal = true;
    }

    _onClear() {
        this._current = '0';
        this._expr    = '';
        this._operand = null;
        this._op      = null;
        this._newVal  = true;
    }

    _onSign() {
        this._current = String(parseFloat(this._current) * -1);
    }

    _onPercent() {
        this._current = String(parseFloat(this._current) / 100);
    }

    _calculate() {
        const a = this._operand;
        const b = parseFloat(this._current);
        let result;
        switch (this._op) {
            case '+': result = a + b; break;
            case '−': result = a - b; break;
            case '×': result = a * b; break;
            case '÷': result = b !== 0 ? a / b : 'Error'; break;
            default:  result = b;
        }
        this._current = String(Number.isFinite(result) ? parseFloat(result.toFixed(10)) : result);
        this._operand = parseFloat(this._current);
    }

    _updateDisplay() {
        const win  = document.getElementById(this.parent.conf.idWindow);
        if (!win) return;
        const valEl  = win.querySelector('#calc-val');
        const exprEl = win.querySelector('#calc-expr');
        if (valEl)  valEl.textContent  = this._current;
        if (exprEl) exprEl.textContent = this._expr;
    }
}

export default FUNCTION;
