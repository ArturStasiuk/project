import modal from '../view/modal.js';
import view from '../view/app.js';
import api from '../../api/api.js';
import CONFIG from './conf.js';
import FUN from './func.js';

class SYS {
    constructor() {
        this.modal = modal;
        this.api = api;
        this.view = view;

        this.con = new CONFIG(this);
        this.fun = new FUN(this);

        /** Zbiór ścieżek skryptów narzędzi, które zostały już wstrzyknięte do DOM */
        this._loadedScripts = new Set();

        this.init();
    }

    /**
     * Inicjalizacja systemu: sprawdza sesję użytkownika, renderuje menu startowe
     * i ładuje narzędzia publiczne (oraz prywatne gdy użytkownik jest zalogowany).
     */
    async init() {
        console.log('Inicjalizacja systemu...');
        const dat = await this.api.send({ method: 'checkLoggedIn' });
        // ladowanie menu startowego zależnie od stanu logowania
        await this.fun.showMenuStart(dat.loggedIn);
       // ladowanie tools 
        await this.loadAllTools(dat.loggedIn);
    }

    /**
     * Przeładowuje całą aplikację (powrót do strony startowej).
     */
    async restart() {
        window.location.href = 'index.php';
    }

    /**
     * Ładuje moduły narzędzi z podanej listy ścieżek.
     * Każdy skrypt jest ładowany tylko raz (deduplication przez _loadedScripts).
     * @param {string[]} paths – tablica ścieżek do skryptów ES module
     */
    async _loadToolScripts(paths) {
        if (!Array.isArray(paths)) return;

        const pending = paths.map(path => new Promise((resolve, reject) => {
            let finalPath = path;
            if (this._loadedScripts.has(finalPath)) {
                console.log(`Moduł już załadowany, pomijam: ${finalPath}`);
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.type = 'module';
            // Jeśli ścieżka zaczyna się od 'api/service/tools_loader.php', ustaw src bezwzględnie
            if (finalPath.startsWith('api/service/tools_loader.php')) {
                script.src = '/' + finalPath;
            } else {
                script.src = finalPath;
            }
            script.onload = () => {
                this._loadedScripts.add(finalPath);
                resolve();
            };
            script.onerror = (e) => {
                alert(`Błąd ładowania modułu: ${finalPath}`, e);
                reject(e);
            };
            document.head.appendChild(script);
        }));

        await Promise.allSettled(pending);
    }

    /**
     * Pobiera i ładuje wszystkie narzędzia (publiczne i prywatne, jeśli zalogowany)
     */
    async loadAllTools(includePrivate = false) {
        const tools = await this.api.send({ method: 'getAllTools', includePrivate });
        await this._loadToolScripts(tools);
    }
}

const sys = new SYS();
// window.sys = sys; // Umożliwia dostęp do obiektu SYS z konsoli przeglądarki
export default sys;
