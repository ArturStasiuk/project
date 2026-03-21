class Config {
    constructor(parent) {
        this.parent = parent; // Przechowywanie referencji do rodzica, jeśli jest potrzebna
        /** Inicjalizacja panelu konfiguracji */
        if (!document.getElementById('panel-css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './view/css/panel.css';
            link.id = 'panel-css';
            document.head.appendChild(link);
        }
        // sciezka do tapety panelu
        this.wallpapers = ['./view/css/wallpapers/wallpapers1.jpg'];


        // Unikalne klasy i ID dla panelu 
        this.classNamePanel = 'panel';
        this.idPanel = 'id_panel';

        // Unikelne klasy i ID dla tascBar
        this.classNameTascBar = 'tascBar';
        this.idTascBar = 'idTascBar'
        this.positionTascBar = 'top'; // Możliwe wartości: 'top', 'bottom', 'left', 'right'


    }

    
    async configPanel() {
        const panel = document.createElement('div');
        panel.className = this.classNamePanel;
        panel.id = this.idPanel;

        // Dodanie tapety, jeśli istnieje
        let wallpaperImg = null;
        if (this.wallpapers && this.wallpapers.length > 0 && this.wallpapers[0]) {
            wallpaperImg = document.createElement('img');
            wallpaperImg.src = this.wallpapers[0];
            wallpaperImg.alt = 'wallpaper';
            wallpaperImg.className = 'panel-wallpaper';
            panel.appendChild(wallpaperImg);
        }

        // Aktualizacja rozmiaru przy zmianie okna
        const resizeHandler = () => {
            panel.style.width = window.innerWidth + 'px';
            panel.style.height = window.innerHeight + 'px';
        };
        window.addEventListener('resize', resizeHandler);
        // Usuwanie nasłuchiwacza po usunięciu panelu
        panel.addEventListener('DOMNodeRemoved', function handler(e) {
            if (e.target === panel) {
                window.removeEventListener('resize', resizeHandler);
                panel.removeEventListener('DOMNodeRemoved', handler);
            }
        });

        return panel;
    }

    async configTascBar() {
        const tascBar = document.createElement('div');
        tascBar.className = this.classNameTascBar;
        tascBar.id = this.idTascBar;

        // Dopasowanie rozmiaru i pozycji
        tascBar.classList.add(`tascbar-${this.positionTascBar}`);
        // Dodanie testowej ikony (emoji)
        const icon = document.createElement('span');
        icon.textContent = '⬅️';
        icon.className = 'tascbar-icon';
        tascBar.appendChild(icon);
        return tascBar;
    }








}

export { Config as config };