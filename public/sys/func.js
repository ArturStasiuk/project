
class FUN {
    constructor(parent) {
        this.parent = parent;

        // Zbiór nazw modułów, których skrypty zostały już wstrzyknięte do DOM
        this._loadedModules = new Set();

        this.init();
    }
    async init() {
        //  console.log('Inicjalizacja funkcji...');
        
    }

    async showMenuStart() {
        
        
        await this.parent.view.refreshStartMenu(await this.parent.con.getMenuStart());

        
    }

   async showWinLogin() {
       await this.parent.view.create(await this.parent.con.getWinLogin());
       await this.parent.view.addCard(await this.parent.con.getContentWinLogin()); 
       setTimeout(() => {
              const btn = document.getElementById('login-button');
           if (btn) {
                  const emailInput = document.getElementById('login-email');
                  const passwordInput = document.getElementById('login-password');
                  btn.onclick = null;
               btn.onclick = async () => { await this.logIn(emailInput.value, passwordInput.value); }; 
              }
       }, 10);
    }
   async closeWinLogin() {
        await this.parent.view.close({ id: 'win-login' });
    }
    async showWinLogout() {
        await this.parent.view.create(await this.parent.con.getWinLogout());
        await this.parent.view.addCard(await this.parent.con.getContentWinLogout());
        setTimeout(() => {
            const btn = document.getElementById('cancel-logout');
            const btnLogout = document.getElementById('confirm-logout');
            if (btnLogout) {
                btnLogout.onclick = null;
                btnLogout.onclick = async () => { 
                 await this.logOut();
                }
            }
            if (btn) {
                btn.onclick = null;
                btn.onclick = async () => { await this.closeWinLogout(); };
            }
        }, 10);
    }
    async closeWinLogout() {
        await this.parent.view.close({ id: 'win-logout' });
    }
  
    // funkcja logujaca użytkownika, wysyła dane do API, a następnie odświeża system
    async logIn(email, password) {
        await this.closeWinLogin();
        await this.parent.api.send({ modules: 'user', method: 'loginUsers', param: { email: email, password: password } });
        await this.parent.init(); // Odświeżenie systemu po zalogowaniu
    }
    // funkcja wylogowująca użytkownika, wysyła żądanie do API, a następnie odświeża system
    async logOut() {
        await this.closeWinLogout();
        await this.parent.api.send({ modules: 'user', method: 'logoutUsers' });
        await this.parent.restart(); // Odświeżenie systemu po wylogowaniu
    }





}
export default FUN;