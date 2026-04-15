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
        if (dat.loggedIn) {
            await this.loadPrivateTools();
        }
        await this.loadPublicTools();
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
            if (this._loadedScripts.has(path)) {
                console.log(`Moduł już załadowany, pomijam: ${path}`);
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.type = 'module';
            script.src = path;
            script.onload = () => {
                this._loadedScripts.add(path);
                console.log(`Załadowano moduł: ${path}`);
                resolve();
            };
            script.onerror = (e) => {
                console.error(`Błąd ładowania modułu: ${path}`, e);
                reject(e);
            };
            document.head.appendChild(script);
        }));

        await Promise.allSettled(pending);
    }

    /**
     * Pobiera i ładuje publiczne narzędzia dostępne dla wszystkich użytkowników.
     */
    async loadPublicTools() {
        const tools = await this.api.send({ method: 'getPublicTools' });
        await this._loadToolScripts(tools);
    }

    /**
     * Pobiera i ładuje prywatne narzędzia dostępne tylko dla zalogowanych użytkowników.
     */
    async loadPrivateTools() {
        console.log('Ładowanie modułów prywatnych...');
        const tools = await this.api.send({ method: 'getPrivateTools' });
        await this._loadToolScripts(tools);
    }
}

const sys = new SYS();
// window.sys = sys; // Umożliwia dostęp do obiektu SYS z konsoli przeglądarki
export default sys;
