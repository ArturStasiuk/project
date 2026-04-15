import CONFIG   from './config.js';
import FUNCTION from './function.js';
import view from '../../view/app.js';
import modal from '../../view/modal.js';
// ladowanie styli CSS dla notatnika
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './tools/notepad/notepad.css';
document.head.appendChild(link);

/**
 * NOTEPAD – prosty notatnik tekstowy.
 *
 * Narzędzie rejestruje się w menu startowym i po kliknięciu otwiera
 * okno z edytorem tekstowym. Jest ładowane dynamicznie przez SYS.

 */
class NOTEPAD {
    constructor() {
        this.dirFilesLocalStorage = 'art-com/projekt/notepad-files';
        this.modal = modal;
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
    /**    await this.modal.alert('Notatnik został zainicjalizowany!');
     await this.modal.confirm('Czy chcesz otworzyć notatnik?').then((result) => {
            if (result) {
                console.log('Użytkownik chce otworzyć notatnik.');
            } else {
                console.log('Użytkownik nie chce otworzyć notatnika.');
            }

       });
       await this.modal.loading();
        */




    }




}

const notepad = new NOTEPAD();
export default notepad;
