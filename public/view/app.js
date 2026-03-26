/* ════════════════════════════════════════════════════════════
 *  class View
 *  Zarządza WSZYSTKIMI elementami UI:
 *    view.taskbar  – pasek zadań (start, separator, elementy, menu kontekstowe)
 *    view.window   – okno (tytuł, ikona, statusBar)
 *    view.titlebar – przyciski tytułpasek
 *    view.menubar  – górne menu okna
 *    view.content  – zawartość okna (karty, nagłówek)
 * ════════════════════════════════════════════════════════════ */
class View {
    constructor({ taskbarId, containerId }) {
        this._taskbarEl   = document.getElementById(taskbarId);
        this._containerEl = document.getElementById(containerId);
        this._windowEl    = null;   // ustawiany przez window.create()

        // Globalna lista okien i z-index
        if (!window._windowStack) {
            window._windowStack = [];
            window._windowZ = 100;
        }
        if (!window._windowRegistry) window._windowRegistry = [];

        this.taskbar  = this._buildTaskbarModule();
        this.window   = this._buildWindowModule();
        this.titlebar = this._buildTitlebarModule();
        this.menubar  = this._buildMenubarModule();
        this.content  = this._buildContentModule();
    }

    /* ══════════════════════════════════════════════════════════
     *  TASKBAR
     *
     *  refresh({ showStart, items:[{id,icon,title,onClick,menuItems}] })
     *  addItem({ id, icon, title, onClick, menuItems })
     *  removeItem(id)
     *  updateItem(id, { title, icon, onClick, menuItems })
     * ══════════════════════════════════════════════════════════ */
    _buildTaskbarModule() {
        const bar  = this._taskbarEl;
        const self = this;

        /* pomocnicze – tworzy jeden element paska */
        const _makeItem = ({ id, icon, title, onClick, menuItems = [] }) => {
            const wrap = document.createElement('div');
            wrap.className = 'taskbar-item';
            if (id) wrap.dataset.tbId = id;

            const iconEl = document.createElement('div');
            iconEl.className = icon ? 'taskbar-item-icon custom' : 'taskbar-item-icon';
            if (icon) iconEl.textContent = icon;

            const titleEl = document.createElement('span');
            titleEl.className = 'taskbar-item-title';
            titleEl.textContent = title || '';

            wrap.appendChild(iconEl);
            wrap.appendChild(titleEl);

            /* lewy klik */
            wrap.addEventListener('click', e => {
                e.stopPropagation();
                _closeAllMenus();
                if (typeof onClick === 'function') onClick(e);
            });

            /* menu kontekstowe (prawy klik lub jeśli zdefiniowano menuItems) */
            if (menuItems.length) {
                const menu = _buildContextMenu(menuItems, wrap);
                wrap.appendChild(menu);

                wrap.addEventListener('contextmenu', e => {
                    e.preventDefault(); e.stopPropagation();
                    _closeAllMenus();
                    menu.classList.add('open');
                });
            }

            return wrap;
        };

        /* pomocnicze – buduje menu kontekstowe elementu */
        const _buildContextMenu = (items, parent) => {
            const menu = document.createElement('div');
            menu.className = 'taskbar-menu';
            items.forEach(it => {
                if (it === 'separator') {
                    const sep = document.createElement('div');
                    sep.className = 'taskbar-menu-sep';
                    menu.appendChild(sep);
                } else {
                    const mi = document.createElement('div');
                    mi.className = 'taskbar-menu-item';
                    mi.textContent = it.label;
                    mi.addEventListener('click', e => {
                        e.stopPropagation();
                        menu.classList.remove('open');
                        if (typeof it.onClick === 'function') it.onClick(e);
                    });
                    menu.appendChild(mi);
                }
            });
            return menu;
        };

        const _closeAllMenus = () => {
            bar.querySelectorAll('.taskbar-menu.open')
               .forEach(m => m.classList.remove('open'));
        };

        /* globalny klik zamyka menu kontekstowe */
        document.addEventListener('click', _closeAllMenus);

        return {
            /**
             * Pełne odświeżenie paska
             * @param {object} cfg
             * @param {boolean} [cfg.showStart=true]
             * @param {Array}   [cfg.items]
             */
            refresh({ showStart = true, items = [] } = {}) {
                bar.innerHTML = '';

                if (showStart) {
                    const startBtn = document.createElement('button');
                    startBtn.className = 'taskbar-start';
                    startBtn.title = 'Start';
                    startBtn.innerHTML = `
                        <div class="taskbar-start-icon">
                            <span></span><span></span><span></span><span></span>
                        </div>`;
                    startBtn.addEventListener('click', e => e.stopPropagation());
                    bar.appendChild(startBtn);

                    const sep = document.createElement('div');
                    sep.className = 'taskbar-sep';
                    bar.appendChild(sep);
                }

                items.forEach(it => bar.appendChild(_makeItem(it)));

                /* ── prawy obszar: ikona okien + zegar ── */
                const rightSection = document.createElement('div');
                rightSection.className = 'taskbar-right';

                /* przycisk listy otwartych okien */
                const trayBtn = document.createElement('button');
                trayBtn.className = 'taskbar-tray-btn';
                trayBtn.title = 'Otwarte okna';
                trayBtn.textContent = '🪟';

                const windowsMenu = document.createElement('div');
                windowsMenu.className = 'taskbar-windows-menu';
                trayBtn.appendChild(windowsMenu);

                trayBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    /* zbuduj listę dynamicznie przy każdym otwarciu */
                    windowsMenu.innerHTML = '';
                    const registry = (window._windowRegistry || [])
                        .filter(r => r.winEl.style.display !== 'none');
                    if (registry.length === 0) {
                        const empty = document.createElement('div');
                        empty.className = 'taskbar-windows-menu-empty';
                        empty.textContent = 'Brak otwartych okien';
                        windowsMenu.appendChild(empty);
                    } else {
                        registry.forEach(reg => {
                            const item = document.createElement('div');
                            item.className = 'taskbar-windows-menu-item' +
                                (reg.isMinimized ? ' minimized' : '');
                            item.innerHTML =
                                `<span>${reg.icon || '🖥️'}</span>` +
                                `<span>${reg.title}${reg.isMinimized ? ' (zminimalizowane)' : ''}</span>`;
                            item.addEventListener('click', ev => {
                                ev.stopPropagation();
                                windowsMenu.classList.remove('open');
                                if (reg.isMinimized) {
                                    reg.view.window.restore();
                                } else {
                                    reg.winEl.style.zIndex = ++window._windowZ;
                                    reg.winEl.dispatchEvent(new MouseEvent('mousedown'));
                                }
                            });
                            windowsMenu.appendChild(item);
                        });
                    }
                    windowsMenu.classList.toggle('open');
                });

                rightSection.appendChild(trayBtn);

                /* zegar z datą */
                const clockEl = document.createElement('div');
                clockEl.className = 'taskbar-clock';
                const _updateClock = () => {
                    const now  = new Date();
                    const time = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                    const date = now.toLocaleDateString('pl-PL',
                        { day: '2-digit', month: '2-digit', year: 'numeric' });
                    clockEl.innerHTML = `<div>${time}</div><div>${date}</div>`;
                };
                _updateClock();
                if (window._clockInterval) clearInterval(window._clockInterval);
                window._clockInterval = setInterval(_updateClock, 1000);

                rightSection.appendChild(clockEl);
                bar.appendChild(rightSection);

                /* zamknij dropdown po kliknięciu poza nim (usuń stary listener jeśli istnieje) */
                if (window._windowsMenuCloseHandler) {
                    document.removeEventListener('click', window._windowsMenuCloseHandler);
                }
                window._windowsMenuCloseHandler = () => windowsMenu.classList.remove('open');
                document.addEventListener('click', window._windowsMenuCloseHandler);
            },

