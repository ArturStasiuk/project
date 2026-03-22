
class config {
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
        // Dodanie window.css jeśli nie załadowany
        if (!document.getElementById('window-css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './view/css/window.css';
            link.id = 'window-css';
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
        this.contentPanel = null; // Przechowywanie referencji do zawartości panelu, jeśli potrzebne


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
            // Referencja do menu, ustawiana przez createTascBarIcon
            tascBar._openMenu = null;

            // Funkcja do dynamicznego ustawiania szerokości
            function setDynamicWidth() {
                // Pobierz wszystkie tytuły ikon
                const titles = tascBar.querySelectorAll('.tascbar-icon-title');
                let maxWidth = 0;
                titles.forEach(title => {
                    // Utwórz tymczasowy span do pomiaru szerokości
                    const temp = document.createElement('span');
                    temp.style.visibility = 'hidden';
                    temp.style.position = 'absolute';
                    temp.style.fontSize = window.getComputedStyle(title).fontSize;
                    temp.style.fontWeight = window.getComputedStyle(title).fontWeight;
                    temp.style.fontFamily = window.getComputedStyle(title).fontFamily;
                    temp.textContent = title.textContent;
                    document.body.appendChild(temp);
                    maxWidth = Math.max(maxWidth, temp.offsetWidth);
                    document.body.removeChild(temp);
                });
                // Szerokość: ikona + odstęp + max tekst + marginesy
                let newWidth = 32 + 8 + maxWidth + 24; // 32px ikona, 8px margines, 24px zapas
                tascBar.style.width = newWidth + 'px';
            }

            tascBar.addEventListener('mouseenter', () => {
                tascBar.classList.remove('tascbar-collapsed');
                tascBar.classList.add('tascbar-expanded');
                setDynamicWidth();
            });
            tascBar.addEventListener('mouseleave', () => {
                tascBar.classList.remove('tascbar-expanded');
                tascBar.classList.add('tascbar-collapsed');
                tascBar.style.width = '';
                // Ukryj menu jeśli otwarte
                if (tascBar._openMenu) {
                    tascBar._openMenu.style.display = 'none';
                    tascBar._openMenu = null;
                }
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
            const tascBar = document.getElementById(this.idTascBar);
            function closeMenuAndCollapseBar() {
                menu.style.display = 'none';
                if (tascBar && (tascBar.classList.contains('tascbar-expanded'))) {
                    tascBar.classList.remove('tascbar-expanded');
                    tascBar.classList.add('tascbar-collapsed');
                }
                if (tascBar) tascBar._openMenu = null;
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
                // Zawsze zamykaj menu po kliknięciu w opcję i zwijaj pasek
                itemEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (typeof item.onClick === 'function') {
                        item.onClick(itemEl, e);
                    }
                    closeMenuAndCollapseBar();
                });
                itemEl.addEventListener('mouseenter', () => itemEl.classList.add(item.classMenuItemHover || 'hover'));
                itemEl.addEventListener('mouseleave', () => itemEl.classList.remove(item.classMenuItemHover || 'hover'));
                menu.appendChild(itemEl);
            });

            // Pokaz/ukryj menu po kliknięciu
            iconWrap.addEventListener('click', (e) => {
                e.stopPropagation();
                if (menu.style.display === 'block') {
                    menu.style.display = 'none';
                    if (tascBar) tascBar._openMenu = null;
                } else {
                    menu.style.display = 'block';
                    if (tascBar) tascBar._openMenu = menu;
                }
            });
            // Ukryj menu po kliknięciu poza
            document.addEventListener('click', () => {
                menu.style.display = 'none';
                if (tascBar) tascBar._openMenu = null;
            });
            iconWrap.style.position = 'relative';
            iconWrap.appendChild(menu);
        }

