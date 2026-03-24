class AppWindow {
    static zIndex = 1000;
    static MAX_ZINDEX = 99998; // zawsze mniej niż tascbar-menu

    constructor(parent) {
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
        config._function?.onCreate?.(win);
        config._function?.onOpen?.(win);
        return win;
    }

    // =========================
    // MAIN WINDOW
    // =========================
    async _createMain(cfg = {}) {
        const win = document.createElement('div');

        win.id = cfg.idWindow || 'win_' + Date.now();
        win.className = cfg.classWindow || 'app-window';
        win.style.position = 'absolute';

        this._applyWindowConfig(win, cfg);

        win.addEventListener('mousedown', () => {
            AppWindow.zIndex = Math.min(++AppWindow.zIndex, AppWindow.MAX_ZINDEX);
            win.style.zIndex = AppWindow.zIndex;
        });

        return win;
    }

    _applyWindowConfig(win, cfg = {}) {
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

        win.style.display = (cfg.visible === false) ? 'none' : 'block';

        AppWindow.zIndex = Math.min(++AppWindow.zIndex, AppWindow.MAX_ZINDEX);
        win.style.zIndex = AppWindow.zIndex;
    }

    // =========================
    // TITLE BAR
    // =========================
    _updateTitleBar(win, cfg = {}, fullConfig = {}) {
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
    _updateMenu(win, cfg = {}) {
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

                el.onclick = async (e) => {
                    if (sub.style.display === 'block') {
                        sub.style.display = 'none';
                    } else {
                        menu.querySelectorAll('.submenu').forEach(s => { if (s !== sub) s.style.display = 'none'; });
                        sub.style.display = 'block';
                    }
                    if (item.onClick) await item.onClick(el, win, e);
                };

                document.addEventListener('click', function hideSub(e) {
                    if (!el.contains(e.target)) sub.style.display = 'none';
                });
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
    _updateContent(win, cfg = {}) {
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

        content.style.overflow = (cfg.scrollable !== false) ? 'auto' : '';

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
    _updateWindowFull(win, config) {
        if (config._window)   this._applyWindowConfig(win, config._window);
        if (config._titleBar) this._updateTitleBar(win, config._titleBar, config);
        if (config._meniu)    this._updateMenu(win, config._meniu);
        if (config._content)  this._updateContent(win, config._content);
    }

    // =========================
    // FUNCTIONS API
    // =========================
    _attachFunctions(cfg = {}, win) {
        win.update        = (newConfig) => this._updateWindowFull(win, newConfig);
        win.updateContent = (c)         => this._updateContent(win, c);
        win.updateMenu    = (c)         => this._updateMenu(win, c);
        win.updateTitleBar= (c)         => this._updateTitleBar(win, c);
        win.updateWindow  = (c)         => this._applyWindowConfig(win, c);
        win.open          = ()          => { win.style.display = 'block'; cfg.onOpen?.(win); };
        win.close         = ()          => { win.remove(); cfg.onClose?.(win); };
    }

    // =========================
    // DRAG
    // =========================
    _makeDraggable(win, handle) {
        let isDragging = false, offsetX = 0, offsetY = 0;

        handle.style.cursor = 'grab';

        handle.addEventListener('mouseenter', () => { if (!isDragging) handle.style.cursor = 'grab'; });
        handle.addEventListener('mouseleave', () => { if (!isDragging) handle.style.cursor = ''; });

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            handle.style.cursor = 'grabbing';
            const rect = win.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            win.style.left = rect.left + 'px';
            win.style.top = rect.top + 'px';
            win.style.transform = 'none';
            win.style.position = 'absolute';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            win.style.left = (e.clientX - offsetX) + 'px';
            win.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'grab';
            }
        });
    }

    /** Tworzy i zwraca przykładowe okno demo */
    async winDemo() {
        const config = {
            _window: {
                idWindow: 'demo_window',
                classWindow: 'app-window',
                size: { width: 500, height: 380 },
                position: 'onCenter',
                visible: true
            },
            _titleBar: {
                visible: true,
                classTitleBar: 'title-bar',
                name: 'Demo Okno',
                icon: '🗃️',
                controls: {
                    minimize: '&#8211;',
                    maximize: '&#9723;',
                    close: '&#10005;'
                },
                onMaximize: (win) => {
                    if (win.classList.contains('maximized')) {
                        win.style.width = '500px';
                        win.style.height = '380px';
                        win.style.top = '50%';
                        win.style.left = '50%';
                        win.style.transform = 'translate(-50%, -50%)';
                    }
                }
            },
            _meniu: {
                visible: true,
                classMeniu: 'menu',
                items: [
                    { name: 'Opcja 1', icon: '🗂️' },
                    {
                        name: 'Opcja 2',
                        icon: '⚙️',
                        submenu: [
                            { name: 'Subopcja 1', icon: '🔧', onClick: () => alert('Wybrano: Subopcja 1') },
                            { name: 'Subopcja 2', icon: '🔩', onClick: () => alert('Wybrano: Subopcja 2') }
                        ]
                    },
                    { name: 'Opcja 3', icon: '❓', onClick: () => alert('Wybrano: Opcja 3') }
                ]
            },
            /** 
            _content: {
                classContent: 'content',
                scrollable: true,
                html: `<h2 style="color:#0078d4;margin-top:0;">Witamy w oknie demo!</h2>
                <p>To jest przykładowa treść okna. Możesz przewijać tę sekcję, jeśli tekstu będzie więcej.<br><br>
                <b>Możliwości okna:</b></p>
                <ul>
                  <li>Przeciąganie za pasek tytułu</li>
                  <li>Menu z podmenu</li>
                  <li>Przyciski: minimalizuj, maksymalizuj, zamknij</li>
                  <li>Przewijana treść</li>
                  <li>Własny styl CSS</li>
                </ul>
                <div style="height:200px;"></div>
                <p>Przewiń, by zobaczyć więcej!</p>`
            },
             */
            _content: {
                classContent: 'content',
                html: `<button id="demo-btn">Załaduj nową treść</button>`,
                script: (content, win) => {
                    content.querySelector('#demo-btn').onclick = () => {
                        win.updateContent({
                            classContent: 'content',
                            html: '<p>Nowa zawartość została załadowana!</p>'
                        });
                    };
                }
            },

            _function: {
                onCreate: () => {},
                onOpen:   () => {},
                onClose:  () => {}
            }
        };

        return this.createWindow(config);
    }
}

export { AppWindow };
