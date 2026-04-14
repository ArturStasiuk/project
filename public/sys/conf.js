class CONFIG {
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * Zwraca konfigurację menu startowego zależną od stanu logowania.
     * @param {boolean} login – true gdy użytkownik jest zalogowany
     * @returns {object} konfiguracja menu z tablicą pozycji
     */
    async getMenuStart(login) {
        if (login) {
            return {
                items: [
                    {
                        id: 'sm-logout', icon: '⏻', label: 'Wyloguj',
                        onClick: async () => await this.parent.fun.showWinLogout()
                    }
                ]
            };
        }
        return {
            items: [
                {
                    id: 'sm-login', icon: '🔐', label: 'Zaloguj',
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
        return {
            id: 'win-login',
            title: 'Logowanie',
            icon: '🔐',
            statusText: 'Podaj login i hasło',
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
        return {
            id: 'win-login',
            cardId: 'card-1',
            title: '🔐 Logowanie',
            text: `
                <form id="login-form" class="sys-form">
                    <label for="login-email">Email</label>
                    <input id="login-email" name="email" type="email"
                           placeholder="Wpisz email" autocomplete="email"
                           required class="sys-form-input">
                    <label for="login-password">Hasło</label>
                    <input id="login-password" name="password" type="password"
                           placeholder="Wpisz hasło" autocomplete="current-password"
                           required class="sys-form-input">
                    <button type="button" id="login-button" class="sys-form-btn">Zaloguj się</button>
                </form>
            `
        };
    }

    /**
     * Zwraca konfigurację okna wylogowania.
     * @returns {object}
     */
    async getWinLogout() {
        return {
            id: 'win-logout',
            title: 'Wylogowywanie',
            icon: '⏻',
            statusText: 'Czy na pewno chcesz się wylogować?',
            controls: { minimize: false, maximize: false, close: true },
            size: { width: 400, height: 350 }
        };
    }

    /**
     * Zwraca zawartość okna wylogowania – pytanie z przyciskami Tak / Nie.
     * @returns {object}
     */
    async getContentWinLogout() {
        return {
            id: 'win-logout',
            cardId: 'card-1',
            title: '⏻ Wylogowywanie',
            text: `
                <div class="sys-form">
                    <p>Czy na pewno chcesz się wylogować?</p>
                    <div class="sys-form-row">
                        <button id="confirm-logout" class="sys-form-btn sys-form-btn--danger">Tak</button>
                        <button id="cancel-logout"  class="sys-form-btn">Nie</button>
                    </div>
                </div>
            `
        };
    }
}

export default CONFIG;