            /**
             * Dodaje pojedynczy element
             * @param {{ id, icon?, title, onClick, menuItems? }} cfg
             */
            addItem({ id, icon, title, onClick, menuItems = [] } = {}) {
                if (id && bar.querySelector(`[data-tb-id="${id}"]`)) return;
                bar.appendChild(_makeItem({ id, icon, title, onClick, menuItems }));
            },

            /** Usuwa element po id */
            removeItem(id) {
                const el = bar.querySelector(`[data-tb-id="${id}"]`);
                if (el) el.remove();
            },

            /**
             * Aktualizuje element paska
             * @param {string} id
             * @param {{ title?, icon?, onClick?, menuItems? }} cfg
             */
            updateItem(id, { title, icon, onClick, menuItems } = {}) {
                const el = bar.querySelector(`[data-tb-id="${id}"]`);
                if (!el) return;
                if (title !== undefined)
                    el.querySelector('.taskbar-item-title').textContent = title;
                if (icon !== undefined) {
                    const ic = el.querySelector('.taskbar-item-icon');
                    ic.textContent = icon;
                    ic.classList.add('custom');
                }
                /* aktualizacja onClick – klonuj by usunąć stare listenery */
                if (typeof onClick === 'function') {
                    const clone = el.cloneNode(true);
                    clone.addEventListener('click', e => {
                        e.stopPropagation(); _closeAllMenus(); onClick(e);
                    });
                    el.replaceWith(clone);
                }
            }
        };
    }

    /* ══════════════════════════════════════════════════════════
     *  WINDOW
     *
     *  create({ title, icon?, statusText? })
     *  setTitle(title)
     *  setStatus(text)
     *  minimize()
     *  maximize()
     *  restore()
     *  close()
     * ══════════════════════════════════════════════════════════ */
    _buildWindowModule() {
        const container = this._containerEl;
        const self      = this;

        return {
            /**
             * Tworzy szkielet okna i dołącza do kontenera
             * @param {{ title, icon?, statusText? }} cfg
             */
            create({ title = '', icon = null, statusText = 'Gotowe' } = {}) {
                const win = document.createElement('div');
                win.className = 'window';
                win.innerHTML = `
                    <div class="titlebar">
                        <div class="titlebar-left">
                            <div class="window-icon">${icon ? `<span style="font-size:13px">${icon}</span>` : ''}</div>
                            <span class="window-title">${title}</span>
                        </div>
                        <div class="titlebar-controls">
                            <button class="titlebar-button minimize" title="Minimalizuj">
                                <div class="minimize-icon"></div>
                            </button>
                            <button class="titlebar-button maximize" title="Maksymalizuj">
                                <div class="maximize-icon"></div>
                            </button>
                            <button class="titlebar-button close" title="Zamknij">
                                <div class="close-icon"></div>
                            </button>
                        </div>
                    </div>
                    <div class="menubar"></div>
                    <div class="window-content"></div>
                    <div class="status-bar"><span>${statusText}</span></div>`;

                // Ustaw z-index i dodaj do stacka
                win.style.zIndex = ++window._windowZ;
                window._windowStack.push(win);

                // Ustaw pozycję absolutną (dla przesuwania)
                win.style.position = 'absolute';
                win.style.left = '50px';
                win.style.top = '50px';

                // Przeciąganie okna
                let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
                const titlebar = win.querySelector('.titlebar');
                titlebar.style.cursor = 'move';
                titlebar.addEventListener('mousedown', e => {
                    isDragging = true;
                    dragOffsetX = e.clientX - win.offsetLeft;
                    dragOffsetY = e.clientY - win.offsetTop;
                    win.style.transition = 'none';
                    // Na wierzch przy rozpoczęciu przeciągania
                    win.style.zIndex = ++window._windowZ;
                });
                document.addEventListener('mousemove', e => {
                    if (!isDragging) return;
                    win.style.left = (e.clientX - dragOffsetX) + 'px';
                    win.style.top  = (e.clientY - dragOffsetY) + 'px';
                });
                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        win.style.transition = '';
                    }
                });

                // Na wierzch po kliknięciu w okno
                win.addEventListener('mousedown', () => {
                    win.style.zIndex = ++window._windowZ;
                });

                container.appendChild(win);
                self._windowEl = win;

                /* rejestruj w globalnym rejestrze okien */
                window._windowRegistry.push({
                    winEl: win, title, icon, view: self, isMinimized: false
                });

                /* poinformuj submoduły o nowym oknie */
                self._onWindowCreated(win);
            },

            /** Zmienia tytuł okna */
            setTitle(title) {
                if (!self._windowEl) return;
                self._windowEl.querySelector('.window-title').textContent = title;
                /* synchronizuj rejestr */
                const reg = window._windowRegistry.find(r => r.winEl === self._windowEl);
                if (reg) reg.title = title;
            },

            /** Ustawia tekst paska stanu */
            setStatus(text) {
                if (!self._windowEl) return;
                self._windowEl.querySelector('.status-bar span').textContent = text;
            },

            minimize() { self._wmAction('minimize'); },
            maximize() { self._wmAction('maximize'); },
            restore()  { self._wmAction('restore');  },
            close()    { self._wmAction('close');    }
        };
    }

    /* ══════════════════════════════════════════════════════════
     *  TITLEBAR
     *
     *  bindControls({ onMinimize, onMaximize, onClose })
     *  addButton({ id, label, onClick, position? })
     *  removeButton(id)
     * ══════════════════════════════════════════════════════════ */
    _buildTitlebarModule() {
        const self = this;
        return {
            /**
             * Podpina handlery pod przyciski min/max/close
             * @param {{ onMinimize, onMaximize, onClose }} cfg
             */
            bindControls({ onMinimize, onMaximize, onClose } = {}) {
                if (!self._windowEl) return;
                const win = self._windowEl;
                win.querySelector('.minimize').onclick = e => { e.stopPropagation(); onMinimize && onMinimize(e); };
                win.querySelector('.maximize').onclick = e => { e.stopPropagation(); onMaximize && onMaximize(e); };
                win.querySelector('.close').onclick    = e => { e.stopPropagation(); onClose    && onClose(e);    };
            },

            /**
             * Dodaje własny przycisk do paska tytułowego
             * @param {{ id, label, onClick, position?: 'before-controls'|'after-icon' }} cfg
             */
            addButton({ id, label, onClick, position = 'before-controls' } = {}) {
                if (!self._windowEl) return;
                const btn = document.createElement('button');
                btn.className = 'titlebar-button';
                btn.title = label;
                if (id) btn.dataset.tbtnId = id;
                btn.innerHTML = `<span style="font-size:14px">${label}</span>`;
                btn.addEventListener('click', e => { e.stopPropagation(); onClick && onClick(e); });

                const controls = self._windowEl.querySelector('.titlebar-controls');
                if (position === 'before-controls') {
                    self._windowEl.querySelector('.titlebar').insertBefore(btn, controls);
                } else {
                    controls.insertBefore(btn, controls.firstChild);
                }
            },

            /** Usuwa przycisk po data-tbtn-id */
            removeButton(id) {
                if (!self._windowEl) return;
                const btn = self._windowEl.querySelector(`[data-tbtn-id="${id}"]`);
                if (btn) btn.remove();
            }
        };
    }

    /* ══════════════════════════════════════════════════════════
     *  MENUBAR
     *
     *  refresh({ menus:[{ label, id, items:[...] }] })
     *  addMenu({ label, id, items, position? })
     *  removeMenu(id)
     *  addMenuItem(menuId, item)
     *  removeMenuItem(menuId, itemId)
     *
     *  item = { id?, icon?, label, shortcut?, disabled?, separator?, submenu?, onClick }
     * ══════════════════════════════════════════════════════════ */
    _buildMenubarModule() {
        const self = this;
        let _activeMenu = null;

        const _getMenubar = () => self._windowEl && self._windowEl.querySelector('.menubar');

        /* buduje listę pozycji dropdown */
        const _buildItems = (items, container) => {
            items.forEach(it => {
                if (it.separator) {
                    const sep = document.createElement('div');
                    sep.className = 'dropdown-separator';
                    container.appendChild(sep); return;
                }
                const el = document.createElement('div');
                el.className = 'dropdown-item' + (it.disabled ? ' disabled' : '');
                if (it.id) el.dataset.miId = it.id;

                let html = '';
                if (it.icon) html += `<span class="dropdown-item-icon">${it.icon}</span>`;
                html += it.label || '';
                if (it.shortcut) html += `<span class="dropdown-item-shortcut">${it.shortcut}</span>`;
                if (it.submenu)  html += `<span class="submenu-indicator">▶</span>`;
                el.innerHTML = html;

                if (it.submenu) {
                    const sub = document.createElement('div');
                    sub.className = 'submenu';
                    _buildItems(it.submenu, sub);
                    el.appendChild(sub);
                } else if (!it.disabled && typeof it.onClick === 'function') {
                    el.addEventListener('click', e => {
                        e.stopPropagation();
                        _closeMenus();
                        it.onClick(e);
                        self.window.setStatus(`Wykonano: ${it.label}`);
                    });
                }
                container.appendChild(el);
            });
        };

        /* tworzy element .menu-item z dropdown */
        const _makeMenu = ({ label, id, items = [] }) => {
            const mi = document.createElement('div');
            mi.className = 'menu-item';
            if (id) mi.dataset.menuId = id;
            mi.textContent = label;

            const drop = document.createElement('div');
            drop.className = 'dropdown-menu';
            _buildItems(items, drop);
            drop.addEventListener('click', e => e.stopPropagation());
            mi.appendChild(drop);

            mi.addEventListener('click', e => {
                e.stopPropagation();
                if (_activeMenu === mi) { mi.classList.remove('active'); _activeMenu = null; }
                else { _closeMenus(); mi.classList.add('active'); _activeMenu = mi; }
            });
            mi.addEventListener('mouseenter', () => {
                if (_activeMenu && _activeMenu !== mi) {
                    _closeMenus(); mi.classList.add('active'); _activeMenu = mi;
                }
            });
            return mi;
        };

        const _closeMenus = () => {
            _getMenubar() && _getMenubar().querySelectorAll('.menu-item.active')
                .forEach(m => m.classList.remove('active'));
            _activeMenu = null;
        };

        document.addEventListener('click', _closeMenus);

        return {
            /** Pełne odświeżenie menu */
            refresh({ menus = [] } = {}) {
                const mb = _getMenubar(); if (!mb) return;
                mb.innerHTML = '';
                menus.forEach(m => mb.appendChild(_makeMenu(m)));
            },

            /**
             * Dodaje nowe menu
             * @param {{ label, id, items, position?: number|'first'|'last' }} cfg
             */
            addMenu({ label, id, items = [], position = 'last' } = {}) {
                const mb = _getMenubar(); if (!mb) return;
                const el = _makeMenu({ label, id, items });
                const existing = mb.querySelectorAll('.menu-item');
                if (position === 'first') mb.insertBefore(el, mb.firstChild);
                else if (position === 'last' || position >= existing.length) mb.appendChild(el);
                else mb.insertBefore(el, existing[position]);
            },

            /** Usuwa menu po data-menu-id */
            removeMenu(id) {
                const mb = _getMenubar(); if (!mb) return;
                const el = mb.querySelector(`[data-menu-id="${id}"]`);
                if (el) el.remove();
            },

            /**
             * Dodaje pozycję do istniejącego menu
             * @param {string} menuId
             * @param {object} item  – { id?, icon?, label, shortcut?, disabled?, separator?, submenu?, onClick }
             */
            addMenuItem(menuId, item) {
                const mb = _getMenubar(); if (!mb) return;
                const menu = mb.querySelector(`[data-menu-id="${menuId}"] .dropdown-menu`);
                if (!menu) return;
                const tmp = document.createElement('div');
                _buildItems([item], tmp);
                [...tmp.children].forEach(c => menu.appendChild(c));
            },

            /**
             * Usuwa pozycję z menu po data-mi-id
             * @param {string} menuId
             * @param {string} itemId
             */
            removeMenuItem(menuId, itemId) {
                const mb = _getMenubar(); if (!mb) return;
                const el = mb.querySelector(
                    `[data-menu-id="${menuId}"] .dropdown-menu [data-mi-id="${itemId}"]`
                );
                if (el) el.remove();
            }
        };
    }

    /* ══════════════════════════════════════════════════════════
     *  CONTENT
     *
     *  refresh({ header, subheader, cards:[{title,text}] })
     *  setHeader(text)
     *  setSubheader(text)
     *  addCard({ id, title, text })
     *  removeCard(id)
     *  updateCard(id, { title?, text? })
     * ══════════════════════════════════════════════════════════ */
    _buildContentModule() {
        const self = this;
        const _getContent = () => self._windowEl && self._windowEl.querySelector('.window-content');

        const _makeCard = ({ id, title, text }) => {
            const card = document.createElement('div');
            card.className = 'card';
            if (id) card.dataset.cardId = id;
            card.innerHTML = `<div class="card-title">${title}</div>
                              <div class="card-text">${text}</div>`;
            return card;
        };

        return {
            /** Pełne odświeżenie zawartości */
            refresh({ header = '', subheader = '', cards = [] } = {}) {
                const c = _getContent(); if (!c) return;
                c.innerHTML = '';
                if (header) {
                    const h = document.createElement('div');
                    h.className = 'content-header'; h.textContent = header;
                    c.appendChild(h);
                }
                if (subheader) {
                    const s = document.createElement('div');
                    s.className = 'content-subheader'; s.textContent = subheader;
                    c.appendChild(s);
                }
                cards.forEach(card => c.appendChild(_makeCard(card)));
            },

            setHeader(text) {
                const c = _getContent(); if (!c) return;
                let h = c.querySelector('.content-header');
                if (!h) { h = document.createElement('div'); h.className = 'content-header'; c.prepend(h); }
                h.textContent = text;
            },

            setSubheader(text) {
                const c = _getContent(); if (!c) return;
                let s = c.querySelector('.content-subheader');
                if (!s) {
                    s = document.createElement('div'); s.className = 'content-subheader';
                    const h = c.querySelector('.content-header');
                    h ? h.after(s) : c.prepend(s);
                }
                s.textContent = text;
            },

            addCard({ id, title = '', text = '' } = {}) {
                const c = _getContent(); if (!c) return;
                c.appendChild(_makeCard({ id, title, text }));
            },

            removeCard(id) {
                const c = _getContent(); if (!c) return;
                const card = c.querySelector(`[data-card-id="${id}"]`);
                if (card) card.remove();
            },

            updateCard(id, { title, text } = {}) {
                const c = _getContent(); if (!c) return;
                const card = c.querySelector(`[data-card-id="${id}"]`);
                if (!card) return;
                if (title !== undefined) card.querySelector('.card-title').textContent = title;
                if (text  !== undefined) card.querySelector('.card-text').textContent  = text;
            }
        };
    }

    /* ══════════════════════════════════════════════════════════
     *  _onWindowCreated – odpala się po create(), podpina
     *  wewnętrzne mechanizmy WindowManagera
     * ══════════════════════════════════════════════════════════ */
    _onWindowCreated(win) {
        /* WindowManager podpinamy przez view.titlebar.bindControls()
           – dlatego tu nic nie robimy, inicjalizacja jest w kodzie użytkownika */
    }

    /* ══════════════════════════════════════════════════════════
     *  WindowManager – wewnętrzna logika min/max/restore/close
     * ══════════════════════════════════════════════════════════ */
    _wmAction(action) {
        const win  = this._windowEl;
        if (!win) return;

        const _state = win._wmState || (win._wmState = { maximized: false, minimized: false });
        const container = this._containerEl;

        if (action === 'minimize') {
            if (_state.minimized) { this._wmAction('restore'); return; }
            win.classList.remove('maximized');
            win.classList.add('minimized');
            document.body.classList.remove('window-maximized');
            _state.minimized = true;
            _state.maximized = false;

            /* zaktualizuj rejestr */
            const regMin = window._windowRegistry.find(r => r.winEl === win);
            if (regMin) regMin.isMinimized = true;

        } else if (action === 'maximize') {
            if (_state.maximized) { this._wmAction('restore'); return; }
            win.classList.remove('minimized');
            win.classList.add('maximized');
            document.body.classList.add('window-maximized');
            _state.maximized = true;
            _state.minimized = false;

            // Zapamiętaj poprzednie pozycje i rozmiar
            if (!_state.prev) {
                _state.prev = {
                    left: win.style.left,
                    top: win.style.top,
                    width: win.style.width,
                    height: win.style.height
                };
            }
            // Ustaw na pełny kontener
            win.style.left = '0px';
            win.style.top = '0px';
            win.style.width = container.offsetWidth + 'px';
            win.style.height = container.offsetHeight + 'px';

        } else if (action === 'restore') {
            win.classList.remove('minimized', 'maximized');
            document.body.classList.remove('window-maximized');
            _state.maximized = false;
            _state.minimized = false;

            /* zaktualizuj rejestr */
            const regRes = window._windowRegistry.find(r => r.winEl === win);
            if (regRes) regRes.isMinimized = false;

            // Przywróć poprzednie pozycje i rozmiar
            if (_state.prev) {
                win.style.left = _state.prev.left;
                win.style.top = _state.prev.top;
                win.style.width = _state.prev.width;
                win.style.height = _state.prev.height;
                _state.prev = null;
            } else {
                this._updateSize();
            }

        } else if (action === 'close') {
            win.classList.add('closing');
            setTimeout(() => { win.style.display = 'none'; }, 300);
            /* usuń z globalnego rejestru */
            window._windowRegistry = window._windowRegistry.filter(r => r.winEl !== win);
        }
    }

    _updateSize() {
        const win = this._windowEl; if (!win) return;
        const s = win._wmState || {};
        if (s.maximized) {
            win.style.width = '100vw'; win.style.height = '100vh';
        } else {
            win.style.width  = `${Math.min(900, window.innerWidth  - 40)}px`;
            win.style.height = `${Math.min(600, window.innerHeight - 40)}px`;
        }
    }

    isMinimized() {
        return this._windowEl && !!(this._windowEl._wmState || {}).minimized;
    }
    isMaximized() {
        return this._windowEl && !!(this._windowEl._wmState || {}).maximized;
    }
}

