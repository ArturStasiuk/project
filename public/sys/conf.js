class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.init();
    }
    init() {
        console.log('Inicjalizacja konfiguracji...');
    }
    
    async getMenuStart() { 
        return[
            {
                id: 'sm-notes', icon: '📝', label: 'Notatnik', onClick: () => { }
            },
            {
                id: 'sm-calc', icon: '🧮', label: 'Kalkulator', onClick: () => { }
            },
            'separator',
            {
                id: 'sm-settings', icon: '⚙️', label: 'Ustawienia', disabled: true, onClick: () => { }
            },
            {
                id: 'sm-off', icon: '⏻', label: 'Wyloguj', disabled: false, onClick: () => { }
            }
        ];
    }







}
export default CONFIG;