        return iconWrap;
    }



    /** funkcja umozliwiajaca po najechaniu na okno na 
     * pasek tytulu i itp 
     */



    /**
     * Tworzy element okna na podstawie przekazanej konfiguracji.
     * @param {Object} data Konfiguracja okna (patrz dokumentacja)
     * @returns {HTMLElement} Element DOM okna gotowy do wstawienia do DOM
     */
    createWindow(data) {
                // Dodaj style Windows tylko raz
                if (!document.getElementById('window-css-inline')) {
                    const style = document.createElement('style');
                    style.id = 'window-css-inline';
                    style.textContent = `
                    .window {
                        background: #fff;
                        border: 1px solid #b4b4b4;
                        border-radius: 6px;
                        box-shadow: 0 8px 32px 0 rgba(0,0,0,0.18), 0 1.5px 0 #e0e0e0;
                        overflow: hidden;
                        font-family: 'Segoe UI', Arial, sans-serif;
                        min-width: 240px;
                        min-height: 120px;
                    }
                    .window-titlebar {
                        background: linear-gradient(90deg, #2186eb 80%, #1a5fb4 100%);
                        color: #fff;
                        display: flex;
                        align-items: center;
                        height: 32px;
                        padding: 0 8px;
                        user-select: none;
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    }
                    .window-titlebar-icon {
                        margin-right: 8px;
                        font-size: 18px;
                        display: flex;
                        align-items: center;
                    }
                    .window-titlebar-title {
                        flex: 1;
                        font-size: 15px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .window-titlebar-controls {
                        display: flex;
                        gap: 2px;
                    }
                    .window-titlebar-controls button {
                        background: transparent;
                        border: none;
                        color: #fff;
                        width: 32px;
                        height: 28px;
                        font-size: 16px;
                        border-radius: 3px;
                        cursor: pointer;
                        transition: background 0.15s;
                    }
                    .window-titlebar-controls button:hover {
                        background: rgba(255,255,255,0.18);
                    }
                    .window-btn-close:hover {
                        background: #e81123 !important;
                        color: #fff;
                    }
                    .window-menubar {
                        display: flex;
                        background: #f3f3f3;
                        border-bottom: 1px solid #e0e0e0;
                        height: 28px;
                        align-items: stretch;
                        font-size: 14px;
                        user-select: none;
                    }
                    .window-menu-group {
                        position: relative;
                        padding: 0 16px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        height: 100%;
                    }
                    .window-menu-group.active, .window-menu-group:hover {
                        background: #e5f1fb;
                    }
                    .window-menu-title {
                        font-weight: 500;
                    }
                    .window-menu-dropdown {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        min-width: 160px;
                        background: #fff;
                        border: 1px solid #b4b4b4;
                        box-shadow: 0 4px 16px 0 rgba(0,0,0,0.10);
                        z-index: 100;
                        border-radius: 0 0 6px 6px;
                        padding: 4px 0;
                    }
                    .window-menu-item {
                        padding: 6px 24px 6px 32px;
                        font-size: 14px;
                        color: #222;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        position: relative;
                        min-height: 28px;
                    }
                    .window-menu-item:hover {
                        background: #e5f1fb;
                        color: #0050a8;
                    }
                    .window-menu-item-icon {
                        position: absolute;
                        left: 8px;
                        font-size: 15px;
                        width: 18px;
                        text-align: center;
                    }
                    .window-menu-separator {
                        height: 1px;
                        background: #e0e0e0;
                        margin: 4px 0;
                    }
                    .window-content {
                        padding: 18px 18px 18px 18px;
                        background: #fff;
                        min-height: 60px;
                        font-size: 15px;
                        color: #222;
                    }
                    `;
                    document.head.appendChild(style);
                }
        // Główne okno
        const win = document.createElement('div');
        win.className = 'window';
        win.id = data.id || '';
        if (data.size && typeof data.size === 'object') {
            if (data.size.width) win.style.width = typeof data.size.width === 'number' ? data.size.width + 'px' : data.size.width;
            if (data.size.height) win.style.height = typeof data.size.height === 'number' ? data.size.height + 'px' : data.size.height;
        }
        if (data.position) {
            if (data.position === 'onCenter') {
                win.style.position = 'fixed';
                win.style.top = '50%';
                win.style.left = '50%';
                win.style.transform = 'translate(-50%, -50%)';
            } else if (typeof data.position === 'object') {
                win.style.position = 'fixed';
                if (data.position.top !== undefined) win.style.top = data.position.top + 'px';
                if (data.position.left !== undefined) win.style.left = data.position.left + 'px';
            }
        }
        // Pasek tytułu
        if (data.name || data.icon || (data.controls && Object.values(data.controls).some(Boolean))) {
            const titleBar = document.createElement('div');
            titleBar.className = 'window-titlebar';
            if (data.icon) {
                const icon = document.createElement('span');
                icon.className = 'window-titlebar-icon';
                icon.innerHTML = data.icon;
                titleBar.appendChild(icon);
            }
            if (data.name) {
                const title = document.createElement('span');
                title.className = 'window-titlebar-title';
                title.textContent = data.name;
                titleBar.appendChild(title);
            }
            // Kontrolki
            if (data.controls) {
                const controls = document.createElement('div');
                controls.className = 'window-titlebar-controls';
                if (data.controls.minimize) {
                    const minBtn = document.createElement('button');
                    minBtn.className = 'window-btn-minimize';
                    minBtn.innerHTML = data.controls.minimize === true ? '➖' : data.controls.minimize;
                    controls.appendChild(minBtn);
                }
                if (data.controls.maximize) {
                    const maxBtn = document.createElement('button');
                    maxBtn.className = 'window-btn-maximize';
                    maxBtn.innerHTML = data.controls.maximize === true ? '🗖' : data.controls.maximize;
                    controls.appendChild(maxBtn);
                }
                if (data.controls.close) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'window-btn-close';
                    closeBtn.innerHTML = data.controls.close === true ? '❌' : data.controls.close;
                    closeBtn.onclick = () => {
                        if (typeof data.onClose === 'function') data.onClose(win);
                        win.remove();
                    };
                    controls.appendChild(closeBtn);
                }
                titleBar.appendChild(controls);
            }
            win.appendChild(titleBar);
        }
        // Menu w stylu Windows (rozwijane, jedno otwarte, klik poza zamyka)
        if (data.menuVisible !== false && Array.isArray(data.menu) && data.menu.length > 0) {
            const menuBar = document.createElement('div');
            menuBar.className = 'window-menubar';
            let openedMenu = null;
            // Zamknij menu po kliknięciu poza
            function closeAllMenus() {
                menuBar.querySelectorAll('.window-menu-dropdown').forEach(drop => drop.style.display = 'none');
                menuBar.querySelectorAll('.window-menu-group').forEach(g => g.classList.remove('active'));
                openedMenu = null;
            }
            document.addEventListener('mousedown', (e) => {
                if (!menuBar.contains(e.target)) closeAllMenus();
            });
            data.menu.forEach((group, groupIdx) => {
                const groupEl = document.createElement('div');
                groupEl.className = 'window-menu-group';
                if (group.title) {
                    const groupTitle = document.createElement('span');
                    groupTitle.className = 'window-menu-title';
                    groupTitle.textContent = group.title;
                    groupEl.appendChild(groupTitle);
                }
                // Dropdown
                if (Array.isArray(group.items)) {
                    const dropdown = document.createElement('div');
                    dropdown.className = 'window-menu-dropdown';
                    dropdown.style.display = 'none';
                    group.items.forEach(item => {
                        let itemEl = document.createElement('div');
                        itemEl.className = 'window-menu-item';
                        // Separator
                        if (item === '---') {
                            const sep = document.createElement('div');
                            sep.className = 'window-menu-separator';
                            dropdown.appendChild(sep);
                            return;
                        }
                        // String jako label
                        if (typeof item === 'string') {
                            itemEl.textContent = item;
                            // Obsługa Zamknij
                            if (item === 'Zamknij') {
                                itemEl.onclick = () => {
                                    closeAllMenus();
                                    if (typeof data.onClose === 'function') data.onClose(win);
                                    win.remove();
                                };
                            }
                        }
                        // Obiekt z label/onClick/icon
                        else if (typeof item === 'object') {
                            if (item.icon) {
                                const icon = document.createElement('span');
                                icon.className = 'window-menu-item-icon';
                                icon.textContent = item.icon;
                                itemEl.appendChild(icon);
                            }
                            if (item.label) {
                                const label = document.createElement('span');
                                label.className = 'window-menu-item-label';
                                label.textContent = item.label;
                                itemEl.appendChild(label);
                            }
                            // Obsługa onClick
                            if (typeof item.onClick === 'function') {
                                itemEl.onclick = (e) => {
                                    closeAllMenus();
                                    item.onClick(win, e);
                                };
                            }
                        }
                        dropdown.appendChild(itemEl);
                    });
                    groupEl.appendChild(dropdown);
                    // Otwieranie/zamykanie menu
                    groupEl.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                        if (openedMenu && openedMenu !== dropdown) closeAllMenus();
                        if (dropdown.style.display === 'block') {
                            dropdown.style.display = 'none';
                            groupEl.classList.remove('active');
                            openedMenu = null;
                        } else {
                            dropdown.style.display = 'block';
                            groupEl.classList.add('active');
                            openedMenu = dropdown;
                        }
                    });
                }
                menuBar.appendChild(groupEl);
            });
            win.appendChild(menuBar);
        }
        // Zawartość okna
        const content = document.createElement('div');
        content.className = 'window-content';
        if (data.content) {
            if (typeof data.content === 'string') {
                content.innerHTML = data.content;
            } else if (data.content instanceof HTMLElement) {
                content.appendChild(data.content);
            }
        }
        win.appendChild(content);
        // Callback po utworzeniu contentu
        if (typeof data.onContentReady === 'function') {
            setTimeout(() => data.onContentReady(win), 0);
        }
        // Blokowanie tła/taskbara/modalność (do obsługi przez wywołującego)
        // ...
        return win;
    }










}

export { config };