/* ════════════════════════════════════════════════════════════
 *  class WindowManager
 *  Zarządza wieloma oknami za pomocą unikalnego windowId.
 *  Każda operacja przyjmuje windowId jako pierwszy parametr.
 *
 *  Tworzenie/usuwanie okna:
 *    wm.create(id, { title, icon?, statusText? })   → View
 *    wm.close(id)
 *    wm.getView(id)                                 → View | null
 *
 *  Stan okna:
 *    wm.setTitle(id, title)
 *    wm.setStatus(id, text)
 *    wm.minimize(id)
 *    wm.maximize(id)
 *    wm.restore(id)
 *    wm.isMinimized(id)                             → boolean
 *    wm.isMaximized(id)                             → boolean
 *
 *  Pasek tytułu:
 *    wm.bindControls(id, { onMinimize, onMaximize, onClose })
 *    wm.addButton(id, { id, label, onClick, position? })
 *    wm.removeButton(id, btnId)
 *
 *  Zawartość okna:
 *    wm.refreshContent(id, { header, subheader, cards })
 *    wm.setHeader(id, text)
 *    wm.setSubheader(id, text)
 *    wm.addCard(id, { id, title, text })
 *    wm.removeCard(id, cardId)
 *    wm.updateCard(id, cardId, { title?, text? })
 *
 *  Menubar okna:
 *    wm.refreshMenubar(id, menus)
 *    wm.addMenu(id, { label, id, items, position? })
 *    wm.removeMenu(id, menuId)
 *    wm.addMenuItem(id, menuId, item)
 *    wm.removeMenuItem(id, menuId, itemId)
 * ════════════════════════════════════════════════════════════ */
