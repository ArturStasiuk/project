
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
        return tascBar;
    }

    /**
     * Tworzy element ikony/menu do tascBar na podstawie przekazanej konfiguracji
     * @param {Object} config konfiguracja ikony/menu
     * @returns {HTMLElement}
     */
    async createTascBarIcon(config) {
        // Kontener ikony/menu
        const iconWrap = document.createElement('div');
        iconWrap.className = 'tascbar-icon';
        iconWrap.id = config.idIcon || '';
        iconWrap.style.display = 'flex';
        iconWrap.style.alignItems = 'center';
        iconWrap.style.justifyContent = 'center';
        iconWrap.style.cursor = 'pointer';
        iconWrap.style.margin = '0 4px';

        // Ikona lub tekst
        const iconSpan = document.createElement('span');
        iconSpan.style.display = 'inline-flex';
        iconSpan.style.alignItems = 'center';
        iconSpan.style.justifyContent = 'center';
        iconSpan.style.border = '1.5px solid rgba(0,0,0,0.13)';
        iconSpan.style.borderRadius = '50%';
        iconSpan.style.background = 'rgba(255,255,255,0.18)';
        iconSpan.style.padding = '0.15em';
        iconSpan.style.boxSizing = 'border-box';
        iconSpan.style.transition = 'box-shadow 0.2s, border-color 0.2s, background 0.2s';
        iconSpan.style.fontSize = '1em';
        iconSpan.style.width = '1.5em';
        iconSpan.style.height = '1.5em';
        iconSpan.textContent = config.icon || config.title || '';
        iconWrap.appendChild(iconSpan);

        // Tooltip/tekst obok ikony
        if (config.title) {
            const titleSpan = document.createElement('span');
            titleSpan.textContent = config.title;
            titleSpan.style.marginLeft = '0.5em';
            titleSpan.style.fontSize = '1em';
            titleSpan.style.userSelect = 'none';
            iconWrap.appendChild(titleSpan);
        }

        // Obsługa kliknięcia
        if (typeof config.onClick === 'function') {
            iconWrap.addEventListener('click', (e) => config.onClick(iconWrap, e));
        }

        // Obsługa menu rozwijanego
        if (Array.isArray(config.items) && config.items.length > 0) {
            // Proste menu rozwijane
            const menu = document.createElement('div');
            menu.style.position = 'absolute';
            menu.style.top = '100%';
            menu.style.left = '0';
            menu.style.background = 'white';
            menu.style.border = '1px solid #ccc';
            menu.style.borderRadius = '6px';
            menu.style.boxShadow = '0 4px 16px 0 rgba(0,0,0,0.13)';
            menu.style.padding = '4px 0';
            menu.style.display = 'none';
            menu.style.minWidth = '120px';
            menu.style.zIndex = '100';

            config.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.style.display = 'flex';
                itemEl.style.alignItems = 'center';
                itemEl.style.padding = '6px 12px';
                itemEl.style.cursor = 'pointer';
                itemEl.style.fontSize = '1em';
                itemEl.style.transition = 'background 0.2s';
                itemEl.addEventListener('mouseenter', () => itemEl.style.background = '#f0f0f0');
                itemEl.addEventListener('mouseleave', () => itemEl.style.background = 'transparent');
                if (item.icon) {
                    const itemIcon = document.createElement('span');
                    itemIcon.textContent = item.icon;
                    itemIcon.style.marginRight = '0.5em';
                    itemEl.appendChild(itemIcon);
                }
                const itemLabel = document.createElement('span');
                itemLabel.textContent = item.label;
                itemEl.appendChild(itemLabel);
                if (typeof item.onClick === 'function') {
                    itemEl.addEventListener('click', (e) => {
                        item.onClick(itemEl, e);
                        menu.style.display = 'none';
                    });
                }
                menu.appendChild(itemEl);
            });

            // Pokaz/ukryj menu po kliknięciu
            iconWrap.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });
            // Ukryj menu po kliknięciu poza
            document.addEventListener('click', () => {
                menu.style.display = 'none';
            });
            iconWrap.style.position = 'relative';
            iconWrap.appendChild(menu);
        }

        return iconWrap;
    }






}

export { Config as config };