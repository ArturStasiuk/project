import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.lang = parent?.lang || 'en';
        this.translations = LAUNGE;
    }

    /**
     * Zwraca konfigurację menu startowego zależną od stanu logowania.
     * @param {boolean} login – true gdy użytkownik jest zalogowany
     * @returns {object} konfiguracja menu z tablicą pozycji
     */
    async getMenuStart(login) {
        const t = this.translations[this.lang] || this.translations['en'];
        if (login) {
            return {
                items: [
                    {
                        id: 'sm-logout', icon: t.icon_logout, label: t.label_logout,
                        onClick: async () => await this.parent.fun.showWinLogout()
                    }
                ]
            };
        }
        return {
            items: [
                {
                    id: 'sm-login', icon: t.icon_login, label: t.label_login,
                    onClick: async () => await this.parent.fun.showWinLogin()
                }
            ]
        };
    }

    /**
     * Zwraca konfigurację okna logowania (id, tytuł, ikona, rozmiar, sterowanie).
     * @returns {object}
     */
    async getWinLogin() {
        const t = this.translations[this.lang] || this.translations['en'];
        return {
            id: 'win-login',
            title: t.title_login,
            icon: t.icon_login,
            statusText: t.status_login,
            controls: { minimize: true, maximize: false, close: true },
            size: { width: 400, height: 440 }
        };
    }

    /**
     * Zwraca zawartość okna logowania – formularz email + hasło.
     * Klasy CSS (.sys-form, .sys-form-input, .sys-form-btn) są zdefiniowane w style.css.
     * @returns {object}
     */
    async getContentWinLogin() {
        const t = this.translations[this.lang] || this.translations['en'];
        return {
            id: 'win-login',
            cardId: 'card-1',
            title: t.card_title_login,
            text: `
                <form id="login-form" class="sys-form">
                    <label for="login-email">${t.label_email}</label>
                    <input id="login-email" name="email" type="email"
                           placeholder="${t.placeholder_email}" autocomplete="email"
                           required class="sys-form-input">
                    <label for="login-password">${t.label_password}</label>
                    <input id="login-password" name="password" type="password"
                           placeholder="${t.placeholder_password}" autocomplete="current-password"
                           required class="sys-form-input">
                    <button type="button" id="login-button" class="sys-form-btn">${t.btn_login}</button>
                </form>
            `
        };
    }

    /**
     * Zwraca konfigurację okna wylogowania.
     * @returns {object}
     */
    async getWinLogout() {
        const t = this.translations[this.lang] || this.translations['en'];
        return {
            id: 'win-logout',
            title: t.title_logout,
            icon: t.icon_logout,
            statusText: t.status_logout,
            controls: { minimize: false, maximize: false, close: true },
            size: { width: 400, height: 350 }
        };
    }

    /**
     * Zwraca zawartość okna wylogowania – pytanie z przyciskami Tak / Nie.
     * @returns {object}
     */
    async getContentWinLogout() {
        const t = this.translations[this.lang] || this.translations['en'];
        return {
            id: 'win-logout',
            cardId: 'card-1',
            title: t.card_title_logout,
            text: `
                <div class="sys-form">
                    <p>${t.confirm_logout}</p>
                    <div class="sys-form-row">
                        <button id="confirm-logout" class="sys-form-btn sys-form-btn--danger">${t.yes}</button>
                        <button id="cancel-logout"  class="sys-form-btn">${t.no}</button>
                    </div>
                </div>
            `
        };
    }
}

export default CONFIG;
