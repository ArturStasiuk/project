
//import api from '../../api/api.js';
class TEST {
        // Dekonstruktor: usuwa instancję i powiązane elementy/skrypty
    async deinit() {
        console.log('Moduł TEST został zdezaktywowany i wyczyszczony.');
            // Usuń pozycję z menu startowego
            await window._view.removeStartMenuItem({ id: 'sm-off' });

            // Zamknij okno modułu, jeśli istnieje
            if (this.window._view.close) {
                try {
                    await this.window._view.close({ id: 'win-test' });
                } catch (e) {}
            }

            // Usuń ikonę pulpitu, jeśli była dodana
            if (this.window._view.removeIcon) {
                try {
                    await this.window._view.removeIcon({ id: 'di-test' });
                } catch (e) {}
            }

            // (Opcjonalnie) Usuń inne powiązane elementy/skrypty, jeśli były dynamicznie dodane
            // ...
            console.log('Moduł TEST został zdezaktywowany i wyczyszczony.');
        }
    nameModule;

    constructor() {
        this.nameModule = 'TEST';
      //  this.init();
        console.log(`Inicjalizacja modułu ${this.nameModule}...`);
        // Dodanie pozycji do menu startowego
        this.init(); 
    }
    // tu nalezy dodac np ikone i nazwe do menu startowego, a po kliknieciu w ikone ma sie otwierac okno z zawartoscia tego modulu
    async init() {
        console.log(`Inicjalizacja modułu ${this.nameModule}...`);
        // Dodanie pozycji do menu startowego

        await window._view.addStartMenuItem({
            
            id: 'sm-off',
            icon: '⏻',
            label: 'Wyłącz',
            disabled: false
        });
     
    }
    
    
  



}
const test = new TEST();
export default test;