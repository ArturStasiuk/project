class AppWindow {
    static zIndex = 1000;

    constructor(parent) {
        // dodanie styli okna z public/view/css/window.css
        if (!document.getElementById('app-window-styles')) {
            const link = document.createElement('link');
            link.id = 'app-window-styles';
            link.rel = 'stylesheet';
            link.href = 'view/css/window.css';
            document.head.appendChild(link);
        }
        this.parent = parent;
    }

    // =========================
    // CREATE / INIT
    // =========================
    async createWindow(config) {
        let win = document.getElementById(config?._window?.idWindow);

        // jeśli istnieje → update
        if (win) {
            await this._updateWindowFull(win, config);
            return win;
        }

        // jeśli nie → create
        win = await this._createMain(config._window);

        // parts storage
        win._parts = {};

        // tworzenie sekcji
        this._updateTitleBar(win, config._titleBar, config);
        this._updateMenu(win, config._meniu);
        this._updateContent(win, config._content);

            this._attachFunctions(config._function, win);        
            // NIE dodawaj do DOM tutaj! Zwróć tylko obiekt okna.
            // Dodawanie do DOM powinno być wykonane w innej klasie/metodzie.
            config._function?.onCreate?.(win);
            config._function?.onOpen?.(win);
            return win;
    }

    // =========================
    // MAIN WINDOW
    // =========================
    async _createMain(cfg = {}) {
        const win = document.createElement('div');

        const id = cfg.idWindow || 'win_' + Date.now();
        win.id = id;
        win.className = cfg.classWindow || 'app-window';

        win.style.position = 'absolute';

        this._applyWindowConfig(win, cfg);

        // focus
        win.addEventListener('mousedown', () => {
            win.style.zIndex = ++AppWindow.zIndex;
        });

         return win;
    }

    async _applyWindowConfig(win, cfg = {}) {
        if (cfg.size && cfg.size !== 'auto') {
            win.style.width = cfg.size.width + 'px';
            win.style.height = cfg.size.height + 'px';
        }

        if (cfg.position === 'onCenter') {
            win.style.top = '50%';
            win.style.left = '50%';
            win.style.transform = 'translate(-50%, -50%)';
        } else if (cfg.position) {
            win.style.top = (cfg.position.top || 100) + 'px';
            win.style.left = (cfg.position.left || 100) + 'px';
            win.style.transform = 'none';
        }

        if (cfg.visible === false) {
            win.style.display = 'none';
        } else {
            win.style.display = 'block';
        }

        win.style.zIndex = ++AppWindow.zIndex;
    }

    // =========================
    // TITLE BAR
    // =========================
    async _updateTitleBar(win, cfg = {}, fullConfig = {}) {
        if (win._parts.titleBar) {
            win._parts.titleBar.remove();
            win._parts.titleBar = null;
        }

        if (!cfg?.visible) return;

        const bar = document.createElement('div');
        bar.className = cfg.classTitleBar || 'title-bar';

        const title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = `${cfg.icon || ''} ${cfg.name || ''}`;

        const controls = document.createElement('div');
        controls.className = 'controls';

        const btn = (label, fn) => {
            const b = document.createElement('button');
            b.innerHTML = label;
            b.onclick = fn;
            return b;
        };

        if (cfg.controls?.minimize) {
            controls.appendChild(btn(cfg.controls.minimize, () => {
                win.style.display = 'none';
                cfg.onMinimize?.(win);
            }));
        }

        if (cfg.controls?.maximize) {
            controls.appendChild(btn(cfg.controls.maximize, () => {
                win.classList.toggle('maximized');
                cfg.onMaximize?.(win);
            }));
        }

        if (cfg.controls?.close) {
            controls.appendChild(btn(cfg.controls.close, () => {
                win.remove();
                cfg.onClose?.(win);
                fullConfig?._function?.onClose?.(win);
            }));
        }

        bar.appendChild(title);
        bar.appendChild(controls);

        win.prepend(bar);
        win._parts.titleBar = bar;

        this._makeDraggable(win, bar);
    }

    // =========================
    // MENU
    // =========================
    async _updateMenu(win, cfg = {}) {
        if (win._parts.menu) {
            win._parts.menu.remove();
            win._parts.menu = null;
        }

        if (!cfg?.visible) return;

        const menu = document.createElement('div');
        menu.className = cfg.classMeniu || 'menu';

        cfg.items?.forEach(item => {
            const el = document.createElement('div');
            el.className = 'menu-item';
            el.innerHTML = `${item.icon || ''} ${item.name}`;

            el.onclick = async (e) => {
                await item.onClick?.(el, win, e);
            };

            if (item.submenu) {
                const sub = document.createElement('div');
                sub.className = 'submenu';

                item.submenu.forEach(subItem => {
                    const subEl = document.createElement('div');
                    subEl.className = 'submenu-item';
                    subEl.innerHTML = `${subItem.icon || ''} ${subItem.name}`;

                    subEl.onclick = async (e) => {
                        await subItem.onClick?.(subEl, win, e);
                    };

                    sub.appendChild(subEl);
                });

                el.appendChild(sub);
                el.onmouseenter = () => sub.style.display = 'block';
                el.onmouseleave = () => sub.style.display = 'none';
            }

            menu.appendChild(el);
        });

        if (win._parts.titleBar) {
            win._parts.titleBar.after(menu);
        } else {
            win.prepend(menu);
        }

        win._parts.menu = menu;
    }

    // =========================
    // CONTENT
    // =========================
    async _updateContent(win, cfg = {}) {
        let content = win._parts.content;

        if (!content) {
            content = document.createElement('div');
            win.appendChild(content);
            win._parts.content = content;
        }

        content.className = cfg.classContent || 'content';

        if (cfg.html === null) {
            content.innerHTML = '';
        } else if (typeof cfg.html === 'string') {
            content.innerHTML = cfg.html;
        } else if (cfg.html instanceof HTMLElement) {
            content.innerHTML = '';
            content.appendChild(cfg.html);
        }

        if (cfg.scrollable !== false) {
            content.style.overflow = 'auto';
        }

        if (cfg.style) {
            let styleEl = content.querySelector('style');
            if (!styleEl) {
                styleEl = document.createElement('style');
                content.appendChild(styleEl);
            }
            styleEl.innerHTML = cfg.style;
        }

        if (typeof cfg.script === 'function') {
            setTimeout(() => cfg.script(content, win), 0);
        }

        cfg.onContentReady?.(content, win);
    }

    // =========================
    // FULL UPDATE
    // =========================
    async _updateWindowFull(win, config) {
        if (config._window) this._applyWindowConfig(win, config._window);
        if (config._titleBar) this._updateTitleBar(win, config._titleBar, config);
        if (config._meniu) this._updateMenu(win, config._meniu);
        if (config._content) this._updateContent(win, config._content);
    }

    // =========================
    // FUNCTIONS API
    // =========================
    async _attachFunctions(cfg = {}, win) {

        win.update = (newConfig) => {
            this._updateWindowFull(win, newConfig);
        };

        win.updateContent = (cfg) => {
            this._updateContent(win, cfg);
        };

        win.updateMenu = (cfg) => {
            this._updateMenu(win, cfg);
        };

        win.updateTitleBar = (cfg) => {
            this._updateTitleBar(win, cfg);
        };

        win.updateWindow = (cfg) => {
            this._applyWindowConfig(win, cfg);
        };

        win.open = () => {
            win.style.display = 'block';
            cfg.onOpen?.(win);
        };

        win.close = () => {
            win.remove();
            cfg.onClose?.(win);
        };
    }

    // =========================
    // DRAG
    // =========================
    async _makeDraggable(win, handle) {
        let isDragging = false, offsetX, offsetY;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            win.style.left = (e.clientX - offsetX) + 'px';
            win.style.top = (e.clientY - offsetY) + 'px';
            win.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
     /** funkcja po wywolaniu ktorej zostanie utwozone przykladowe okno demo z tytulem, menu, trescia i przyciskami */
   async winDemo() {
        // Konfiguracja okna demo
        const config = {
            _window: {
                idWindow: 'demo_window',
                classWindow: 'app-window demo-window',
                size: { width: 500, height: 350 },
                position: 'onCenter',
                visible: true
            },
            _titleBar: {
                visible: true,
                classTitleBar: 'title-bar',
                name: 'Demo Okno',
                icon: '<span style="color:#2196f3;">&#9733;</span>',
                controls: {
                    minimize: '&#8211;',
                    maximize: '&#9723;',
                    close: '&#10005;'
                },
                onMinimize: (win) => {
                    win.style.display = 'none';
                },
                onMaximize: (win) => {
                    win.classList.toggle('maximized');
                    if (win.classList.contains('maximized')) {
                        win.style.top = '0';
                        win.style.left = '0';
                        win.style.width = '100vw';
                        win.style.height = '100vh';
                        win.style.transform = 'none';
                    } else {
                        win.style.width = '500px';
                        win.style.height = '350px';
                        win.style.position = 'absolute';
                        win.style.top = '50%';
                        win.style.left = '50%';
                        win.style.transform = 'translate(-50%, -50%)';
                    }
                },
                onClose: (win) => {
                    // Usuwanie okna z DOM obsługiwane przez domyślną funkcję
                }
            },
            _meniu: {
                visible: true,
                classMeniu: 'menu',
                items: [
                    {
                        name: 'Opcja 1',
                        onClick: () => alert('Wybrano: Opcja 1')
                    },
                    {
                        name: 'Opcja 2',
                        submenu: [
                            {
                                name: 'Subopcja 1',
                                onClick: () => alert('Wybrano: Subopcja 1')
                            },
                            {
                                name: 'Subopcja 2',
                                onClick: () => alert('Wybrano: Subopcja 2')
                            }
                        ],
                        onClick: () => alert('Wybrano: Opcja 2')
                    },
                    {
                        name: 'Opcja 3',
                        onClick: () => alert('Wybrano: Opcja 3')
                    }
                ]
            },
            _content: {
                classContent: 'content',
                html: `<h2 style=\"color:#2196f3;\">Witamy w oknie demo!</h2>
                <p>To jest przykładowa treść okna. Możesz przewijać tę sekcję, jeśli tekstu będzie więcej.<br><br>
                <b>Możliwości okna:</b><ul>
                <li>Przeciąganie za pasek tytułu</li>
                <li>Menu z podmenu</li>
                <li>Przyciski: minimalizuj, maksymalizuj, zamknij</li>
                <li>Przewijana treść</li>
                <li>Własny styl CSS</li>
                </ul></p>
                <div style=\"height:200px;\"></div>
                <p>Przewiń, by zobaczyć więcej!</p>` ,
                style: `
                    .demo-window .content {
                        background: #f5f7fa;
                        border-radius: 0 0 8px 8px;
                        padding: 18px;
                        font-family: Arial, sans-serif;
                        font-size: 15px;
                        color: #333;
                        max-height: 220px;
                        min-height: 120px;
                        overflow: auto;
                    }
                    .demo-window .menu {
                        background: #e3eaf2;
                        border-bottom: 1px solid #bcd;
                    }
                    .demo-window .menu-item {
                        padding: 6px 18px;
                        cursor: pointer;
                        display: inline-block;
                        position: relative;
                        border-radius: 4px 4px 0 0;
                        margin-right: 2px;
                        transition: background 0.2s;
                    }
                    .demo-window .menu-item:hover {
                        background: #d0e2fa;
                    }
                    .demo-window .submenu {
                        display: none;
                        position: absolute;
                        left: 0;
                        top: 100%;
                        background: #fff;
                        border: 1px solid #bcd;
                        border-radius: 0 0 6px 6px;
                        min-width: 120px;
                        z-index: 10;
                        box-shadow: 0 2px 8px #0001;
                    }
                    .demo-window .submenu-item {
                        padding: 6px 16px;
                        cursor: pointer;
                        white-space: nowrap;
                        border-radius: 0 0 6px 6px;
                    }
                    .demo-window .submenu-item:hover {
                        background: #e3eaf2;
                    }
                    .demo-window .title-bar {
                        background: #2196f3;
                        color: #fff;
                        border-radius: 8px 8px 0 0;
                        padding: 8px 16px;
                        font-size: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        user-select: none;
                    }
                    .demo-window .controls button {
                        background: none;
                        border: none;
                        color: #fff;
                        font-size: 18px;
                        margin-left: 8px;
                        cursor: pointer;
                        border-radius: 3px;
                        transition: background 0.2s;
                    }
                    .demo-window .controls button:hover {
                        background: #1976d2;
                    }
                `,
                scrollable: true
            },
            _function: {
                onCreate: (win) => {
                    // Możesz dodać dodatkowe akcje po utworzeniu okna
                },
                onOpen: (win) => {
                    // Możesz dodać dodatkowe akcje po otwarciu okna
                },
                onClose: (win) => {
                    // Możesz dodać dodatkowe akcje po zamknięciu okna
                }
            }
    };

        // Tworzenie okna demo
      return  this.createWindow(config);
}



}

export { AppWindow };