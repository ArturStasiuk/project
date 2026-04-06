

class NOTEPAD {
        // Dekonstruktor: usuwa instancję i powiązane elementy/skrypty
    async deinit() {
        console.log('Moduł TEST został zdezaktywowany i wyczyszczony.');
            // Usuń pozycję z menu startowego
            await window._view.removeStartMenuItem({ id: 'sm-notepad' });

            // Zamknij okno modułu, jeśli istnieje
            try {
                await window._view.close({ id: 'win-notepad' });
            } catch (e) { console.warn('Nie można zamknąć okna modułu TEST:', e); }

            // Usuń ikonę pulpitu, jeśli była dodana
            try {
                await window._view.removeIcon({ id: 'di-notepad' });
            } catch (e) { console.warn('Nie można usunąć ikony modułu TEST:', e); }

            console.log('Moduł TEST został zdezaktywowany i wyczyszczony.');
        }
    nameModule;

    constructor() {
        this.nameModule = 'NOTEPAD';

        this.init(); 
    }
    // tu nalezy dodac np ikone i nazwe do menu startowego, a po kliknieciu w ikone ma sie otwierac okno z zawartoscia tego modulu
    async init() {
        console.log(`Inicjalizacja modułu ${this.nameModule}...`);
        // Dodanie pozycji do menu startowego
        await window._view.addStartMenuItem({
            id: 'sm-notepad',
            icon: '📝',
            label: 'Notatnik',
            disabled: false,
            onClick: async () => {
                await window._view.create({
                    id: 'win-notepad',
                    title: 'Notatnik',
                    icon: '📝',
                    statusText: 'Nowy dokument',
                });
            }
        });
     
    }
    
    


}
const notepad = new NOTEPAD();
// Zarejestruj instancję modułu w globalnym rejestrze, aby sys mógł wywołać init()/deinit()
window._moduleRegistry = window._moduleRegistry || {};
window._moduleRegistry['notepad'] = notepad;
export default notepad;