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

        this.lang = null; // Zainicjalizowane w init()

        this.con = new CONFIG(this);
        this.fun = new FUN(this);

        /** Zbiór ścieżek skryptów narzędzi, które zostały już wstrzyknięte do DOM */
        this._loadedScripts = new Set();

        this.init();
    }

    /**
     * Dynamicznie wstawia kod JS jako moduł do DOM przez Blob URL
     * @param {string} code - kod JS (ES module)
     */
    injectModuleCode(code) {
        const blob = new Blob([code], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const script = document.createElement('script');
        script.type = 'module';
        script.src = url;
        script.onload = () => {
            // Zwolnij URL po załadowaniu
            URL.revokeObjectURL(url);
        };
        script.onerror = (e) => {
            alert('Błąd ładowania kodu modułu przez Blob URL', e);
        };
        document.head.appendChild(script);
    }
    /**
     * Inicjalizacja systemu: sprawdza sesję użytkownika, renderuje menu startowe
     * i ładuje narzędzia publiczne (oraz prywatne gdy użytkownik jest zalogowany).
     */
    async init() {
        console.log('Inicjalizacja systemu...');
        const langResponse = await this.api.send({ method: "getUserLanguage" });
        this.lang = langResponse?.lang || 'English';
        // Przekazanie języka do wszystkich modułów
        if (typeof this.modal.setLang === 'function') this.modal.setLang(this.lang);
        if (typeof this.con.setLang === 'function') this.con.setLang(this.lang);
        if (typeof this.fun.setLang === 'function') this.fun.setLang(this.lang);
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
     * Prywatne narzędzia (prefiks 'private-tool://') są pobierane przez API
     * i wstrzykiwane jako skrypt przez Blob URL.
     * @param {string[]} paths – tablica ścieżek/identyfikatorów skryptów
     */
    async _loadToolScripts(paths) {
        if (!Array.isArray(paths)) return;
        const pending = paths.map(path => this._loadOneTool(path));
        await Promise.allSettled(pending);
    }

    /**
     * Ładuje jedno narzędzie. Prywatne – przez API i Blob URL; publiczne – bezpośrednio.
     * @param {string} finalPath
     */
    async _loadOneTool(finalPath) {
        if (this._loadedScripts.has(finalPath)) {
            console.log(`Moduł już załadowany, pomijam: ${finalPath}`);
            return;
        }

        if (finalPath.startsWith('private-tool://')) {
            await this._loadPrivateTool(finalPath);
        } else {
            //await this._loadPublicTool(finalPath);
        }
    }

    /**
     * Skanuje kod JS w poszukiwaniu względnych importów (np. './config.js'),
     * pobiera te pliki przez API, tworzy dla nich Blob URL i podmienia ścieżki
     * w kodzie źródłowym, aby działały w kontekście Blob URL.
     * Działa rekurencyjnie – zależności też mogą mieć własne zależności.
     * @param {string} toolName – nazwa narzędzia (katalog w private/tools/)
     * @param {string} content  – kod źródłowy JS
     * @param {Set<string>} [_visited] – wewnętrzny zbiór odwiedzonych plików (zapobiega cyklom)
     * @returns {Promise<string>} – zmodyfikowany kod z Blob URL zamiast ścieżek względnych
     */
    async _resolvePrivateImports(toolName, content, _visited = new Set()) {
        // Dopasowuje: from './plik.js'  oraz  import './plik.js'  (cudzysłów lub apostrof)
        // Regex celowo dopasowuje tylko './' – importy z '..' lub podkatalogów są odrzucane poniżej.
        const importRegex = /(?:from|import)\s+(['"])(\.\/[^'"]+)\1/g;
        const relativeImports = new Set();
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            relativeImports.add(match[2]);
        }

        if (relativeImports.size === 0) return content;

        const blobUrls = new Map();
        for (const importPath of relativeImports) {
            // Obsługujemy tylko proste importy z tego samego katalogu: './plik.js'
            if (!importPath.startsWith('./') || importPath.includes('..') || importPath.slice(2).includes('/')) {
                continue;
            }

            const fileName = importPath.slice(2); // usuń './'
            const cacheKey = `${toolName}/${fileName}`;

            if (_visited.has(cacheKey)) {
                console.warn(`Wykryto cykl importów, pomijam: ${cacheKey}`);
                continue;
            }
            _visited.add(cacheKey);

            try {
                const res = await this.api.send({ method: 'getPrivateToolFile', param: cacheKey });
                if (!res || !res.status || !res.content) {
                    console.error(`Błąd ładowania zależności: ${importPath}`, res);
                    continue;
                }
                // Rekurencyjnie rozwiąż zależności tej zależności
                const resolvedContent = await this._resolvePrivateImports(toolName, res.content, _visited);
                const depBlob = new Blob([resolvedContent], { type: 'application/javascript' });
                blobUrls.set(importPath, URL.createObjectURL(depBlob));
            } catch (e) {
                console.error(`Wyjątek podczas ładowania zależności: ${importPath}`, e);
            }
        }

        // Podmień ścieżki względne na Blob URL w kodzie źródłowym
        let patchedContent = content;
        for (const [importPath, blobUrl] of blobUrls) {
            // Escapujemy znaki specjalne regex w ścieżce importu
            const escaped = importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            patchedContent = patchedContent.replace(
                new RegExp(`(['"])${escaped}\\1`, 'g'),
                `'${blobUrl}'`
            );
        }

        return patchedContent;
    }

    /**
     * Pobiera treść JS prywatnego narzędzia przez API i wstrzykuje jako Blob URL.
     * @param {string} finalPath – identyfikator w formacie 'private-tool://NAME'
     */
    async _loadPrivateTool(finalPath) {
        const toolName = finalPath.substring('private-tool://'.length);
        let result;
        try {
            result = await this.api.send({ method: 'getPrivateToolContent', param: toolName });
        } catch (e) {
            console.error(`Wyjątek podczas pobierania prywatnego narzędzia: ${toolName}`, e);
            return;
        }

        if (!result || !result.status || !result.content) {
            console.error(`Błąd ładowania prywatnego narzędzia: ${toolName}`, result);
            return;
        }

        // Zastąp względne importy Blob URL, aby działały w kontekście Blob URL
        const resolvedContent = await this._resolvePrivateImports(toolName, result.content);
        const blob = new Blob([resolvedContent], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);

        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = blobUrl;
            script.onload = () => {
                this._loadedScripts.add(finalPath);
                // Dla <script type="module"> zdarzenie onload odpala się dopiero po
                // załadowaniu i wykonaniu całego grafu importów, więc Blob URL można
                // bezpiecznie zwolnić w następnym cyklu pętli zdarzeń.
                setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
                resolve();
            };
            script.onerror = (e) => {
                URL.revokeObjectURL(blobUrl);
                console.error(`Błąd wykonania prywatnego narzędzia: ${toolName}`, e);
                reject(e);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Ładuje publiczne narzędzie jako skrypt ES module.
     * @param {string} finalPath – ścieżka do pliku JS
     */
    _loadPublicTool(finalPath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = finalPath;
            script.onload = () => {
                this._loadedScripts.add(finalPath);
                resolve();
            };
            script.onerror = (e) => {
                alert(`Błąd ładowania modułu: ${finalPath}`, e);
                reject(e);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Pobiera i ładuje wszystkie narzędzia (publiczne i prywatne, jeśli zalogowany)
     */
    async loadAllTools(includePrivate = false) {
        const tools = await this.api.send({ method: 'getAllTools', param: includePrivate });
        await this._loadToolScripts(tools);
    }
}

const sys = new SYS();

export default sys;
