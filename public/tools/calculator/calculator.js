import CONFIG   from './config.js';
import FUNCTION from './function.js';
import view from '../../view/app.js';
import modal from '../../view/modal.js';

// Ładowanie styli CSS dla kalkulatora
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './tools/calculator/calculator.css';
document.head.appendChild(link);

/**
 * CALCULATOR – prosty kalkulator arytmetyczny.
 *
 * Narzędzie rejestruje się w menu startowym i po kliknięciu otwiera
 * okno z kalkulatorem. Jest ładowane dynamicznie przez SYS.
 */
class CALCULATOR {
    constructor() {
        this.lang  = 'sv';
        this.modal = modal;
        this.view  = view;
        this.conf  = new CONFIG(this);
        this.func  = new FUNCTION(this);
        this.init();
    }

    /**
     * Inicjalizacja narzędzia: dodaje pozycję w menu startowym.
     * Wywoływana automatycznie po załadowaniu skryptu.
     */
    async init() {
        console.log('CALCULATOR: init()');
        await this.func.addStartMenuItem();
    }
}

const calculator = new CALCULATOR();
export default calculator;