class WindowManager {
    constructor({ containerId = 'windowContainer', taskbarId = 'taskbar' } = {}) {
        this._containerId = containerId;
        this._taskbarId   = taskbarId;
        this._windows     = new Map(); // windowId → View
    }

    /** Tworzy nowe okno; zwraca instancję View lub null jeśli id już zajęte */
    create(windowId, { title = '', icon = null, statusText = 'Gotowe' } = {}) {
        if (this._windows.has(windowId)) {
            console.warn(`WindowManager: okno "${windowId}" już istnieje.`);
            return null;
        }
        const v = new View({ taskbarId: this._taskbarId, containerId: this._containerId });
        v.window.create({ title, icon, statusText });
        v.titlebar.bindControls({
            onMinimize: () => v.window.minimize(),
            onMaximize: () => { if (v.isMaximized()) v.window.restore(); else v.window.maximize(); },
            onClose:    () => { v.window.close(); this._windows.delete(windowId); }
        });
        this._windows.set(windowId, v);

        /* resize wszystkich okien przy zmianie rozmiaru przeglądarki */
        if (!window._wm) window._wm = { resizeRegistered: false, instances: [] };
        if (!window._wm.resizeRegistered) {
            window._wm.resizeRegistered = true;
            window.addEventListener('resize', () => {
                window._wm.instances.forEach(wm =>
                    wm._windows.forEach(view => { if (!view.isMaximized()) view._updateSize(); })
                );
            });
        }
        if (!window._wm.instances.includes(this)) {
            window._wm.instances.push(this);
        }

        return v;
    }

