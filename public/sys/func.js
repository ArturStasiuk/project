
import LAUNGE from './launge.js';

class FUN {
    constructor(parent) {
        this.parent = parent;
        this.init();
    }

    /** Metoda inicjalizacyjna (zarezerwowana na przyszłe rozszerzenia). */
    async init() {}

    /** Zwraca obiekt tłumaczeń dla aktualnego języka. */
    _t() {
        const lang = this.parent?.lang || 'English';
        return LAUNGE[lang] || LAUNGE['English'];
    }

    /**
     * Odświeża menu startowe w pasku zadań na podstawie stanu logowania.
     * @param {boolean} login – true gdy użytkownik jest zalogowany
     */
    async showMenuStart(login) {
        await this.parent.view.refreshStartMenu(await this.parent.con.getMenuStart(login));
    }

    /**
     * Otwiera okno logowania i podpina obsługę przycisku „Zaloguj się".
     * Dane formularza (email, hasło) są odczytywane po kliknięciu przycisku.
     */
    async showWinLogin() {
        await this.parent.view.addWindow(await this.parent.con.getWinLogin());
        await this.parent.view.addWindowCard(await this.parent.con.getContentWinLogin());

        // Po wyrenderowaniu karty elementy formularza są dostępne w DOM
        const btn           = document.getElementById('login-button');
        const emailInput    = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        if (btn) {
            btn.onclick = async () => {
                await this.logIn(emailInput.value, passwordInput.value);
            };
        }
    }

    /** Zamyka okno logowania. */
    async closeWinLogin() {
        await this.parent.view.removeWindow({ id: 'win-login' });
    }

    /**
     * Otwiera okno wylogowania i podpina przyciski potwierdzenia / anulowania.
     */
    async showWinLogout() {
        if (typeof this.parent.con.setLang === 'function') {
            this.parent.con.setLang(this.parent.lang);
        }
        await this.parent.view.addWindow(await this.parent.con.getWinLogout());
        await this.parent.view.addWindowCard(await this.parent.con.getContentWinLogout());

        const btnConfirm = document.getElementById('confirm-logout');
        const btnCancel  = document.getElementById('cancel-logout');
        if (btnConfirm) {
            btnConfirm.onclick = async () => { await this.logOut(); };
        }
        if (btnCancel) {
            btnCancel.onclick = async () => { await this.closeWinLogout(); };
        }
    }

    /** Zamyka okno wylogowania. */
    async closeWinLogout() {
        await this.parent.view.removeWindow({ id: 'win-logout' });
    }

    /**
     * Loguje użytkownika – wysyła dane do API i restartuje aplikację.
     * @param {string} email
     * @param {string} password
     */
    async logIn(email, password) {
        const t = this._t();
        await this.closeWinLogin();
        const odp = await this.parent.api.send({ modules: 'user', method: 'loginUsers', param: { email, password } });

        if (!odp.status) {
            await this.parent.modal.alert(t.error, t.error_login);
            await this.showWinLogin();
            return;
        }
        await this.parent.modal.alert(t.success, t.success_login);
        await this.parent.restart();
    }

    /**
     * Wylogowuje użytkownika – wysyła żądanie do API i restartuje aplikację.
     */
    async logOut() {
        const t = this._t();
        await this.closeWinLogout();
        const odp = await this.parent.api.send({ modules: 'user', method: 'logoutUsers' });

        if (!odp.status) {
            await this.parent.modal.alert(t.error, t.error_logout);
            await this.showWinLogout();
            return;
        }
        await this.parent.modal.alert(t.success, t.success_logout);
        await this.parent.restart();
    }
}

export default FUN;
