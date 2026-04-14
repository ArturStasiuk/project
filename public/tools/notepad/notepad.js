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
    async openFile() {
        // Sprawdzenie czy w localStorage jest katalog art-com/projekt/notepad-files
        if (!await this.func.checkDirectoryLocalStorage()) {
            await this.modal.alert('Nie można otworzyć pliku, ponieważ katalog "notepad-files" nie istnieje w localStorage. Utwórz katalog i dodaj pliki, aby móc je otworzyć.');
            return;
        }
        const files = await this.func.loadLocalStorageFile();
        console.log('Dostępne pliki .txt w katalogu "notepad-files":', files);
        
    }

    async saveFile() { 
      // Sprawdzenie czy w localStorage jest katalog art-com/projekt/notepad-files
        if (!await this.func.checkDirectoryLocalStorage()) {
            await this.modal.confirm('Nie można zapisać pliku, ponieważ katalog "notepad-files" nie istnieje w localStorage. Czy chcesz go utworzyć?').then(async (result) => {
                if (result) {
                    localStorage.setItem(this.dirFilesLocalStorage, JSON.stringify({}));
                    await this.modal.alert('Katalog "notepad-files" został utworzony. Teraz możesz zapisać plik.');
                    // tu kod do zapisania pliku po utwozeniu katalogu 
                } else {
                    await this.modal.alert('Nie można zapisać pliku bez katalogu "notepad-files".');
                }
            });
            return;
        }   
    }



}

const notepad = new NOTEPAD();
export default notepad;
