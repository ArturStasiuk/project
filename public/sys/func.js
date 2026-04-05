
class FUN {
    constructor(parent) {
        this.parent = parent;

        // Zbiór nazw modułów, których skrypty zostały już wstrzyknięte do DOM
        this._loadedModules = new Set();

        this.init();
    }
    init() {
      //  console.log('Inicjalizacja funkcji...');
    }

    async showMenuStart() {
        
        
        await this.parent.view.refreshStartMenu(await this.parent.con.getMenuStart());
       // await this.getModules();
        
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
    
    // Wczytuje moduły z serwera i aktywuje je.
    // Przy pierwszym logowaniu wstrzykuje skrypt modułu do DOM.
    // Przy ponownym logowaniu (moduł już w rejestrze) wywołuje bezpośrednio init(),
    // ponieważ przeglądarka cachuje moduły ES i nie wykonałaby skryptu ponownie.
    async getModules() {
        const modules = await this.parent.api.crud({ function: 'getInfoModules' });
        if (modules && modules.status && Array.isArray(modules.jsFiles)) {
            for (const jsFile of modules.jsFiles) {
                const moduleName = jsFile.split('/').pop().replace('.js', '');

                if (this._loadedModules.has(moduleName)) {
                    // Moduł był już załadowany – wywołaj init() bezpośrednio przez rejestr
                    const mod = window._moduleRegistry?.[moduleName];
                    if (mod && typeof mod.init === 'function') {
                        await mod.init();
                        console.log(`Moduł ${moduleName}: ponowna inicjalizacja (init).`);
                    }
                } else {
                    // Pierwsze ładowanie – wstrzyknij skrypt modułu do DOM
                    const script = document.createElement('script');
                    script.type = 'module';
                    script.src = jsFile;
                    // Atrybut data-module-name umożliwia późniejsze odnalezienie i usunięcie skryptu
                    script.dataset.moduleName = moduleName;
                    document.body.appendChild(script);
                    this._loadedModules.add(moduleName);
                    console.log(`Moduł ${moduleName}: skrypt załadowany.`);
                }
            }
        }
    }

    // Dezaktywuje wszystkie aktywne moduły:
    // 1. Wywołuje deinit() każdego modułu zarejestrowanego w window._moduleRegistry.
    // 2. Usuwa tagi <script> modułów z DOM (porządek; faktyczne wyładowanie
    //    modułów ES zależy od przeglądarki – init() będzie wywoływane przez rejestr).
    // 3. Czyści rejestr modułów.
    async deinitModules() {
        const registry = window._moduleRegistry || {};

        for (const [moduleName, mod] of Object.entries(registry)) {
            try {
                if (typeof mod.deinit === 'function') {
                    await mod.deinit();
                    console.log(`Moduł ${moduleName} został zdezaktywowany.`);
                }
            } catch (e) {
                console.error(`Błąd podczas dezaktywacji modułu ${moduleName}:`, e);
            }
        }

        // Usuń tagi <script> wstrzyknięte przez getModules()
        document.querySelectorAll('script[data-module-name]').forEach(s => s.remove());

        // Wyczyść rejestr – moduły zostaną ponownie zarejestrowane przy następnym logowaniu
        window._moduleRegistry = {};
    }




}
export default FUN;