    /** Zwraca instancję View dla danego ID lub null */
    getView(windowId) { return this._windows.get(windowId) || null; }

    _get(windowId) {
        const v = this._windows.get(windowId);
        if (!v) console.warn(`WindowManager: brak okna "${windowId}".`);
        return v || null;
    }

    /* ── operacje na oknie ────────────────────────────────── */
    setTitle(windowId, title)  { this._get(windowId)?.window.setTitle(title); }
    setStatus(windowId, text)  { this._get(windowId)?.window.setStatus(text); }
    minimize(windowId)         { this._get(windowId)?.window.minimize(); }
    maximize(windowId)         { this._get(windowId)?.window.maximize(); }
    restore(windowId)          { this._get(windowId)?.window.restore(); }
    close(windowId)            {
        const v = this._get(windowId);
        if (v) { v.window.close(); this._windows.delete(windowId); }
    }
    isMinimized(windowId)      { return this._get(windowId)?.isMinimized() ?? null; }
    isMaximized(windowId)      { return this._get(windowId)?.isMaximized() ?? null; }

    /* ── pasek tytułu ─────────────────────────────────────── */
    bindControls(windowId, handlers = {}) { this._get(windowId)?.titlebar.bindControls(handlers); }
    addButton(windowId, cfg)              { this._get(windowId)?.titlebar.addButton(cfg); }
    removeButton(windowId, btnId)         { this._get(windowId)?.titlebar.removeButton(btnId); }

