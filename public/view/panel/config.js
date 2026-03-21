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
        this.positionTascBar = 'bottom'; // Możliwe wartości: 'top', 'bottom', 'left', 'right'


    }

    
    async configPanel() {
        const panel = document.createElement('div');
        panel.className = this.classNamePanel;
        panel.id = this.idPanel;
        // Dynamiczne dopasowanie rozmiaru
        panel.style.position = 'fixed';
        panel.style.top = '0';
        panel.style.left = '0';
        panel.style.width = window.innerWidth + 'px';
        panel.style.height = window.innerHeight + 'px';
        panel.style.boxSizing = 'border-box';

        // Dodanie tapety, jeśli istnieje
        let wallpaperImg = null;
        if (this.wallpapers && this.wallpapers.length > 0 && this.wallpapers[0]) {
            wallpaperImg = document.createElement('img');
            wallpaperImg.src = this.wallpapers[0];
            wallpaperImg.alt = 'wallpaper';
            wallpaperImg.style.position = 'absolute';
            wallpaperImg.style.top = '0';
            wallpaperImg.style.left = '0';
            wallpaperImg.style.width = '100%';
            wallpaperImg.style.height = '100%';
            wallpaperImg.style.objectFit = 'cover';
            wallpaperImg.style.zIndex = '0';
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
        tascBar.style.position = 'absolute';
        if (this.positionTascBar === 'top') {
            tascBar.style.top = '0';
            tascBar.style.left = '0';
            tascBar.style.width = '100%';
            tascBar.style.height = '48px';
            tascBar.style.flexDirection = 'row';
        } else if (this.positionTascBar === 'bottom') {
            tascBar.style.bottom = '0';
            tascBar.style.left = '0';
            tascBar.style.width = '100%';
            tascBar.style.height = '48px';
            tascBar.style.flexDirection = 'row';
        } else if (this.positionTascBar === 'left') {
            tascBar.style.top = '0';
            tascBar.style.left = '0';
            tascBar.style.width = '48px';
            tascBar.style.height = '100%';
            tascBar.style.flexDirection = 'column';
        } else if (this.positionTascBar === 'right') {
            tascBar.style.top = '0';
            tascBar.style.right = '0';
            tascBar.style.width = '48px';
            tascBar.style.height = '100%';
            tascBar.style.flexDirection = 'column';
        }
        tascBar.style.display = 'flex';
        tascBar.style.alignItems = 'center';
        tascBar.style.justifyContent = 'center';
        tascBar.style.background = 'rgba(255,255,255,0.7)';
        tascBar.style.zIndex = '10';

        // Dodanie testowej ikony (emoji)
        const icon = document.createElement('span');
        icon.textContent = '📦';
        icon.style.fontSize = '2rem';
        icon.style.cursor = 'pointer';
        tascBar.appendChild(icon);

        return tascBar;
    }








}

export { Config as config };