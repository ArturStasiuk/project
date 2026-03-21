
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
        this.positionTascBar = 'left'; // Możliwe wartości: 'top', 'bottom', 'left', 'right'


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

        // Tryb zwijania/rozwijania dla left/right
        if (this.positionTascBar === 'left' || this.positionTascBar === 'right') {
            tascBar.classList.add('tascbar-collapsed');
            tascBar.addEventListener('mouseenter', () => {
                tascBar.classList.remove('tascbar-collapsed');
                tascBar.classList.add('tascbar-expanded');
            });
            tascBar.addEventListener('mouseleave', () => {
                tascBar.classList.remove('tascbar-expanded');
                tascBar.classList.add('tascbar-collapsed');
            });
        }
        return tascBar;
    }

    /**
     * Tworzy element ikony/menu do tascBar na podstawie przekazanej konfiguracji
     * @param {Object} config konfiguracja ikony/menu
     * @returns {HTMLElement}
     */
    createTascBarIcon(config) {
        // Kontener ikony/menu
        const iconWrap = document.createElement('div');
        iconWrap.className = 'tascbar-icon' + (config.classIconWrap ? ' ' + config.classIconWrap : '');
        iconWrap.id = config.idIcon || '';

        // Ikona lub tekst
        const iconSpan = document.createElement('span');
        iconSpan.className = 'tascbar-icon-emoji' + (config.classIcon ? ' ' + config.classIcon : '');
        iconSpan.textContent = config.icon || config.title || '';
        iconWrap.appendChild(iconSpan);

        // Tooltip/tekst obok ikony
        if (config.title) {
            const titleSpan = document.createElement('span');
            titleSpan.className = 'tascbar-icon-title' + (config.classTitle ? ' ' + config.classTitle : '');
            titleSpan.textContent = config.title;
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
            menu.className = 'tascbar-menu' + (config.classMenu ? ' ' + config.classMenu : '');
            menu.style.display = 'none';

            // Ustal pozycję menu w zależności od położenia taskbara
            let tascBarPosition = this.positionTascBar || 'top';
            if (config.positionTascBar) tascBarPosition = config.positionTascBar;
            if (tascBarPosition === 'bottom') {
                menu.style.top = 'auto';
                menu.style.bottom = '100%';
                menu.style.left = '0';
                menu.style.right = 'auto';
            } else if (tascBarPosition === 'top') {
                menu.style.top = '100%';
                menu.style.bottom = 'auto';
                menu.style.left = '0';
                menu.style.right = 'auto';
            } else if (tascBarPosition === 'left') {
                menu.style.top = '0';
                menu.style.bottom = 'auto';
                menu.style.left = '100%';
                menu.style.right = 'auto';
            } else if (tascBarPosition === 'right') {
                menu.style.top = '0';
                menu.style.bottom = 'auto';
                menu.style.left = 'auto';
                menu.style.right = '100%';
            }

            // Funkcja zamykająca menu
            function closeMenu() {
                menu.style.display = 'none';
            }
            config.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'tascbar-menu-item' + (item.classMenuItem ? ' ' + item.classMenuItem : '');
                if (item.icon) {
                    const itemIcon = document.createElement('span');
                    itemIcon.className = 'tascbar-menu-item-icon' + (item.classMenuItemIcon ? ' ' + item.classMenuItemIcon : '');
                    itemIcon.textContent = item.icon;
                    itemEl.appendChild(itemIcon);
                }
                const itemLabel = document.createElement('span');
                itemLabel.className = 'tascbar-menu-item-label' + (item.classMenuItemLabel ? ' ' + item.classMenuItemLabel : '');
                itemLabel.textContent = item.label;
                itemEl.appendChild(itemLabel);
                // Zawsze zamykaj menu po kliknięciu w opcję
                itemEl.addEventListener('click', (e) => {
                    e.stopPropagation(); // Zapobiega zamknięciu menu przez globalny event click
                    if (typeof item.onClick === 'function') {
                        item.onClick(itemEl, e);
                    }
                    closeMenu();
                });
                itemEl.addEventListener('mouseenter', () => itemEl.classList.add(item.classMenuItemHover || 'hover'));
                itemEl.addEventListener('mouseleave', () => itemEl.classList.remove(item.classMenuItemHover || 'hover'));
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