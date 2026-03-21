
class configPanel{
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
        this.wallpapers=['./view/css/wallpapers/wallpapers1.jpg'];


        // Unikalne klasy i ID dla panelu 
        
        this.nameClass = 'panel';
        this.Id = 'id_panel';
    }

    async configPanel() {
        const panel = document.createElement('div');
        panel.className = this.nameClass;
        panel.id = this.Id;
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

        const p = document.createElement('p');
        //  p.textContent = 'Panel konfiguracji';
        p.style.position = 'relative';
        p.style.zIndex = '1';
        panel.appendChild(p);
        return panel;
    }
    // wyswietlenie panelu 
    async showPanel() {
        let panel = document.getElementById(this.Id);
        if (panel) {
            panel.style.display = 'block';
        } else {
            document.body.appendChild(await this.configPanel());
        }
    }

    // wylaczanie panelu 
    async hidePanel() {
        const panel = document.getElementById(this.Id);
        if (panel) {
            panel.remove();
        }
    }






    


}

export { configPanel };