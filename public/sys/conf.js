class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.init();
    }
    init() {
        console.log('Inicjalizacja konfiguracji...');
    }
    
    async getMenuStart() { 
        return[
            {
                id: 'sm-notes', icon: '📝', label: 'Notatnik', onClick: () => { }
            },
            {
                id: 'sm-calc', icon: '🧮', label: 'Kalkulator', onClick: () => { }
            },
            'separator',
            {
                id: 'sm-settings', icon: '⚙️', label: 'Ustawienia', disabled: true, onClick: () => { }
            },
            {
                id: 'sm-off', icon: '⏻', label: 'Wyloguj', disabled: false, onClick: () => { }
            }
        ];
    }

    async getIconsPulpit() {
        return [{
            id: 'di-folder',
            icon: '📁', label: 'Moje pliki',
            menuItems: [
                { icon: '📄', label: 'Dokument.txt', onClick: () => alert('Otwórz plik') },
                { icon: '📊', label: 'Arkusz.xlsx', onClick: () => alert('Otwórz arkusz') },
                'separator',
                { icon: '📂', label: 'Otwórz folder', onClick: () => alert('Otwórz folder') }
            ]
        }];
    }
    
    async getWinLogin() {
        return { id: 'win-login', title: 'Logowanie', icon: '🔐', statusText: 'Podaj login i hasło', controls: { minimize: true, maximize: false, close: false }, size: { width: 400, height: 440 } };
    }
    async getContentWinLogin() { 
            return {
                id: 'win-login',
                cardId: 'card-1',
                title: '🔐 Logowanie',
                text: `
                    <form id="login-form" style="display: flex; flex-direction: column; gap: 1em; min-width: 220px;">
                        <label for="login-username">Login</label>
                        <input id="login-username" name="username" type="text" placeholder="Wpisz login" autocomplete="username" required style="padding: 0.5em; border-radius: 4px; border: 1px solid #ccc;">
                        <label for="login-password">Hasło</label>
                        <input id="login-password" name="password" type="password" placeholder="Wpisz hasło" autocomplete="current-password" required style="padding: 0.5em; border-radius: 4px; border: 1px solid #ccc;">
                        <button type="submit" style="padding: 0.5em; border-radius: 4px; background: #1976d2; color: #fff; border: none; cursor: pointer;">Zaloguj się</button>
                    </form>
                `
            };
    }

    async getWinLogut() {
        return { id: 'win-logout', title: 'Wylogowywanie', icon: '⏻', statusText: 'Czy na pewno chcesz się wylogować?', controls: { minimize: false, maximize: false, close: true }, size: { width: 400, height: 350 } };
    }
    async getContentWinLogout() {
        return {
            id: 'win-logout',
            cardId: 'card-1',
            title: '⏻ Wylogowywanie',
            text: `
                <div style="display: flex; flex-direction: column; gap: 1em; align-items: center;">
                    <p>Czy na pewno chcesz się wylogować?</p>
                    <div style="display: flex; gap: 1em;">
                        <button id="confirm-logout" style="padding: 0.5em; border-radius: 4px; background: #d32f2f; color: #fff; border: none; cursor: pointer;">Tak</button>
                        <button id="cancel-logout" style="padding: 0.5em; border-radius: 4px; background: #1976d2; color: #fff; border: none; cursor: pointer;">Nie</button>
                    </div>
                </div>
            `
        };
    }

}
export default CONFIG;