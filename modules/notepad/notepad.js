import CONFIG from './config.js';
import FUNCTION from './function.js';

class NOTEPAD {
        // Dekonstruktor: usuwa instancję i powiązane elementy/skrypty
    async deinit() {
        console.log('Moduł TEST został zdezaktywowany i wyczyszczony.');
            // Usuń pozycję z menu startowego
            await window._view.removeStartMenuItem({ id: 'sm-notepad' });

            // Zamknij okno modułu, jeśli istnieje
            try {
                await window._view.close({ id: 'win-notepad' });
            } catch (e) { console.warn('Nie można zamknąć okna modułu NOTEPAD:', e); }

            // Usuń ikonę pulpitu, jeśli była dodana
            try {
                await window._view.removeIcon({ id: 'di-notepad' });
            } catch (e) { console.warn('Nie można usunąć ikony modułu NOTEPAD:', e); }

            console.log('Moduł NOTEPAD został zdezaktywowany i wyczyszczony.');
        }
    nameModule;

    constructor() {
     this.conf = new CONFIG(this); 
       this.func = new FUNCTION(this);

        this.init(); 
    }
    // tu nalezy dodcac np ikone i nazwe do menu startowego, a po kliknieciu w ikone ma sie otwierac okno z zawartoscia tego modulu
    async init() {
        console.log(`NOTEPAD: init() called`);
        // Dodanie pozycji do menu startowego
      await this.func.addStartMenuItem();
     
    }
    
    
    


}
const notepad = new NOTEPAD();
// Zarejestruj instancję modułu w globalnym rejestrze, aby sys mógł wywołać init()/deinit()
window._moduleRegistry = window._moduleRegistry || {};
window._moduleRegistry['notepad'] = notepad;
export default notepad;