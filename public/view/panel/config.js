
class config {
    constructor(parent) {
        this.parent = parent;

        // Ładowanie arkuszy stylów (tylko raz)
        this._loadCSS('panel-css', './view/css/panel.css');
        this._loadCSS('window-css', './view/css/window.css');

        // Ścieżka do tapety panelu
        this.wallpapers = ['./view/css/wallpapers/wallpapers1.jpg'];

        // Unikalne klasy i ID dla panelu
        this.classNamePanel = 'panel';
        this.idPanel = 'id_panel';

        // Unikalne klasy i ID dla tascBar
        this.classNameTascBar = 'tascBar';
        this.idTascBar = 'idTascBar';
        this.positionTascBar = 'right'; // 'top' | 'bottom' | 'left' | 'right'
        this.contentPanel = null;
    }

    _loadCSS(id, href) {
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.id = id;
            document.head.appendChild(link);
        }
    }

    async configPanel() {
        const panel = document.createElement('div');
        panel.className = this.classNamePanel;
        panel.id = this.idPanel;

        // Tapeta
        if (this.wallpapers?.[0]) {
            const wallpaperImg = document.createElement('img');
            wallpaperImg.src = this.wallpapers[0];
            wallpaperImg.alt = 'wallpaper';
            wallpaperImg.className = 'panel-wallpaper';
            panel.appendChild(wallpaperImg);
        }

        // Dopasowanie rozmiaru do okna
        const resizeHandler = () => {
            panel.style.width = window.innerWidth + 'px';
            panel.style.height = window.innerHeight + 'px';
        };
        window.addEventListener('resize', resizeHandler);

        // Czyszczenie nasłuchiwacza po usunięciu panelu z DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                m.removedNodes.forEach(node => {
                    if (node === panel) {
                        window.removeEventListener('resize', resizeHandler);
                        observer.disconnect();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true });

        return panel;
    }

    async configTascBar() {
        const tascBar = document.createElement('div');
        tascBar.className = this.classNameTascBar;
        tascBar.id = this.idTascBar;
        tascBar.classList.add(`tascbar-${this.positionTascBar}`);

        // Zwijanie/rozwijanie dla left/right
        if (this.positionTascBar === 'left' || this.positionTascBar === 'right') {
            tascBar.classList.add('tascbar-collapsed');
            tascBar._openMenu = null;

            function setDynamicWidth() {
                const titles = tascBar.querySelectorAll('.tascbar-icon-title');
                let maxWidth = 0;
                titles.forEach(title => {
                    const temp = document.createElement('span');
                    temp.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap;';
                    const cs = window.getComputedStyle(title);
                    temp.style.fontSize = cs.fontSize;
                    temp.style.fontWeight = cs.fontWeight;
                    temp.style.fontFamily = cs.fontFamily;
                    temp.textContent = title.textContent;
                    document.body.appendChild(temp);
                    maxWidth = Math.max(maxWidth, temp.offsetWidth);
                    document.body.removeChild(temp);
                });
                const ICON_SIZE = 40, ICON_MARGIN = 8, TEXT_PADDING = 16;
                tascBar.style.width = (ICON_SIZE + ICON_MARGIN + maxWidth + TEXT_PADDING) + 'px';
            }

            tascBar.addEventListener('mouseenter', () => {
                tascBar.classList.remove('tascbar-collapsed');
                tascBar.classList.add('tascbar-expanded');
                setDynamicWidth();
            });

            tascBar.addEventListener('mouseleave', (e) => {
                if (tascBar._openMenu) {
                    const menu = tascBar._openMenu;
                    const onMenuLeave = (ev) => {
                        if (!tascBar.contains(ev.relatedTarget) && !menu.contains(ev.relatedTarget)) {
                            tascBar.classList.remove('tascbar-expanded');
                            tascBar.classList.add('tascbar-collapsed');
                            tascBar.style.width = '';
                            menu.style.display = 'none';
                            tascBar._openMenu = null;
                            menu.removeEventListener('mouseleave', onMenuLeave);
                        }
                    };
                    menu.addEventListener('mouseleave', onMenuLeave);
                    return;
                }
                tascBar.classList.remove('tascbar-expanded');
                tascBar.classList.add('tascbar-collapsed');
                tascBar.style.width = '';
            });
        }

        return tascBar;
    }

    /** Tworzy element ikony/menu do tascBar
     * @param {Object} config
     * @returns {HTMLElement}
     */
    createTascBarIcon(config) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'tascbar-icon' + (config.classIconWrap ? ' ' + config.classIconWrap : '');
        iconWrap.id = config.idIcon || '';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'tascbar-icon-emoji' + (config.classIcon ? ' ' + config.classIcon : '');
        iconSpan.textContent = config.icon || config.title || '';
        iconWrap.appendChild(iconSpan);

        if (config.title) {
            const titleSpan = document.createElement('span');
            titleSpan.className = 'tascbar-icon-title' + (config.classTitle ? ' ' + config.classTitle : '');
            titleSpan.textContent = config.title;
            iconWrap.appendChild(titleSpan);
        }

        if (typeof config.onClick === 'function') {
            iconWrap.addEventListener('click', (e) => config.onClick(iconWrap, e));
        }

        if (Array.isArray(config.items) && config.items.length > 0) {
            const menu = document.createElement('div');
            menu.className = 'tascbar-menu' + (config.classMenu ? ' ' + config.classMenu : '');
            menu.style.display = 'none';
            // fixed positioning ensures correct placement relative to viewport regardless of scroll
            menu.style.position = 'fixed';
            menu.style.zIndex = '99999';

            const tascBar = document.getElementById(this.idTascBar);

            const closeMenu = () => {
                menu.style.display = 'none';
                if (tascBar) {
                    tascBar._openMenu = null;
                    if (tascBar.classList.contains('tascbar-expanded')) {
                        tascBar.classList.remove('tascbar-expanded');
                        tascBar.classList.add('tascbar-collapsed');
                    }
                }
            };

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

                itemEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (typeof item.onClick === 'function') item.onClick(itemEl, e);
                    closeMenu();
                });

                menu.appendChild(itemEl);
            });

            const positionMenu = () => {
                const rect = iconWrap.getBoundingClientRect();
                menu.style.minWidth = rect.width + 'px';

                let pos = 'right';
                const bar = document.getElementById('idTascBar');
                if (bar) {
                    if (bar.classList.contains('tascbar-top'))    pos = 'top';
                    else if (bar.classList.contains('tascbar-bottom')) pos = 'bottom';
                    else if (bar.classList.contains('tascbar-left'))   pos = 'left';
                    else if (bar.classList.contains('tascbar-right'))  pos = 'right';
                }

                // Pokaż by znać wysokość
                menu.style.display = 'block';

                if (pos === 'bottom') {
                    menu.style.left = rect.left + 'px';
                    menu.style.top  = (rect.top - menu.offsetHeight) + 'px';
                } else if (pos === 'right') {
                    menu.style.left = (rect.left - menu.offsetWidth) + 'px';
                    menu.style.top  = rect.top + 'px';
                } else if (pos === 'left') {
                    menu.style.left = rect.right + 'px';
                    menu.style.top  = rect.top + 'px';
                } else {
                    menu.style.left = rect.left + 'px';
                    menu.style.top  = rect.bottom + 'px';
                }
            };

            iconWrap.addEventListener('click', (e) => {
                e.stopPropagation();
                if (menu.style.display === 'block') {
                    closeMenu();
                } else {
                    positionMenu();
                    if (tascBar) tascBar._openMenu = menu;
                }
            });

            document.addEventListener('click', () => {
                menu.style.display = 'none';
                if (tascBar) tascBar._openMenu = null;
            });

            document.body.appendChild(menu);
        }

        return iconWrap;
    }
}

export { config };