    /* ── zawartość ────────────────────────────────────────── */
    refreshContent(windowId, cfg)              { this._get(windowId)?.content.refresh(cfg); }
    setHeader(windowId, text)                  { this._get(windowId)?.content.setHeader(text); }
    setSubheader(windowId, text)               { this._get(windowId)?.content.setSubheader(text); }
    addCard(windowId, cfg)                     { this._get(windowId)?.content.addCard(cfg); }
    removeCard(windowId, cardId)               { this._get(windowId)?.content.removeCard(cardId); }
    updateCard(windowId, cardId, cfg)          { this._get(windowId)?.content.updateCard(cardId, cfg); }

    /* ── menubar ──────────────────────────────────────────── */
    refreshMenubar(windowId, menus)             { this._get(windowId)?.menubar.refresh({ menus }); }
    addMenu(windowId, cfg)                      { this._get(windowId)?.menubar.addMenu(cfg); }
    removeMenu(windowId, menuId)                { this._get(windowId)?.menubar.removeMenu(menuId); }
    addMenuItem(windowId, menuId, item)         { this._get(windowId)?.menubar.addMenuItem(menuId, item); }
    removeMenuItem(windowId, menuId, itemId)    { this._get(windowId)?.menubar.removeMenuItem(menuId, itemId); }
}

/* ════════════════════════════════════════════════════════════
 *  class TaskbarManager
 *  Zarządza paskiem zadań przez ID elementów.
 *
 *  Pełne odświeżenie:
 *    tb.refresh({ showStart?, items? })
 *
 *  Operacje na elementach (zawsze po id):
 *    tb.addItem(id, { icon?, title, onClick, menuItems? })
 *    tb.removeItem(id)
 *    tb.updateItem(id, { title?, icon?, onClick?, menuItems? })
 * ════════════════════════════════════════════════════════════ */
class TaskbarManager {
    constructor({ taskbarId = 'taskbar', containerId = 'windowContainer' } = {}) {
        this._view = new View({ taskbarId, containerId });
        this._tb   = this._view.taskbar;
    }

    refresh(cfg = {})        { this._tb.refresh(cfg); }
    addItem(id, cfg = {})    { this._tb.addItem({ id, ...cfg }); }
    removeItem(id)           { this._tb.removeItem(id); }
    updateItem(id, cfg = {}) { this._tb.updateItem(id, cfg); }
}

/* ════════════════════════════════════════════════════════════
 *  INICJALIZACJA
 * ════════════════════════════════════════════════════════════ */

