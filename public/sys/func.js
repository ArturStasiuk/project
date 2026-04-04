
class FUN {
    constructor(parent) {
        this.parent = parent;

        this.init();
    }
    init() {
        console.log('Inicjalizacja funkcji...');
    }

    async showMenuStart() {
        await this.parent.view.refreshStartMenu(await this.parent.con.getMenuStart() );
    
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
                  btn.onclick = async () => { await this.parent.logIn(emailInput.value, passwordInput.value); };
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
                 await this.parent.logOut();
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
    
    // pobranie nazw modulow i dodanie do skryptu 
    async showModules() {
        const modules = await this.parent.api.crud({ function: 'getInfoModules' });
        if (modules && modules.status && Array.isArray(modules.jsFiles)) {
            modules.jsFiles.forEach(jsFile => {
                const script = document.createElement('script');
                script.type = 'module';
                script.src = jsFile;
                document.body.appendChild(script);
            });
        }
    }





}
export default FUN;