/* ════════════════════════════════════════════════════════════
 *  PRZYKŁADY UŻYCIA – wklej w konsolę przeglądarki (F12)
 * ════════════════════════════════════════════════════════════

  ── WindowManager ──────────────────────────────────────────

  // Utwórz nowe okno:
  view.create('win-notes', { title: 'Notatnik', icon: '📝', statusText: 'Nowy dokument' });

  // Utwórz drugie okno z własnym menu:
  view.create('win-calc', { title: 'Kalkulator', icon: '🧮', statusText: 'Gotowe' });
  view.refreshMenubar('win-calc', [
      { label: 'Widok', id: 'calc-view', items: [
          { icon: '🔢', label: 'Standardowy', onClick: () => view.setStatus('win-calc', 'Tryb standardowy') },
          { icon: '📐', label: 'Naukowy',     onClick: () => view.setStatus('win-calc', 'Tryb naukowy') }
      ]}
  ]);

  // Zmień tytuł okna:
  view.setTitle('win-notes', 'Notatnik – plik.txt');

  // Zmień tekst paska stanu:
  view.setStatus('win-notes', 'Plik zapisany pomyślnie');

  // Dodaj kartę do zawartości:
  view.addCard('win-notes', { id: 'card-1', title: '📄 Dokument', text: 'Treść dokumentu.' });

  // Zaktualizuj kartę:
  view.updateCard('win-notes', 'card-1', { title: '📄 Dokument (zmodyfikowany)', text: 'Nowa treść.' });

  // Usuń kartę:
  view.removeCard('win-notes', 'card-1');

  // Odśwież całą zawartość okna:
  view.refreshContent('win-notes', {
      header: 'Notatnik', subheader: 'Wersja 2.0',
      cards: [{ id: 'c1', title: 'Info', text: 'Nowa zawartość.' }]
  });

  // Dodaj pozycję do istniejącego menu:
  view.addMenuItem('win-main', 'menu-file', { icon: '📤', label: 'Eksportuj', onClick: () => alert('Eksport!') });

  // Usuń pozycję z menu:
  view.removeMenuItem('win-main', 'menu-file', 'mi-print');

  // Dodaj nowe menu do okna:
  view.addMenu('win-main', { label: 'Narzędzia', id: 'menu-tools', items: [
      { icon: '🔧', label: 'Ustawienia', onClick: () => {} }
  ]});

  // Usuń menu z okna:
  view.removeMenu('win-main', 'menu-view');

  // Dodaj przycisk do paska tytułowego:
  view.addButton('win-notes', { id: 'btn-pin', label: '📌', onClick: () => alert('Przypięto!') });

  // Usuń przycisk:
  view.removeButton('win-notes', 'btn-pin');

  // Minimalizuj / maksymalizuj / przywróć / zamknij okno:
  view.minimize('win-notes');
  view.maximize('win-notes');
  view.restore('win-notes');
  view.close('win-notes');

  // Sprawdź stan okna:
  view.isMinimized('win-main');   // → true / false
  view.isMaximized('win-main');   // → true / false

  // Dostęp do pełnego obiektu View (dla zaawansowanych operacji):
  const v = view.getView('win-main');
  v.content.addCard({ id: 'extra', title: 'Extra', text: 'Bezpośredni dostęp do View.' });

  ── TaskbarManager ─────────────────────────────────────────

  // Pełne odświeżenie paska (resetuje wszystkie elementy):
  taskbar.refresh({ showStart: true, items: [
      { id: 'tb-notes', icon: '📝', title: 'Notatnik',   onClick: () => view.restore('win-notes') },
      { id: 'tb-calc',  icon: '🧮', title: 'Kalkulator', onClick: () => view.restore('win-calc')  }
  ]});

  // Dodaj element do paska:
  taskbar.addItem('tb-notes', {
      icon: '📝', title: 'Notatnik',
      onClick: () => view.restore('win-notes'),
      menuItems: [
          { label: 'Przywróć',    onClick: () => view.restore('win-notes')  },
          { label: 'Minimalizuj', onClick: () => view.minimize('win-notes') },
          'separator',
          { label: 'Zamknij',     onClick: () => view.close('win-notes')    }
      ]
  });

  // Zaktualizuj tytuł elementu paska:
  taskbar.updateItem('tb-notes', { title: 'Notatnik *' });

  // Usuń element z paska:
  taskbar.removeItem('tb-notes');

  // Ustaw pozycję paska zadań:
  taskbar.setPosition('bottom'); // 'bottom' | 'top' | 'left' | 'right'
  // Przy zmianie pozycji na 'left' lub 'right' elementy paska automatycznie
  // ustawiają się pionowo, a menu otwiera się po właściwej stronie.

  // Włącz / wyłącz automatyczne ukrywanie paska zadań:
  // Gdy włączone – pasek chowa się i okna zajmują cały ekran;
  // po najechaniu myszą (lub dotknięciu na urządzeniach dotykowych) pasek
  // wysuwa się, a okna zmniejszają się automatycznie.
  taskbar.setAutoHide(true);
  taskbar.setAutoHide(false);
  taskbar.toggleAutoHide();

  // Całkowite ukrycie / pokazanie paska zadań:
  // hide() – pasek znika, okna automatycznie zajmują całą dostępną przestrzeń.
  // show() – pasek wraca, okna automatycznie zwalniają dla niego miejsce.
  taskbar.hide();
  taskbar.show();

  // ── Menu Start – dodawanie pozycji do przycisku Start ──────

  // Odśwież całe menu Start (zastępuje poprzednie pozycje):
  taskbar.refreshStartMenu([
      { id: 'sm-notes',    icon: '📝', label: 'Notatnik',    onClick: () => view.restore('win-notes') },
      { id: 'sm-calc',     icon: '🧮', label: 'Kalkulator',  onClick: () => view.restore('win-calc')  },
      'separator',
      { id: 'sm-settings', icon: '⚙️', label: 'Ustawienia',  onClick: () => alert('Ustawienia') },
      { id: 'sm-off',      icon: '⏻',  label: 'Wyłącz',      disabled: true }
  ]);

  // Dodaj pojedynczą pozycję do menu Start:
  taskbar.addStartMenuItem({ id: 'sm-browser', icon: '🌐', label: 'Przeglądarka', onClick: () => alert('Przeglądarka') });

  // Dodaj separator:
  taskbar.addStartMenuItem('separator');

  // Usuń pozycję z menu Start po id:
  taskbar.removeStartMenuItem('sm-browser');

  // ── Pełny przykład – dwa okna z paskiem zadań ──────────────

  view.create('win-a', { title: 'Okno A', icon: '🟦', statusText: 'Gotowe' });
  view.create('win-b', { title: 'Okno B', icon: '🟩', statusText: 'Gotowe' });

  view.refreshContent('win-a', { header: 'Okno A', cards: [
      { id: 'ca1', title: 'Karta 1', text: 'Zawartość okna A.' }
  ]});
  view.refreshContent('win-b', { header: 'Okno B', cards: [
      { id: 'cb1', title: 'Karta 1', text: 'Zawartość okna B.' }
  ]});

  taskbar.addItem('tb-a', { icon: '🟦', title: 'Okno A',
      onClick: () => view.restore('win-a'),
      menuItems: [
          { label: 'Minimalizuj', onClick: () => view.minimize('win-a') },
          { label: 'Maksymalizuj', onClick: () => view.maximize('win-a') },
          'separator',
          { label: 'Zamknij', onClick: () => { view.close('win-a'); taskbar.removeItem('tb-a'); } }
      ]
  });
  taskbar.addItem('tb-b', { icon: '🟩', title: 'Okno B',
      onClick: () => view.restore('win-b'),
      menuItems: [
          { label: 'Minimalizuj', onClick: () => view.minimize('win-b') },
          { label: 'Maksymalizuj', onClick: () => view.maximize('win-b') },
          'separator',
          { label: 'Zamknij', onClick: () => { view.close('win-b'); taskbar.removeItem('tb-b'); } }
      ]
  });

  // ── Dodawanie elementu do ikony Start (z menu kontekstowym) ─
  // Możesz dodać dowolne pozycje menu – aplikacje, skróty, separator:
  taskbar.refreshStartMenu([
      { id: 'sm-notes',    icon: '📝', label: 'Notatnik',    onClick: () => view.restore('win-notes') },
      { id: 'sm-calc',     icon: '🧮', label: 'Kalkulator',  onClick: () => view.restore('win-calc')  },
      'separator',
      { id: 'sm-settings', icon: '⚙️', label: 'Ustawienia',  onClick: () => alert('Ustawienia') },
      { id: 'sm-off',      icon: '⏻',  label: 'Wyłącz',      disabled: true }
  ]);
  // lub dynamicznie po jednej pozycji:
  taskbar.addStartMenuItem({ id: 'sm-browser', icon: '🌐', label: 'Przeglądarka', onClick: () => alert('Przeglądarka') });
  taskbar.addStartMenuItem('separator');
  taskbar.removeStartMenuItem('sm-browser');

  ── DesktopIconsManager ────────────────────────────────────

  // Dodaj ikonę aplikacji (klik otwiera okno):
  desktop.addIcon('di-notes', { icon: '📝', label: 'Notatnik', onClick: () => view.restore('win-notes') });

  // Dodaj ikonę-folder (klik lewym = rozwinięcie menu):
  desktop.addIcon('di-folder', {
      icon: '📁', label: 'Moje pliki',
      menuItems: [
          { icon: '📄', label: 'Dokument.txt', onClick: () => alert('Otwórz plik') },
          { icon: '📊', label: 'Arkusz.xlsx',  onClick: () => alert('Otwórz arkusz') },
          'separator',
          { icon: '📂', label: 'Otwórz folder', onClick: () => alert('Otwórz folder') }
      ]
  });

  // Dodaj ikonę z własną pozycją (x, y w pikselach):
  desktop.addIcon('di-calc', { icon: '🧮', label: 'Kalkulator', position: { x: 100, y: 20 },
      onClick: () => view.restore('win-calc') });

  // Usuń ikonę:
  desktop.removeIcon('di-notes');

  // Zaktualizuj ikonę (zmień etykietę / emoji / pozycję / handler):
  desktop.updateIcon('di-notes', { label: 'Notatnik *', icon: '📋' });

  // Pobierz pozycję ikony:
  const pos = desktop.getIconPosition('di-notes');
  console.log(pos); // { x: 20, y: 20 }

  // Ustaw pozycję ikony:
  desktop.setIconPosition('di-notes', { x: 100, y: 200 });

  // Pobierz listę wszystkich ikon z ich bieżącymi pozycjami:
  const icons = desktop.getIcons();
  // [ { id: 'di-notes', icon: '📝', label: 'Notatnik', position: { x: 20, y: 20 } }, … ]

 * ════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
 *  class View
 *  Zarządza WSZYSTKIMI elementami UI:
 *    view.taskbar  – pasek zadań (start, separator, elementy, menu kontekstowe)
 *    view.window   – okno (tytuł, ikona, statusBar)
 *    view.titlebar – przyciski tytułpasek
 *    view.menubar  – górne menu okna
 *    view.content  – zawartość okna (karty, nagłówek)
 * ════════════════════════════════════════════════════════════ */