/* ── 1. Taskbar ── */
const taskbar = new TaskbarManager({ taskbarId: 'taskbar' });
taskbar.refresh({ showStart: true, items: [] });

/* ── 2. WindowManager + pierwsze okno ── */
const wm = new WindowManager({ containerId: 'windowContainer', taskbarId: 'taskbar' });
wm.create('win-main', { title: 'Moja Aplikacja - Windows 11', statusText: 'Gotowe' });

/* ── 3. Menubar głównego okna ── */
wm.refreshMenubar('win-main', [
    {
        label: 'Plik', id: 'menu-file',
        items: [
            { id: 'mi-new',    icon: '📄', label: 'Nowy',           shortcut: 'Ctrl+N', onClick: () => {} },
            { id: 'mi-open',   icon: '📂', label: 'Otwórz',         shortcut: 'Ctrl+O', onClick: () => {} },
            { id: 'mi-save',   icon: '💾', label: 'Zapisz',         shortcut: 'Ctrl+S', onClick: () => {} },
            { id: 'mi-saveas', icon: '📝', label: 'Zapisz jako...', shortcut: 'Ctrl+Shift+S', onClick: () => {} },
            { separator: true },
            { id: 'mi-print',  icon: '🖨️', label: 'Drukuj',         shortcut: 'Ctrl+P', onClick: () => {} },
            { separator: true },
            { id: 'mi-close',  icon: '❌', label: 'Zamknij',        shortcut: 'Alt+F4',
              onClick: () => wm.close('win-main') }
        ]
    },
    {
        label: 'Edycja', id: 'menu-edit',
        items: [
            { id: 'mi-undo',  icon: '↶', label: 'Cofnij',  shortcut: 'Ctrl+Z', onClick: () => {} },
            { id: 'mi-redo',  icon: '↷', label: 'Ponów',   shortcut: 'Ctrl+Y', onClick: () => {} },
            { separator: true },
            { id: 'mi-cut',   icon: '✂️', label: 'Wytnij',  shortcut: 'Ctrl+X', onClick: () => {} },
            { id: 'mi-copy',  icon: '📋', label: 'Kopiuj',  shortcut: 'Ctrl+C', onClick: () => {} },
            { id: 'mi-paste', icon: '📄', label: 'Wklej',   shortcut: 'Ctrl+V', onClick: () => {} },
            { separator: true },
            {
                id: 'mi-find', icon: '🔍', label: 'Znajdź',
                submenu: [
                    { icon: '🔎', label: 'Znajdź w dokumencie', shortcut: 'Ctrl+F',   onClick: () => {} },
                    { icon: '🔄', label: 'Znajdź i zamień',     shortcut: 'Ctrl+H',   onClick: () => {} },
                    { icon: '⏭️', label: 'Znajdź następny',     shortcut: 'F3',       onClick: () => {} },
                    { icon: '⏮️', label: 'Znajdź poprzedni',    shortcut: 'Shift+F3', onClick: () => {} },
                ]
            },
            {
                id: 'mi-prefs', icon: '⚙️', label: 'Preferencje',
                submenu: [
                    { icon: '🎨', label: 'Motyw',              onClick: () => {} },
                    { icon: '🔤', label: 'Czcionki',           onClick: () => {} },
                    { icon: '⌨️', label: 'Skróty klawiszowe', onClick: () => {} },
                    { separator: true },
                    { icon: '🌍', label: 'Język',              onClick: () => {} },
                ]
            }
        ]
    },
    {
        label: 'Widok', id: 'menu-view',
        items: [
            { icon: '📊', label: 'Pasek narzędzi', onClick: () => {} },
            { icon: '📏', label: 'Linijka',        onClick: () => {} },
            { separator: true },
            { icon: '🔍', label: 'Powiększ',       shortcut: 'Ctrl++', onClick: () => {} },
            { icon: '🔎', label: 'Pomniejsz',      shortcut: 'Ctrl+-', onClick: () => {} },
        ]
    },
    {
        label: 'Pomoc', id: 'menu-help',
        items: [
            { icon: '📖', label: 'Dokumentacja', shortcut: 'F1', onClick: () => {} },
            { icon: 'ℹ️', label: 'O programie',                  onClick: () => {
                wm.setStatus('win-main', 'Windows 11 – wersja 1.0.0');
            }}
        ]
    }
]);

/* ── 4. Zawartość głównego okna ── */
wm.refreshContent('win-main', {
    header:    'Witaj w Windows 11',
    subheader: 'Nowoczesny interfejs z pełnym menu kontekstowym',
    cards: [
        { id: 'card-menu',    title: '🎨 Menu górne',
          text: 'Kliknij na elementy menu na górze okna, aby zobaczyć rozwijane opcje. Menu zawiera podmenu z dodatkowymi opcjami.' },
        { id: 'card-fluent',  title: '✨ Fluent Design',
          text: 'Menu zostało zaprojektowane w stylu Windows 11 z efektem Acrylic, zaokrąglonymi rogami i płynnymi animacjami.' },
        { id: 'card-interact',title: '⚡ Interaktywność',
          text: 'Najedź myszką na opcje ze strzałką (▶), aby zobaczyć dodatkowe podmenu. Wszystko działa płynnie i responsywnie.' },
    ]
});

