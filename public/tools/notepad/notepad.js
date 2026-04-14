import CONFIG   from './config.js';
import FUNCTION from './function.js';
import view     from '../../view/app.js';

/**
 * NOTEPAD – prosty notatnik tekstowy.
 *
 * Narzędzie rejestruje się w menu startowym i po kliknięciu otwiera
 * okno z edytorem tekstowym. Jest ładowane dynamicznie przez SYS.
 *
 * Dodanie nowego narzędzia: wzoruj się na tej klasie – utwórz katalog
 * w public/tools/, zdefiniuj config.js, function.js i główny plik modułu.
 */
class NOTEPAD {
    constructor() {
        this.view = view;
        this.conf = new CONFIG(this);
        this.func = new FUNCTION(this);
        this.init();
    }

    /**
     * Inicjalizacja narzędzia: dodaje pozycję w menu startowym.
     * Wywoływana automatycznie po załadowaniu skryptu.
     */
    async init() {
        console.log('NOTEPAD: init()');
        await this.func.addStartMenuItem();
    }
}

const notepad = new NOTEPAD();
export default notepad;
