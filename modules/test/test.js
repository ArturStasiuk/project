

class TEST {
        // Dekonstruktor: usuwa instancję i powiązane elementy/skrypty
    async deinit() {
        console.log('Moduł TEST został zdezaktywowany i wyczyszczony.');
            // Usuń pozycję z menu startowego
            await window._view.removeStartMenuItem({ id: 'sm-off' });

            // Zamknij okno modułu, jeśli istnieje
            try {
                await window._view.close({ id: 'win-test' });
            } catch (e) { console.warn('Nie można zamknąć okna modułu TEST:', e); }

            // Usuń ikonę pulpitu, jeśli była dodana
            try {
                await window._view.removeIcon({ id: 'di-test' });
            } catch (e) { console.warn('Nie można usunąć ikony modułu TEST:', e); }

            console.log('Moduł TEST został zdezaktywowany i wyczyszczony.');
        }
    nameModule;

    constructor() {
        this.nameModule = 'TEST';

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
// Zarejestruj instancję modułu w globalnym rejestrze, aby sys mógł wywołać init()/deinit()
window._moduleRegistry = window._moduleRegistry || {};
window._moduleRegistry['test'] = test;
export default test;