/*
 ════════════════════════════════════════════════════════════
  PRZYKŁADY UŻYCIA – wklej w konsolę przeglądarki (F12)
 ════════════════════════════════════════════════════════════

  ── WindowManager ──────────────────────────────────────────

  // Utwórz nowe okno:
  wm.create('win-notes', { title: 'Notatnik', icon: '📝', statusText: 'Nowy dokument' });

  // Utwórz drugie okno z własnym menu:
  wm.create('win-calc', { title: 'Kalkulator', icon: '🧮', statusText: 'Gotowe' });
  wm.refreshMenubar('win-calc', [
      { label: 'Widok', id: 'calc-view', items: [
          { icon: '🔢', label: 'Standardowy', onClick: () => wm.setStatus('win-calc', 'Tryb standardowy') },
          { icon: '📐', label: 'Naukowy',     onClick: () => wm.setStatus('win-calc', 'Tryb naukowy') }
      ]}
  ]);

  // Zmień tytuł okna:
  wm.setTitle('win-notes', 'Notatnik – plik.txt');

  // Zmień tekst paska stanu:
  wm.setStatus('win-notes', 'Plik zapisany pomyślnie');

  // Dodaj kartę do zawartości:
  wm.addCard('win-notes', { id: 'card-1', title: '📄 Dokument', text: 'Treść dokumentu.' });

  // Zaktualizuj kartę:
  wm.updateCard('win-notes', 'card-1', { title: '📄 Dokument (zmodyfikowany)', text: 'Nowa treść.' });

  // Usuń kartę:
  wm.removeCard('win-notes', 'card-1');

  // Odśwież całą zawartość okna:
  wm.refreshContent('win-notes', {
      header: 'Notatnik', subheader: 'Wersja 2.0',
      cards: [{ id: 'c1', title: 'Info', text: 'Nowa zawartość.' }]
  });

  // Dodaj pozycję do istniejącego menu:
  wm.addMenuItem('win-main', 'menu-file', { icon: '📤', label: 'Eksportuj', onClick: () => alert('Eksport!') });

  // Usuń pozycję z menu:
  wm.removeMenuItem('win-main', 'menu-file', 'mi-print');

  // Dodaj nowe menu do okna:
  wm.addMenu('win-main', { label: 'Narzędzia', id: 'menu-tools', items: [
      { icon: '🔧', label: 'Ustawienia', onClick: () => {} }
  ]});

  // Usuń menu z okna:
  wm.removeMenu('win-main', 'menu-view');

  // Dodaj przycisk do paska tytułowego:
  wm.addButton('win-notes', { id: 'btn-pin', label: '📌', onClick: () => alert('Przypięto!') });

  // Usuń przycisk:
  wm.removeButton('win-notes', 'btn-pin');

  // Minimalizuj / maksymalizuj / przywróć / zamknij okno:
  wm.minimize('win-notes');
  wm.maximize('win-notes');
  wm.restore('win-notes');
  wm.close('win-notes');

  // Sprawdź stan okna:
  wm.isMinimized('win-main');   // → true / false
  wm.isMaximized('win-main');   // → true / false

  // Dostęp do pełnego obiektu View (dla zaawansowanych operacji):
  const v = wm.getView('win-main');
  v.content.addCard({ id: 'extra', title: 'Extra', text: 'Bezpośredni dostęp do View.' });

  ── TaskbarManager ─────────────────────────────────────────

  // Pełne odświeżenie paska (resetuje wszystkie elementy):
  taskbar.refresh({ showStart: true, items: [
      { id: 'tb-notes', icon: '📝', title: 'Notatnik',   onClick: () => wm.restore('win-notes') },
      { id: 'tb-calc',  icon: '🧮', title: 'Kalkulator', onClick: () => wm.restore('win-calc')  }
  ]});

  // Dodaj element do paska:
  taskbar.addItem('tb-notes', {
      icon: '📝', title: 'Notatnik',
      onClick: () => wm.restore('win-notes'),
      menuItems: [
          { label: 'Przywróć',    onClick: () => wm.restore('win-notes')  },
          { label: 'Minimalizuj', onClick: () => wm.minimize('win-notes') },
          'separator',
          { label: 'Zamknij',     onClick: () => wm.close('win-notes')    }
      ]
  });

  // Zaktualizuj tytuł elementu paska:
  taskbar.updateItem('tb-notes', { title: 'Notatnik *' });

  // Usuń element z paska:
  taskbar.removeItem('tb-notes');

  ── Pełny przykład – dwa okna z paskiem zadań ──────────────

  wm.create('win-a', { title: 'Okno A', icon: '🟦', statusText: 'Gotowe' });
  wm.create('win-b', { title: 'Okno B', icon: '🟩', statusText: 'Gotowe' });

  wm.refreshContent('win-a', { header: 'Okno A', cards: [
      { id: 'ca1', title: 'Karta 1', text: 'Zawartość okna A.' }
  ]});
  wm.refreshContent('win-b', { header: 'Okno B', cards: [
      { id: 'cb1', title: 'Karta 1', text: 'Zawartość okna B.' }
  ]});

  taskbar.addItem('tb-a', { icon: '🟦', title: 'Okno A',
      onClick: () => wm.restore('win-a'),
      menuItems: [
          { label: 'Minimalizuj', onClick: () => wm.minimize('win-a') },
          { label: 'Maksymalizuj', onClick: () => wm.maximize('win-a') },
          'separator',
          { label: 'Zamknij', onClick: () => { wm.close('win-a'); taskbar.removeItem('tb-a'); } }
      ]
  });
  taskbar.addItem('tb-b', { icon: '🟩', title: 'Okno B',
      onClick: () => wm.restore('win-b'),
      menuItems: [
          { label: 'Minimalizuj', onClick: () => wm.minimize('win-b') },
          { label: 'Maksymalizuj', onClick: () => wm.maximize('win-b') },
          'separator',
          { label: 'Zamknij', onClick: () => { wm.close('win-b'); taskbar.removeItem('tb-b'); } }
      ]
  });

*/
