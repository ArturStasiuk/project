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

    async getIconsPulpit() {
        return[('di-folder', {
            icon: '📁', label: 'Moje pliki',
            menuItems: [
                { icon: '📄', label: 'Dokument.txt', onClick: () => alert('Otwórz plik') },
                { icon: '📊', label: 'Arkusz.xlsx', onClick: () => alert('Otwórz arkusz') },
                'separator',
                { icon: '📂', label: 'Otwórz folder', onClick: () => alert('Otwórz folder') }
            ]
        })];
    }






}
export default CONFIG;