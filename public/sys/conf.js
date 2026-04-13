class CONFIG {
    constructor(parent) {
          this.parent = parent;


        this.init();
    }
    init() {
        console.log('Inicjalizacja konfiguracji...');
    }
   
    // Menu startowe - dynamiczne w zależności od stanu połączenia i logowania
    async getMenuStart() {

       

    
            return {
                items: [
                  
                        {
                        id: 'sm-login', icon: '🔒', label: 'Zaloguj', onClick: async () => await this.parent.fun.showWinLogin()
                        }
                       
                ]
            };


 
    }


    // Okno logowania - dynamiczne w zależności od stanu połączenia i logowania
    async getWinLogin() {
        return { id: 'win-login', title: 'Logowanie', icon: '🔐', statusText: 'Podaj login i hasło', controls: { minimize: true, maximize: false, close: true }, size: { width: 400, height: 440 } };
    }
    // Zawartość okna logowania - dynamiczna w zależności od stanu połączenia i logowania
    async getContentWinLogin() { 
            return {
                id: 'win-login',
                cardId: 'card-1',
                title: '🔐 Logowanie',
                text: `
                    <form id="login-form" style="display: flex; flex-direction: column; gap: 1em; min-width: 220px;">
                        <label for="login-email">Email</label>
                        <input id="login-email" name="email" type="email" placeholder="Wpisz email" autocomplete="email" required style="padding: 0.5em; border-radius: 4px; border: 1px solid #ccc;">
                        <label for="login-password">Hasło</label>
                        <input id="login-password" name="password" type="password" placeholder="Wpisz hasło" autocomplete="current-password" required style="padding: 0.5em; border-radius: 4px; border: 1px solid #ccc;">
                        <button type="button" id="login-button" style="padding: 0.5em; border-radius: 4px; background: #1976d2; color: #fff; border: none; cursor: pointer;">Zaloguj się</button>
                    </form>
                `
            };
    }
    
    // Okno wylogowywania - dynamiczne w zależności od stanu połączenia i logowania
    async getWinLogout() {
        return { id: 'win-logout', title: 'Wylogowywanie', icon: '⏻', statusText: 'Czy na pewno chcesz się wylogować?', controls: { minimize: false, maximize: false, close: true }, size: { width: 400, height: 350 } };
    }
    // Zawartość okna wylogowywania - dynamiczna w zależności od stanu połączenia i logowania
    async getContentWinLogout() {
        return {
            id: 'win-logout',
            cardId: 'card-1',
            title: '⏻ Wylogowywanie',
            text: `
                <div style="display: flex; flex-direction: column; gap: 1em; align-items: center;">
                    <p>Czy na pewno chcesz się wylogować?</p>
                    <div style="display: flex; gap: 1em; width: 100%;">
                        <button id="confirm-logout" style="flex:1; padding: 0.5em; border-radius: 4px; background: #d32f2f; color: #fff; border: none; cursor: pointer;">Tak</button>
                        <button id="cancel-logout" style="flex:1; padding: 0.5em; border-radius: 4px; background: #1976d2; color: #fff; border: none; cursor: pointer;">Nie</button>
                    </div>
                </div>
            `
        };
    }

}
export default CONFIG;