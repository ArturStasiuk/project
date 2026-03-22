
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

    createWindow(data) {
        // Tworzenie głównego kontenera okna
        const win = document.createElement('div');
        win.className = 'window-minimal';
        win.id = data.id || '';

        // Style minimalistyczne (możesz przenieść do CSS)
        win.style.position = 'fixed';
        win.style.background = '#fff';
        win.style.borderRadius = '12px';
        win.style.boxShadow = '0 4px 24px rgba(0,0,0,0.10)';
        win.style.minWidth = '240px';
        win.style.overflow = 'hidden';
        win.style.display = 'flex';
        win.style.flexDirection = 'column';
        win.style.transition = 'box-shadow 0.2s';
        win.style.zIndex = 1000;
        if (data.size && data.size.width) win.style.width = typeof data.size.width === 'number' ? data.size.width + 'px' : data.size.width;
        if (data.size && data.size.height) win.style.height = typeof data.size.height === 'number' ? data.size.height + 'px' : data.size.height;

        // Pozycjonowanie
        if (data.position === 'onCenter') {
            win.style.top = '50%';
            win.style.left = '50%';
            win.style.transform = 'translate(-50%, -50%)';
        } else if (data.position && typeof data.position === 'object') {
            if (data.position.top !== undefined) win.style.top = data.position.top + 'px';
            if (data.position.left !== undefined) win.style.left = data.position.left + 'px';
        } else {
            win.style.top = '10vh';
            win.style.left = '10vw';
        }

        // Pasek tytułu
        if (data.name || data.icon || (data.controls && (data.controls.minimize || data.controls.maximize || data.controls.close))) {
            const titlebar = document.createElement('div');
            titlebar.className = 'window-titlebar';
            titlebar.style.display = 'flex';
            titlebar.style.alignItems = 'center';
            titlebar.style.justifyContent = 'space-between';
            titlebar.style.padding = '0.5em 1em';
            titlebar.style.background = '#f7f7f7';
            titlebar.style.borderBottom = '1px solid #eee';
            titlebar.style.fontWeight = '500';
            titlebar.style.fontSize = '1.05em';
            // Ikona i tytuł
            const left = document.createElement('div');
            left.style.display = 'flex';
            left.style.alignItems = 'center';
            if (data.icon) {
                const icon = document.createElement('span');
                icon.textContent = data.icon;
                icon.style.marginRight = '0.5em';
                left.appendChild(icon);
            }
            if (data.name) {
                const name = document.createElement('span');
                name.textContent = data.name;
                left.appendChild(name);
            }
            titlebar.appendChild(left);
            // Kontrolki okna
            if (data.controls) {
                const controls = document.createElement('div');
                controls.style.display = 'flex';
                controls.style.gap = '0.5em';
                if (data.controls.minimize) {
                    const minBtn = document.createElement('button');
                    minBtn.textContent = typeof data.controls.minimize === 'string' ? data.controls.minimize : '➖';
                    minBtn.title = 'Minimalizuj';
                    minBtn.style.background = 'none';
                    minBtn.style.border = 'none';
                    minBtn.style.fontSize = '1.1em';
                    minBtn.style.cursor = 'pointer';
                    minBtn.onclick = () => win.style.display = 'none';
                    controls.appendChild(minBtn);
                }
                if (data.controls.maximize) {
                    const maxBtn = document.createElement('button');
                    maxBtn.textContent = typeof data.controls.maximize === 'string' ? data.controls.maximize : '🗖';
                    maxBtn.title = 'Maksymalizuj';
                    maxBtn.style.background = 'none';
                    maxBtn.style.border = 'none';
                    maxBtn.style.fontSize = '1.1em';
                    maxBtn.style.cursor = 'pointer';
                    // Prosty toggle pełnego ekranu
                    maxBtn.onclick = () => {
                        if (win.dataset.maximized === '1') {
                            win.style.width = data.size && data.size.width ? (typeof data.size.width === 'number' ? data.size.width + 'px' : data.size.width) : '';
                            win.style.height = data.size && data.size.height ? (typeof data.size.height === 'number' ? data.size.height + 'px' : data.size.height) : '';
                            win.style.top = win.dataset.oldTop;
                            win.style.left = win.dataset.oldLeft;
                            win.style.transform = win.dataset.oldTransform;
                            win.dataset.maximized = '';
                        } else {
                            win.dataset.oldTop = win.style.top;
                            win.dataset.oldLeft = win.style.left;
                            win.dataset.oldTransform = win.style.transform;
                            win.style.top = '0';
                            win.style.left = '0';
                            win.style.transform = '';
                            win.style.width = '100vw';
                            win.style.height = '100vh';
                            win.dataset.maximized = '1';
                        }
                    };
                    controls.appendChild(maxBtn);
                }
                if (data.controls.close) {
                    const closeBtn = document.createElement('button');
                    closeBtn.textContent = typeof data.controls.close === 'string' ? data.controls.close : '❌';
                    closeBtn.title = 'Zamknij';
                    closeBtn.style.background = 'none';
                    closeBtn.style.border = 'none';
                    closeBtn.style.fontSize = '1.1em';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.onclick = () => {
                        win.remove();
                        if (typeof data.onClose === 'function') data.onClose(win);
                    };
                    controls.appendChild(closeBtn);
                }
                titlebar.appendChild(controls);
            }
            win.appendChild(titlebar);
        }

        // Menu (jeśli menuVisible)
        if (data.menuVisible !== false && Array.isArray(data.menu)) {
            const menuBar = document.createElement('div');
            menuBar.className = 'window-menubar';
            menuBar.style.display = 'flex';
            menuBar.style.gap = '0';
            menuBar.style.padding = '0';
            menuBar.style.background = '#f7f7f7';
            menuBar.style.borderBottom = '1px solid #eee';
            menuBar.style.userSelect = 'none';
            let openMenu = null;
            data.menu.forEach(group => {
                const groupEl = document.createElement('div');
                groupEl.className = 'window-menubar-group';
                groupEl.style.position = 'relative';
                groupEl.style.display = 'flex';
                groupEl.style.alignItems = 'center';
                groupEl.style.padding = '0 16px';
                groupEl.style.height = '28px';
                groupEl.style.cursor = 'pointer';
                groupEl.style.fontWeight = '500';
                groupEl.style.fontSize = '1em';
                groupEl.style.color = '#222';
                groupEl.style.background = 'none';
                if (group.icon) {
                    const icon = document.createElement('span');
                    icon.textContent = group.icon;
                    icon.style.marginRight = '0.3em';
                    groupEl.appendChild(icon);
                }
                if (group.title) {
                    const title = document.createElement('span');
                    title.textContent = group.title;
                    groupEl.appendChild(title);
                }
                // Rozwijane menu (opcjonalnie)
                if (Array.isArray(group.items)) {
                    const dropdown = document.createElement('div');
                    dropdown.className = 'window-menubar-dropdown';
                    dropdown.style.position = 'absolute';
                    dropdown.style.top = '100%';
                    dropdown.style.left = '0';
                    dropdown.style.minWidth = '140px';
                    dropdown.style.background = '#fff';
                    dropdown.style.border = '1px solid #ccc';
                    dropdown.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    dropdown.style.display = 'none';
                    dropdown.style.flexDirection = 'column';
                    dropdown.style.zIndex = '1001';
                    group.items.forEach(item => {
                        if (item === '---') {
                            const sep = document.createElement('div');
                            sep.style.height = '1px';
                            sep.style.margin = '4px 0';
                            sep.style.background = '#e0e0e0';
                            dropdown.appendChild(sep);
                        } else if (typeof item === 'object') {
                            const btn = document.createElement('div');
                            btn.className = 'window-menubar-item';
                            btn.textContent = (item.icon ? item.icon + ' ' : '') + (item.label || '');
                            btn.style.padding = '4px 18px 4px 28px';
                            btn.style.cursor = 'pointer';
                            btn.style.whiteSpace = 'nowrap';
                            btn.style.fontSize = '1em';
                            btn.style.color = '#222';
                            btn.style.background = 'none';
                            btn.onmouseenter = () => btn.style.background = '#e6f0fa';
                            btn.onmouseleave = () => btn.style.background = 'none';
                            btn.onclick = e => { e.stopPropagation(); dropdown.style.display = 'none'; openMenu = null; item.onClick && item.onClick(win); };
                            dropdown.appendChild(btn);
                        } else if (typeof item === 'string') {
                            const btn = document.createElement('div');
                            btn.className = 'window-menubar-item';
                            btn.textContent = item;
                            btn.style.padding = '4px 18px 4px 28px';
                            btn.style.cursor = 'pointer';
                            btn.style.whiteSpace = 'nowrap';
                            btn.style.fontSize = '1em';
                            btn.style.color = '#222';
                            btn.style.background = 'none';
                            btn.onmouseenter = () => btn.style.background = '#e6f0fa';
                            btn.onmouseleave = () => btn.style.background = 'none';
                            btn.onclick = e => { e.stopPropagation(); dropdown.style.display = 'none'; openMenu = null; if (item.toLowerCase().includes('zamknij')) { win.remove(); if (typeof data.onClose === 'function') data.onClose(win); } };
                            dropdown.appendChild(btn);
                        }
                    });
                    groupEl.appendChild(dropdown);
                    // Obsługa otwierania/zamykania menu
                    const openDropdown = e => {
                        e.stopPropagation();
                        if (openMenu && openMenu !== dropdown) openMenu.style.display = 'none';
                        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                        openMenu = dropdown.style.display === 'block' ? dropdown : null;
                    };
                    groupEl.addEventListener('click', openDropdown);
                    groupEl.addEventListener('mouseenter', () => {
                        if (openMenu && openMenu !== dropdown) {
                            if (openMenu) openMenu.style.display = 'none';
                            dropdown.style.display = 'block';
                            openMenu = dropdown;
                        }
                    });
                }
                menuBar.appendChild(groupEl);
            });
            // Zamknij menu po kliknięciu poza
            document.addEventListener('click', () => {
                if (openMenu) openMenu.style.display = 'none';
                openMenu = null;
            });
            win.appendChild(menuBar);
        }

        // Zawartość okna
        const content = document.createElement('div');
        content.className = 'window-content';
        content.style.flex = '1 1 auto';
        content.style.padding = '1.2em';
        content.style.overflow = 'auto';
        if (data.content) {
            if (typeof data.content === 'string') content.innerHTML = data.content;
            else if (data.content instanceof HTMLElement) content.appendChild(data.content);
        }
        win.appendChild(content);

        // Callback po wyrenderowaniu contentu
        if (typeof data.onContentReady === 'function') {
            setTimeout(() => data.onContentReady(win), 0);
        }
            // --- DYNAMICZNE DOPASOWANIE ROZMIARU OKNA DO PANELU I TASKBARA ---
            const adjustWindowToPanel = () => {
                const panel = document.getElementById(this.idPanel);
                const tascBar = document.getElementById(this.idTascBar);
                if (!panel) return;
                const panelRect = panel.getBoundingClientRect();
                let tascBarRect = tascBar ? tascBar.getBoundingClientRect() : null;
                let maxWidth = panelRect.width;
                let maxHeight = panelRect.height;
                let minTop = panelRect.top;
                let minLeft = panelRect.left;
                let maxRight = panelRect.right;
                let maxBottom = panelRect.bottom;
                if (tascBarRect) {
                    if (this.positionTascBar === 'bottom') {
                        maxHeight = tascBarRect.top - panelRect.top;
                        maxBottom = tascBarRect.top;
                    } else if (this.positionTascBar === 'top') {
                        minTop = tascBarRect.bottom;
                        maxHeight = panelRect.bottom - tascBarRect.bottom;
                    } else if (this.positionTascBar === 'left') {
                        minLeft = tascBarRect.right;
                        maxWidth = panelRect.right - tascBarRect.right;
                    } else if (this.positionTascBar === 'right') {
                        maxRight = tascBarRect.left;
                        maxWidth = tascBarRect.left - panelRect.left;
                    }
                }
                // Dopasuj szerokość
                if (win.offsetWidth > maxWidth) {
                    win.style.width = Math.max(240, Math.floor(maxWidth)) + 'px';
                }
                // Dopasuj wysokość
                if (win.offsetHeight > maxHeight) {
                    win.style.height = Math.max(120, Math.floor(maxHeight)) + 'px';
                }
                // Przesuń okno, jeśli wystaje poza panel lub nachodzi na taskbar
                const winRect = win.getBoundingClientRect();
                let newLeft = win.offsetLeft;
                let newTop = win.offsetTop;
                // Poziomo
                if (winRect.right > maxRight) {
                    newLeft = Math.max(maxRight - winRect.width, minLeft);
                    win.style.left = newLeft + 'px';
                }
                if (winRect.left < minLeft) {
                    newLeft = minLeft;
                    win.style.left = newLeft + 'px';
                }
                // Pionowo
                if (winRect.bottom > maxBottom) {
                    newTop = Math.max(maxBottom - winRect.height, minTop);
                    win.style.top = newTop + 'px';
                }
                if (winRect.top < minTop) {
                    newTop = minTop;
                    win.style.top = newTop + 'px';
                }
            };
            setTimeout(adjustWindowToPanel, 0);
            window.addEventListener('resize', adjustWindowToPanel);
            win.addEventListener('DOMNodeRemoved', function handler(e) {
                if (e.target === win) {
                    window.removeEventListener('resize', adjustWindowToPanel);
                    win.removeEventListener('DOMNodeRemoved', handler);
                }
            });
        return win;
    }




}

export { config };