const MOBILE_BREAKPOINT = 768;  // px – granica małego ekranu

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

        /* start menu state */
        let _startMenuItems = [];
        let _startMenuEl    = null;

        /* pomocnicze – tworzy element menu Start */
        const _makeStartMenuItem = item => {
            if (item === 'separator') {
                const sep = document.createElement('div');
                sep.className = 'taskbar-start-menu-sep';
                return sep;
            }
            const el = document.createElement('div');
            el.className = 'taskbar-start-menu-item' + (item.disabled ? ' disabled' : '');
            if (item.id) el.dataset.smId = item.id;
            el.innerHTML =
                `<span class="taskbar-start-menu-icon">${item.icon || ''}</span>` +
                `<span class="taskbar-start-menu-label">${item.label || ''}</span>`;
            if (!item.disabled && typeof item.onClick === 'function') {
                el.addEventListener('click', e => {
                    e.stopPropagation();
                    if (_startMenuEl) _startMenuEl.classList.remove('open');
                    item.onClick(e);
                });
            }
            return el;
        };

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
            bar.querySelectorAll('.taskbar-menu.open, .taskbar-start-menu.open')
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
            async refresh({ showStart = true, items = [] } = {}) {
                bar.innerHTML = '';

                if (showStart) {
                    const startBtn = document.createElement('button');
                    startBtn.className = 'taskbar-start';
                    startBtn.title = 'Start';
                    startBtn.innerHTML = `
                        <div class="taskbar-start-icon">
                            <span></span><span></span><span></span><span></span>
                        </div>`;

                    /* start menu popup */
                    const startMenu = document.createElement('div');
                    startMenu.className = 'taskbar-start-menu';
                    _startMenuEl = startMenu;
                    _startMenuItems.forEach(item => startMenu.appendChild(_makeStartMenuItem(item)));
                    startBtn.appendChild(startMenu);

                    startBtn.addEventListener('click', e => {
                        e.stopPropagation();
                        _closeAllMenus();
                        if (_startMenuItems.length > 0) startMenu.classList.toggle('open');
                    });
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
            async addItem({ id, icon, title, onClick, menuItems = [] } = {}) {
                if (id && bar.querySelector(`[data-tb-id="${id}"]`)) return;
                bar.appendChild(_makeItem({ id, icon, title, onClick, menuItems }));
            },

            /** Usuwa element po id */
            async removeItem(id) {
                const el = bar.querySelector(`[data-tb-id="${id}"]`);
                if (el) el.remove();
            },

            /**
             * Aktualizuje element paska
             * @param {string} id
             * @param {{ title?, icon?, onClick?, menuItems? }} cfg
             */
            async updateItem(id, { title, icon, onClick, menuItems } = {}) {
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
            },

            /**
             * Odświeża całe menu Start
             * @param {Array} items  – [{ id?, icon?, label, disabled?, onClick }|'separator']
             */
            async refreshStartMenu(items = []) {
                _startMenuItems = items;
                if (!_startMenuEl) return;
                _startMenuEl.innerHTML = '';
                items.forEach(item => _startMenuEl.appendChild(_makeStartMenuItem(item)));
            },

            /**
             * Dodaje pozycję do menu Start
             * @param {{ id?, icon?, label, disabled?, onClick }|'separator'} item
             */
            async addStartMenuItem(item) {
                _startMenuItems.push(item);
                if (_startMenuEl) _startMenuEl.appendChild(_makeStartMenuItem(item));
            },

            /**
             * Usuwa pozycję z menu Start po id
             * @param {string} id
             */
            async removeStartMenuItem(id) {
                _startMenuItems = _startMenuItems.filter(it => it !== 'separator' && it.id !== id);
                if (_startMenuEl) {
                    const el = _startMenuEl.querySelector(`[data-sm-id="${id}"]`);
                    if (el) el.remove();
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
            async create({ title = '', icon = null, statusText = 'Gotowe' } = {}) {
                const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

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
                            ${isMobile ? '' : `<button class="titlebar-button maximize" title="Maksymalizuj">
                                <div class="maximize-icon"></div>
                            </button>`}
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
                await self._onWindowCreated(win);

                /* auto-maksymalizacja na małych ekranach */
                if (isMobile) {
                    await self._wmAction('maximize');
                }
            },

            /** Zmienia tytuł okna */
            async setTitle(title) {
                if (!self._windowEl) return;
                self._windowEl.querySelector('.window-title').textContent = title;
                /* synchronizuj rejestr */
                const reg = window._windowRegistry.find(r => r.winEl === self._windowEl);
                if (reg) reg.title = title;
            },

            /** Ustawia tekst paska stanu */
            async setStatus(text) {
                if (!self._windowEl) return;
                self._windowEl.querySelector('.status-bar span').textContent = text;
            },

            async minimize() { await self._wmAction('minimize'); },
            async maximize() { await self._wmAction('maximize'); },
            async restore()  { await self._wmAction('restore');  },
            async close()    { await self._wmAction('close');    }
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
            async bindControls({ onMinimize, onMaximize, onClose } = {}) {
                if (!self._windowEl) return;
                const win = self._windowEl;
                win.querySelector('.minimize').onclick = e => { e.stopPropagation(); onMinimize && onMinimize(e); };
                const maxBtn = win.querySelector('.maximize');
                if (maxBtn) maxBtn.onclick = e => { e.stopPropagation(); onMaximize && onMaximize(e); };
                win.querySelector('.close').onclick    = e => { e.stopPropagation(); onClose    && onClose(e);    };
            },

            /**
             * Dodaje własny przycisk do paska tytułowego
             * @param {{ id, label, onClick, position?: 'before-controls'|'after-icon' }} cfg
             */
            async addButton({ id, label, onClick, position = 'before-controls' } = {}) {
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
            async removeButton(id) {
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

        /* ── mobile bottom-sheet helpers ─────────────────────────── */
        const _buildMobileItemsFromDrop = (dropEl, container, overlay, indent) => {
            dropEl.querySelectorAll(':scope > .dropdown-item, :scope > .dropdown-separator').forEach(el => {
                if (el.classList.contains('dropdown-separator')) {
                    const sep = document.createElement('div');
                    sep.className = 'mobile-sheet-separator';
                    container.appendChild(sep);
                    return;
                }
                const isDisabled = el.classList.contains('disabled');
                const iconEl     = el.querySelector('.dropdown-item-icon');
                const shortcutEl = el.querySelector('.dropdown-item-shortcut');
                const submenuEl  = el.querySelector('.submenu');

                /* extract label text (strip child element text) */
                const clone = el.cloneNode(true);
                clone.querySelectorAll('.dropdown-item-icon,.dropdown-item-shortcut,.submenu-indicator,.submenu').forEach(c => c.remove());
                const labelText = clone.textContent.trim();
                if (!labelText && !iconEl) return;

                const item = document.createElement('div');
                item.className = 'mobile-sheet-item' + (isDisabled ? ' disabled' : '') + (indent ? ' mobile-sheet-item-indent' : '');
                item.innerHTML =
                    `<span class="mobile-sheet-item-icon">${iconEl ? iconEl.textContent : ''}</span>` +
                    `<span class="mobile-sheet-item-label">${labelText}</span>` +
                    (shortcutEl ? `<span class="mobile-sheet-item-shortcut">${shortcutEl.textContent}</span>` : '');

                if (!isDisabled && !submenuEl) {
                    item.addEventListener('click', e => {
                        e.stopPropagation();
                        overlay.classList.remove('open');
                        el.click();
                    });
                } else if (submenuEl) {
                    item.querySelector('.mobile-sheet-item-label').innerHTML += ' <span class="mobile-sheet-submenu-label">▸</span>';
                }
                container.appendChild(item);

                if (submenuEl) {
                    _buildMobileItemsFromDrop(submenuEl, container, overlay, true);
                }
            });
        };

        const _buildMobileOverlay = () => {
            const win = self._windowEl; if (!win) return null;
            const mb  = _getMenubar();  if (!mb)  return null;

            /* remove any existing overlay */
            win.querySelectorAll('.mobile-menu-overlay').forEach(el => el.remove());

            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';

            const sheet = document.createElement('div');
            sheet.className = 'mobile-menu-sheet';

            /* header */
            const header = document.createElement('div');
            header.className = 'mobile-sheet-header';
            header.innerHTML = '<span>Menu</span>';
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-sheet-close';
            closeBtn.textContent = '✕';
            closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
            header.appendChild(closeBtn);

            /* items */
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'mobile-sheet-items';

            mb.querySelectorAll('.menu-item').forEach(menuEl => {
                const dropEl = menuEl.querySelector('.dropdown-menu');
                if (!dropEl) return;

                /* section header = menu label */
                const menuLabel = menuEl.childNodes[0] && menuEl.childNodes[0].nodeType === Node.TEXT_NODE
                    ? menuEl.childNodes[0].textContent.trim()
                    : menuEl.dataset.menuId || '';

                const section = document.createElement('div');
                section.className = 'mobile-sheet-section';

                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'mobile-sheet-section-header';
                sectionHeader.innerHTML = `<span>${menuLabel}</span><span class="mobile-sheet-section-arrow">▾</span>`;
                sectionHeader.addEventListener('click', () => section.classList.toggle('collapsed'));

                const sectionBody = document.createElement('div');
                sectionBody.className = 'mobile-sheet-section-body';

                _buildMobileItemsFromDrop(dropEl, sectionBody, overlay, false);

                section.appendChild(sectionHeader);
                section.appendChild(sectionBody);
                itemsContainer.appendChild(section);
            });

            sheet.appendChild(header);
            sheet.appendChild(itemsContainer);
            overlay.appendChild(sheet);

            /* close on backdrop click */
            overlay.addEventListener('click', e => {
                if (e.target === overlay) overlay.classList.remove('open');
            });

            win.appendChild(overlay);
            return overlay;
        };
        /* ── end mobile helpers ─────────────────────────────────── */

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
            async refresh({ menus = [] } = {}) {
                const mb = _getMenubar(); if (!mb) return;
                mb.innerHTML = '';
                menus.forEach(m => mb.appendChild(_makeMenu(m)));

                /* hamburger button – visible only on small screens via CSS */
                const hamburger = document.createElement('button');
                hamburger.className = 'menubar-hamburger';
                hamburger.title = 'Menu';
                hamburger.innerHTML = '&#9776;';
                hamburger.addEventListener('click', e => {
                    e.stopPropagation();
                    _closeMenus();
                    const overlay = _buildMobileOverlay();
                    if (overlay) overlay.classList.add('open');
                });
                mb.appendChild(hamburger);
            },

            /**
             * Dodaje nowe menu
             * @param {{ label, id, items, position?: number|'first'|'last' }} cfg
             */
            async addMenu({ label, id, items = [], position = 'last' } = {}) {
                const mb = _getMenubar(); if (!mb) return;
                const el = _makeMenu({ label, id, items });
                const existing = mb.querySelectorAll('.menu-item');
                if (position === 'first') mb.insertBefore(el, mb.firstChild);
                else if (position === 'last' || position >= existing.length) {
                    /* insert before hamburger if present */
                    const hb = mb.querySelector('.menubar-hamburger');
                    hb ? mb.insertBefore(el, hb) : mb.appendChild(el);
                } else mb.insertBefore(el, existing[position]);
            },

            /** Usuwa menu po data-menu-id */
            async removeMenu(id) {
                const mb = _getMenubar(); if (!mb) return;
                const el = mb.querySelector(`[data-menu-id="${id}"]`);
                if (el) el.remove();
            },

            /**
             * Dodaje pozycję do istniejącego menu
             * @param {string} menuId
             * @param {object} item  – { id?, icon?, label, shortcut?, disabled?, separator?, submenu?, onClick }
             */
            async addMenuItem(menuId, item) {
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
            async removeMenuItem(menuId, itemId) {
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
            async refresh({ header = '', subheader = '', cards = [] } = {}) {
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

            async setHeader(text) {
                const c = _getContent(); if (!c) return;
                let h = c.querySelector('.content-header');
                if (!h) { h = document.createElement('div'); h.className = 'content-header'; c.prepend(h); }
                h.textContent = text;
            },

            async setSubheader(text) {
                const c = _getContent(); if (!c) return;
                let s = c.querySelector('.content-subheader');
                if (!s) {
                    s = document.createElement('div'); s.className = 'content-subheader';
                    const h = c.querySelector('.content-header');
                    h ? h.after(s) : c.prepend(s);
                }
                s.textContent = text;
            },

            async addCard({ id, title = '', text = '' } = {}) {
                const c = _getContent(); if (!c) return;
                c.appendChild(_makeCard({ id, title, text }));
            },

            async removeCard(id) {
                const c = _getContent(); if (!c) return;
                const card = c.querySelector(`[data-card-id="${id}"]`);
                if (card) card.remove();
            },

            async updateCard(id, { title, text } = {}) {
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
    async _onWindowCreated(win) {
        /* WindowManager podpinamy przez view.titlebar.bindControls()
           – dlatego tu nic nie robimy, inicjalizacja jest w kodzie użytkownika */
    }

    /* ══════════════════════════════════════════════════════════
     *  WindowManager – wewnętrzna logika min/max/restore/close
     * ══════════════════════════════════════════════════════════ */
    async _wmAction(action) {
        const win  = this._windowEl;
        if (!win) return;

        const _state = win._wmState || (win._wmState = { maximized: false, minimized: false });
        const container = this._containerEl;

        if (action === 'minimize') {
            if (_state.minimized) { await this._wmAction('restore'); return; }
            win.classList.remove('maximized');
            win.classList.add('minimized');
            document.body.classList.remove('window-maximized');
            _state.minimized = true;
            _state.maximized = false;

            /* zaktualizuj rejestr */
            const regMin = window._windowRegistry.find(r => r.winEl === win);
            if (regMin) regMin.isMinimized = true;

        } else if (action === 'maximize') {
            if (_state.maximized) { await this._wmAction('restore'); return; }
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
            // Ustaw na obszar roboczy (z uwzględnieniem taskbara)
            const root = document.documentElement;
            const style  = getComputedStyle(root);
            const tbTop    = parseFloat(root.style.getPropertyValue('--tb-top')    || style.getPropertyValue('--tb-top'))    || 0;
            const tbLeft   = parseFloat(root.style.getPropertyValue('--tb-left')   || style.getPropertyValue('--tb-left'))   || 0;
            const tbBottom = parseFloat(root.style.getPropertyValue('--tb-bottom') || style.getPropertyValue('--tb-bottom')) || 48;
            const tbRight  = parseFloat(root.style.getPropertyValue('--tb-right')  || style.getPropertyValue('--tb-right'))  || 0;

            win.style.left   = tbLeft + 'px';
            win.style.top    = tbTop  + 'px';
            win.style.width  = (window.innerWidth  - tbLeft - tbRight)  + 'px';
            win.style.height = (window.innerHeight - tbTop  - tbBottom) + 'px';

        } else if (action === 'restore') {
            win.classList.remove('minimized', 'maximized');
            document.body.classList.remove('window-maximized');
            _state.maximized = false;
            _state.minimized = false;

            /* zaktualizuj rejestr */
            const regRes = window._windowRegistry.find(r => r.winEl === win);
            if (regRes) regRes.isMinimized = false;

            /* na małych ekranach zawsze maksymalizuj */
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                _state.prev = null;
                await this._wmAction('maximize');
                return;
            }

            // Przywróć poprzednie pozycje i rozmiar
            if (_state.prev) {
                win.style.left = _state.prev.left;
                win.style.top = _state.prev.top;
                win.style.width = _state.prev.width;
                win.style.height = _state.prev.height;
                _state.prev = null;
            } else {
                await this._updateSize();
            }

        } else if (action === 'close') {
            win.classList.add('closing');
            setTimeout(() => { win.style.display = 'none'; }, 300);
            /* usuń z globalnego rejestru */
            window._windowRegistry = window._windowRegistry.filter(r => r.winEl !== win);
        }
    }

    async _updateSize() {
        const win = this._windowEl; if (!win) return;
        const s = win._wmState || {};
        if (s.maximized) {
            await this._wmAction('maximize'); /* recalculate with current taskbar offset */
        } else {
            win.style.width  = `${Math.min(900, window.innerWidth  - 40)}px`;
            win.style.height = `${Math.min(600, window.innerHeight - 40)}px`;
        }
    }

    async isMinimized() {
        return this._windowEl && !!(this._windowEl._wmState || {}).minimized;
    }
    async isMaximized() {
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
    async create(windowId, { title = '', icon = null, statusText = 'Gotowe' } = {}) {
        if (this._windows.has(windowId)) {
            console.warn(`WindowManager: okno "${windowId}" już istnieje.`);
            return null;
        }
        const v = new View({ taskbarId: this._taskbarId, containerId: this._containerId });
        await v.window.create({ title, icon, statusText });
        await v.titlebar.bindControls({
            onMinimize: async () => await v.window.minimize(),
            onMaximize: async () => { if (await v.isMaximized()) await v.window.restore(); else await v.window.maximize(); },
            onClose:    async () => { await v.window.close(); this._windows.delete(windowId); }
        });
        this._windows.set(windowId, v);

        /* resize wszystkich okien przy zmianie rozmiaru przeglądarki */
        if (!window._wm) window._wm = { resizeRegistered: false, instances: [] };
        if (!window._wm.resizeRegistered) {
            window._wm.resizeRegistered = true;
            window.addEventListener('resize', async () => {
                for (const wm of window._wm.instances) {
                    for (const view of wm._windows.values()) {
                        if (!await view.isMaximized()) await view._updateSize();
                    }
                }
            });
        }
        if (!window._wm.instances.includes(this)) {
            window._wm.instances.push(this);
        }

        return v;
    }

    /** Zwraca instancję View dla danego ID lub null */
    async getView(windowId) { return this._windows.get(windowId) || null; }

    async _get(windowId) {
        const v = this._windows.get(windowId);
        if (!v) console.warn(`WindowManager: brak okna "${windowId}".`);
        return v || null;
    }

    /* ── operacje na oknie ────────────────────────────────── */
    async setTitle(windowId, title)  { const v = await this._get(windowId); await v?.window.setTitle(title); }
    async setStatus(windowId, text)  { const v = await this._get(windowId); await v?.window.setStatus(text); }
    async minimize(windowId)         { const v = await this._get(windowId); await v?.window.minimize(); }
    async maximize(windowId)         { const v = await this._get(windowId); await v?.window.maximize(); }
    async restore(windowId)          { const v = await this._get(windowId); await v?.window.restore(); }
    async close(windowId)            {
        const v = await this._get(windowId);
        if (v) { await v.window.close(); this._windows.delete(windowId); }
    }
    async isMinimized(windowId)      { const v = await this._get(windowId); return await v?.isMinimized() ?? null; }
    async isMaximized(windowId)      { const v = await this._get(windowId); return await v?.isMaximized() ?? null; }

    /* ── pasek tytułu ─────────────────────────────────────── */
    async bindControls(windowId, handlers = {}) { const v = await this._get(windowId); await v?.titlebar.bindControls(handlers); }
    async addButton(windowId, cfg)              { const v = await this._get(windowId); await v?.titlebar.addButton(cfg); }
    async removeButton(windowId, btnId)         { const v = await this._get(windowId); await v?.titlebar.removeButton(btnId); }

    /* ── zawartość ────────────────────────────────────────── */
    async refreshContent(windowId, cfg)              { const v = await this._get(windowId); await v?.content.refresh(cfg); }
    async setHeader(windowId, text)                  { const v = await this._get(windowId); await v?.content.setHeader(text); }
    async setSubheader(windowId, text)               { const v = await this._get(windowId); await v?.content.setSubheader(text); }
    async addCard(windowId, cfg)                     { const v = await this._get(windowId); await v?.content.addCard(cfg); }
    async removeCard(windowId, cardId)               { const v = await this._get(windowId); await v?.content.removeCard(cardId); }
    async updateCard(windowId, cardId, cfg)          { const v = await this._get(windowId); await v?.content.updateCard(cardId, cfg); }

    /* ── menubar ──────────────────────────────────────────── */
    async refreshMenubar(windowId, menus)             { const v = await this._get(windowId); await v?.menubar.refresh({ menus }); }
    async addMenu(windowId, cfg)                      { const v = await this._get(windowId); await v?.menubar.addMenu(cfg); }
    async removeMenu(windowId, menuId)                { const v = await this._get(windowId); await v?.menubar.removeMenu(menuId); }
    async addMenuItem(windowId, menuId, item)         { const v = await this._get(windowId); await v?.menubar.addMenuItem(menuId, item); }
    async removeMenuItem(windowId, menuId, itemId)    { const v = await this._get(windowId); await v?.menubar.removeMenuItem(menuId, itemId); }
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
        this._view                  = new View({ taskbarId, containerId });
        this._tb                    = this._view.taskbar;
        this._position              = 'bottom';
        this._autoHideActive        = false;
        this._autoHideHovered       = false;
        this._autoHideEnter         = null;
        this._autoHideLeave         = null;
        this._autoHideTouch         = null;
        this._autoHideTouchOutside  = null;
        this._isHidden              = false;
    }

    async refresh(cfg = {})        { await this._tb.refresh(cfg); }
    async addItem(id, cfg = {})    { await this._tb.addItem({ id, ...cfg }); }
    async removeItem(id)           { await this._tb.removeItem(id); }
    async updateItem(id, cfg = {}) { await this._tb.updateItem(id, cfg); }

    async refreshStartMenu(items = [])   { await this._tb.refreshStartMenu(items); }
    async addStartMenuItem(cfg = {})     { await this._tb.addStartMenuItem(cfg); }
    async removeStartMenuItem(id)        { await this._tb.removeStartMenuItem(id); }

    /** Oblicza i ustawia CSS-owe zmienne --tb-* z uwzględnieniem autohide */
    async _syncCSSVars() {
        const root   = document.documentElement;
        const style  = getComputedStyle(root);
        const tbH    = style.getPropertyValue('--tb-size-h').trim();
        const tbW    = style.getPropertyValue('--tb-size-v').trim();
        const pos    = this._position;
        const hidden = this._isHidden || (this._autoHideActive && !this._autoHideHovered);

        root.style.setProperty('--tb-top',    (!hidden && pos === 'top')    ? tbH : '0px');
        root.style.setProperty('--tb-bottom', (!hidden && pos === 'bottom') ? tbH : '0px');
        root.style.setProperty('--tb-left',   (!hidden && pos === 'left')   ? tbW : '0px');
        root.style.setProperty('--tb-right',  (!hidden && pos === 'right')  ? tbW : '0px');
    }

    /** Przelicza rozmiar wszystkich zmaksymalizowanych okien */
    async _resizeAllWindows() {
        if (window._wm) {
            for (const wm of window._wm.instances) {
                for (const v of wm._windows.values()) {
                    if (await v.isMaximized()) await v._wmAction('maximize');
                }
            }
        }
    }

    /**
     * Ustawia pozycję paska zadań
     * @param {'bottom'|'top'|'left'|'right'} position
     */
    async setPosition(position = 'bottom') {
        const bar  = this._view._taskbarEl;
        const body = document.body;

        /* remove old position classes / attribute */
        bar.removeAttribute('data-pos');
        ['bottom','top','left','right'].forEach(p => body.classList.remove(`taskbar-pos-${p}`));

        bar.dataset.pos = position;
        body.classList.add(`taskbar-pos-${position}`);
        this._position = position;

        await this._syncCSSVars();
        await this._resizeAllWindows();
    }

    /**
     * Włącza / wyłącza automatyczne ukrywanie paska zadań.
     * Gdy włączone: pasek nie zajmuje miejsca, okna rozszerzają się do pełnego ekranu.
     * Przy najechaniu/interakcji pasek wysuwa się i okna zmniejszają się.
     * @param {boolean} enabled
     */
    async setAutoHide(enabled = false) {
        const bar = this._view._taskbarEl;

        /* usuń poprzednie listenery autohide */
        if (this._autoHideEnter)        bar.removeEventListener('mouseenter', this._autoHideEnter);
        if (this._autoHideLeave)        bar.removeEventListener('mouseleave', this._autoHideLeave);
        if (this._autoHideTouch)        bar.removeEventListener('touchstart', this._autoHideTouch);
        if (this._autoHideTouchOutside) document.removeEventListener('touchstart', this._autoHideTouchOutside);
        this._autoHideEnter         = null;
        this._autoHideLeave         = null;
        this._autoHideTouch         = null;
        this._autoHideTouchOutside  = null;

        this._autoHideActive  = enabled;
        this._autoHideHovered = false;
        bar.classList.toggle('autohide', enabled);

        if (enabled) {
            this._autoHideEnter = async () => {
                this._autoHideHovered = true;
                await this._syncCSSVars();
                await this._resizeAllWindows();
            };
            this._autoHideLeave = async () => {
                this._autoHideHovered = false;
                await this._syncCSSVars();
                await this._resizeAllWindows();
            };
            /* obsługa dotykowa – wysuń pasek przy dotknięciu */
            let touchOnBar = false;
            this._autoHideTouch = async () => {
                touchOnBar = true;
                this._autoHideHovered = true;
                bar.classList.add('autohide-show');
                await this._syncCSSVars();
                await this._resizeAllWindows();
            };
            this._autoHideTouchOutside = async () => {
                if (touchOnBar) {
                    touchOnBar = false;
                    return;
                }
                this._autoHideHovered = false;
                bar.classList.remove('autohide-show');
                await this._syncCSSVars();
                await this._resizeAllWindows();
            };
            bar.addEventListener('mouseenter', this._autoHideEnter);
            bar.addEventListener('mouseleave', this._autoHideLeave);
            bar.addEventListener('touchstart', this._autoHideTouch, { passive: true });
            document.addEventListener('touchstart', this._autoHideTouchOutside, { passive: true });
        } else {
            bar.classList.remove('autohide-show');
        }

        await this._syncCSSVars();
        await this._resizeAllWindows();
    }

    /** Przełącza automatyczne ukrywanie paska zadań */
    async toggleAutoHide() {
        await this.setAutoHide(!this._autoHideActive);
    }

    /**
     * Całkowicie ukrywa pasek zadań.
     * Okna automatycznie rozszerzają się na całą dostępną przestrzeń.
     */
    async hide() {
        this._view._taskbarEl.style.display = 'none';
        this._isHidden = true;
        await this._syncCSSVars();
        await this._resizeAllWindows();
    }

    /**
     * Pokazuje pasek zadań po wcześniejszym ukryciu.
     * Okna automatycznie zwalniają miejsce dla paska.
     */
    async show() {
        this._view._taskbarEl.style.display = '';
        this._isHidden = false;
        await this._syncCSSVars();
        await this._resizeAllWindows();
    }
}

/* ════════════════════════════════════════════════════════════
 *  class DesktopIconsManager
 *  Zarządza ikonami pulpitu:
 *    desktop.addIcon(id, cfg)          – dodaj ikonę
 *    desktop.removeIcon(id)            – usuń ikonę
 *    desktop.updateIcon(id, cfg)       – zaktualizuj ikonę
 *    desktop.getIconPosition(id)       – pobierz pozycję { x, y }
 *    desktop.setIconPosition(id, pos)  – ustaw pozycję { x, y }
 *    desktop.getIcons()                – lista wszystkich ikon
 * ════════════════════════════════════════════════════════════ */
class DesktopIconsManager {
    /**
     * @param {object} [cfg]
     * @param {string} [cfg.containerId='desktopIcons']
     */
    constructor({ containerId = 'desktopIcons' } = {}) {
        this._container  = document.getElementById(containerId);
        this._icons      = new Map();   // id → { el, cfg }
        this._gridX      = 20;
        this._gridY      = 20;
        this._gridCellW  = 88;
        this._gridCellH  = 96;
        this._activeMenu = null;

        document.addEventListener('click',       async () => await this._closeMenu());
        document.addEventListener('contextmenu', async e => {
            if (!e.target.closest('.desktop-icon')) await this._closeMenu();
        });
    }

    /* ── Publiczne API ── */

    /**
     * Dodaje ikonę na pulpit.
     * @param {string} id  Unikalny identyfikator
     * @param {object} cfg
     * @param {string}   cfg.icon       Emoji lub HTML ikony (np. '📝')
     * @param {string}   cfg.label      Etykieta pod ikoną
     * @param {object}   [cfg.position] { x, y } – jeśli pominięte, pozycja siatki
     * @param {Function} [cfg.onClick]  Handler kliknięcia lewym przyciskiem
     * @param {Array}    [cfg.menuItems] Pozycje menu (prawy klik / folder)
     */
    async addIcon(id, cfg = {}) {
        if (this._icons.has(id)) await this.removeIcon(id);

        const pos = cfg.position ? { ...cfg.position } : await this._nextGridPos();
        const el  = await this._createEl(id, cfg, pos);
        this._container.appendChild(el);
        this._icons.set(id, { el, cfg: { ...cfg, position: pos } });
        await this._makeDraggable(el, id);
        return this;
    }

    /**
     * Usuwa ikonę z pulpitu.
     * @param {string} id
     */
    async removeIcon(id) {
        const entry = this._icons.get(id);
        if (!entry) return this;
        entry.el.remove();
        this._icons.delete(id);
        return this;
    }

    /**
     * Aktualizuje właściwości istniejącej ikony.
     * @param {string} id
     * @param {object} cfg  Pola do nadpisania (icon / label / position / onClick / menuItems)
     */
    async updateIcon(id, cfg = {}) {
        const entry = this._icons.get(id);
        if (!entry) return this;
        const newCfg = { ...entry.cfg, ...cfg };
        const pos    = newCfg.position;
        const newEl  = await this._createEl(id, newCfg, pos);
        entry.el.replaceWith(newEl);
        this._icons.set(id, { el: newEl, cfg: newCfg });
        await this._makeDraggable(newEl, id);
        return this;
    }

    /**
     * Zwraca bieżącą pozycję ikony.
     * @param  {string} id
     * @returns {{ x: number, y: number } | null}
     */
    async getIconPosition(id) {
        const entry = this._icons.get(id);
        if (!entry) return null;
        return { ...entry.cfg.position };
    }

    /**
     * Ustawia pozycję ikony.
     * @param {string} id
     * @param {{ x: number, y: number }} pos
     */
    async setIconPosition(id, { x, y } = {}) {
        const entry = this._icons.get(id);
        if (!entry) return this;
        entry.cfg.position = { x, y };
        entry.el.style.left = x + 'px';
        entry.el.style.top  = y + 'px';
        return this;
    }

    /**
     * Zwraca tablicę wszystkich ikon wraz z bieżącymi pozycjami.
     * @returns {Array<{ id: string, icon: string, label: string, position: { x, y } }>}
     */
    async getIcons() {
        const result = [];
        this._icons.forEach((entry, id) => {
            result.push({ id, ...entry.cfg });
        });
        return result;
    }

    /* ── Wewnętrzne ── */

    async _nextGridPos() {
        const vh      = window.innerHeight;
        const DEFAULT_TASKBAR_HEIGHT = 48; /* zapasowa wartość gdy CSS-var nie jest dostępna */
        const tbSize  = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--tb-bottom')
        ) || DEFAULT_TASKBAR_HEIGHT;
        const maxY = vh - tbSize - this._gridCellH - 10;

        const pos = { x: this._gridX, y: this._gridY };
        this._gridY += this._gridCellH;
        if (this._gridY > maxY) {
            this._gridY  = 20;
            this._gridX += this._gridCellW;
        }
        return pos;
    }

    async _createEl(id, cfg, pos) {
        const el = document.createElement('div');
        el.className    = 'desktop-icon';
        el.dataset.iconId = id;
        el.style.left   = pos.x + 'px';
        el.style.top    = pos.y + 'px';

        const imgEl = document.createElement('div');
        imgEl.className   = 'desktop-icon-img';
        imgEl.textContent = cfg.icon || '📄';

        const labelEl = document.createElement('div');
        labelEl.className   = 'desktop-icon-label';
        labelEl.textContent = cfg.label || '';

        el.appendChild(imgEl);
        el.appendChild(labelEl);

        const menuItems = cfg.menuItems || [];

        /* klik lewym: onClick LUB (jeśli brak onClick i są menuItems) rozwiń menu */
        el.addEventListener('click', async e => {
            e.stopPropagation();
            if (el._wasDragged) { el._wasDragged = false; return; }
            await this._selectIcon(id);
            if (typeof cfg.onClick === 'function') {
                cfg.onClick(e);
            } else if (menuItems.length) {
                await this._openMenu(e, id, cfg, menuItems);
            }
        });

        /* prawy klik – zawsze menu kontekstowe */
        el.addEventListener('contextmenu', async e => {
            e.preventDefault(); e.stopPropagation();
            await this._selectIcon(id);
            if (menuItems.length) await this._openMenu(e, id, cfg, menuItems);
        });

        return el;
    }

    async _selectIcon(id) {
        this._container.querySelectorAll('.desktop-icon.selected')
            .forEach(el => el.classList.remove('selected'));
        const entry = this._icons.get(id);
        if (entry) entry.el.classList.add('selected');
    }

    async _openMenu(e, id, cfg, items) {
        await this._closeMenu();

        const menu = document.createElement('div');
        menu.className = 'desktop-icon-menu';

        items.forEach(item => {
            if (item === 'separator') {
                const sep = document.createElement('div');
                sep.className = 'desktop-icon-menu-sep';
                menu.appendChild(sep);
                return;
            }
            const mi = document.createElement('div');
            mi.className = 'desktop-icon-menu-item' + (item.disabled ? ' disabled' : '');
            if (item.icon) {
                const iconSpan = document.createElement('span');
                iconSpan.className   = 'desktop-icon-menu-item-icon';
                iconSpan.textContent = item.icon;
                const labelSpan = document.createElement('span');
                labelSpan.textContent = item.label || '';
                mi.appendChild(iconSpan);
                mi.appendChild(labelSpan);
            } else {
                mi.textContent = item.label || '';
            }
            if (!item.disabled && typeof item.onClick === 'function') {
                mi.addEventListener('click', async ev => {
                    ev.stopPropagation();
                    await this._closeMenu();
                    item.onClick(ev);
                });
            }
            menu.appendChild(mi);
        });

        document.body.appendChild(menu);
        this._activeMenu = menu;

        /* pozycjonowanie – korekta gdy menu wychodzi poza ekran */
        let mx = e.clientX, my = e.clientY;
        menu.style.left = mx + 'px';
        menu.style.top  = my + 'px';
        requestAnimationFrame(() => {
            const r  = menu.getBoundingClientRect();
            const vw = window.innerWidth, vh = window.innerHeight;
            if (r.right  > vw) menu.style.left = Math.max(0, mx - r.width)  + 'px';
            if (r.bottom > vh) menu.style.top  = Math.max(0, my - r.height) + 'px';
        });
    }

    async _closeMenu() {
        if (this._activeMenu) { this._activeMenu.remove(); this._activeMenu = null; }
    }

    async _makeDraggable(el, id) {
        const DRAG_THRESHOLD   = 5;   /* px – minimalne przesunięcie aby uznać za przeciąganie */
        const LONG_PRESS_DELAY = 600; /* ms – czas długiego naciśnięcia (menu kontekstowe) */
        let startX, startY, startLeft, startTop, elW, elH, isDragging;

        /* ── Mouse ── */
        el.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            e.preventDefault();
            startX    = e.clientX; startY    = e.clientY;
            startLeft = parseInt(el.style.left) || 0;
            startTop  = parseInt(el.style.top)  || 0;
            elW = el.offsetWidth; elH = el.offsetHeight; /* cache aby uniknąć reflow w onMove */
            isDragging = false;

            const onMove = mv => {
                const dx = mv.clientX - startX, dy = mv.clientY - startY;
                if (!isDragging && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
                isDragging = true;
                el.classList.add('dragging');
                const vw = window.innerWidth, vh = window.innerHeight;
                el.style.left = Math.max(0, Math.min(vw - elW, startLeft + dx)) + 'px';
                el.style.top  = Math.max(0, Math.min(vh - elH, startTop  + dy)) + 'px';
            };

            const onUp = async () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup',   onUp);
                el.classList.remove('dragging');
                if (isDragging) {
                    el._wasDragged = true;
                    await this._savePos(id, el);
                }
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup',   onUp);
        });

        /* ── Touch ── */
        el.addEventListener('touchstart', e => {
            if (e.touches.length !== 1) return;
            const t = e.touches[0];
            startX    = t.clientX; startY    = t.clientY;
            startLeft = parseInt(el.style.left) || 0;
            startTop  = parseInt(el.style.top)  || 0;
            elW = el.offsetWidth; elH = el.offsetHeight; /* cache aby uniknąć reflow w onTouchMove */
            isDragging = false;

            /* długie naciśnięcie = menu kontekstowe */
            const longPress = setTimeout(async () => {
                if (!isDragging) {
                    const entry = this._icons.get(id);
                    if (entry && (entry.cfg.menuItems || []).length) {
                        await this._openMenu(
                            { clientX: startX, clientY: startY },
                            id, entry.cfg, entry.cfg.menuItems
                        );
                    }
                }
            }, LONG_PRESS_DELAY);

            const onTouchMove = mv => {
                mv.preventDefault();
                const tc = mv.touches[0];
                const dx = tc.clientX - startX, dy = tc.clientY - startY;
                if (!isDragging && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
                clearTimeout(longPress);
                isDragging = true;
                el.classList.add('dragging');
                const vw = window.innerWidth, vh = window.innerHeight;
                el.style.left = Math.max(0, Math.min(vw - elW, startLeft + dx)) + 'px';
                el.style.top  = Math.max(0, Math.min(vh - elH, startTop  + dy)) + 'px';
            };

            const onTouchEnd = async () => {
                clearTimeout(longPress);
                el.removeEventListener('touchmove', onTouchMove);
                el.removeEventListener('touchend',  onTouchEnd);
                el.classList.remove('dragging');
                if (isDragging) {
                    el._wasDragged = true;
                    await this._savePos(id, el);
                }
            };

            el.addEventListener('touchmove', onTouchMove, { passive: false });
            el.addEventListener('touchend',  onTouchEnd);
        }, { passive: true });
    }

    async _savePos(id, el) {
        const entry = this._icons.get(id);
        if (entry) entry.cfg.position = { x: parseInt(el.style.left), y: parseInt(el.style.top) };
    }
}

/* ════════════════════════════════════════════════════════════
 *  INICJALIZACJA
 * ════════════════════════════════════════════════════════════ */

/* ── 1. Taskbar ── */
const taskbar = new TaskbarManager({ taskbarId: 'taskbar' });
await taskbar.refresh({ showStart: true, items: [] });
await taskbar.setPosition('bottom'); /* domyślna pozycja */

/* ── 2. WindowManager + pierwsze okno ── */


const view = new WindowManager({ containerId: 'windowContainer', taskbarId: 'taskbar' });

// Przypisz metody taskbara jako własności view
// Użyj istniejącej instancji taskbar
view.refreshStartMenu = async (...args) => await taskbar.refreshStartMenu(...args);
view.addStartMenuItem = async (...args) => await taskbar.addStartMenuItem(...args);
view.removeStartMenuItem = async (...args) => await taskbar.removeStartMenuItem(...args);
view.addItem = async (...args) => await taskbar.addItem(...args);
view.removeItem = async (...args) => await taskbar.removeItem(...args);
view.updateItem = async (...args) => await taskbar.updateItem(...args);
view.setPosition = async (...args) => await taskbar.setPosition(...args);
view.setAutoHide = async (...args) => await taskbar.setAutoHide(...args);
view.toggleAutoHide = async (...args) => await taskbar.toggleAutoHide(...args);
view.hide = async (...args) => await taskbar.hide(...args);
view.show = async (...args) => await taskbar.show(...args);

export default view;


/* ── 3. Desktop icons ── */
const desktop = new DesktopIconsManager({ containerId: 'desktopIcons' });
//




//taskbar.setAutoHide(true);

