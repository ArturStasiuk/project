<!DOCTYPE html>

<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Moja Aplikacja - Windows 11</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }


    body {
        font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
        background: #1e1e1e;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        min-width: 100vw;
        max-height: 100vh;
        max-width: 100vw;
        padding: 20px;
        overflow: hidden;
        position: fixed;
        inset: 0;
    }

    body.window-maximized { padding: 0; }

    .desktop-bg {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(135deg, #0078d4 0%, #00a3ff 50%, #5eb8ff 100%);
        z-index: -1;
    }

    .window-container {
        width: 100%; height: 100%;
        display: flex; justify-content: center; align-items: center;
        overflow: hidden;
    }

    /* ── WINDOW ── */
    .window {
        width: min(900px, calc(100vw - 40px));
        height: min(600px, calc(100vh - 40px));
        background: rgba(243, 243, 243, 0.95);
        backdrop-filter: blur(40px);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2),
                    inset 0 1px 0 rgba(255,255,255,0.5);
        display: flex; flex-direction: column;
        border: 1px solid rgba(255,255,255,0.2);
        animation: windowOpen 0.3s cubic-bezier(0.16,1,0.3,1);
        transform: perspective(1000px) translateZ(0);
        transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        position: relative;
    }
    .window.maximized {
        width: 100vw !important; height: 100vh !important;
        border-radius: 0; position: fixed; top: 0; left: 0; margin: 0;
    }
    .window.minimized {
        opacity: 0; transform: scale(0.9) translateY(100px);
        pointer-events: none;
    }
    .window.closing {
        animation: windowClose 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    @keyframes windowClose {
        to { opacity: 0; transform: scale(0.9) translateY(20px); }
    }
    @keyframes windowOpen {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* ── TITLEBAR ── */
    .titlebar {
        height: 48px;
        background: rgba(32,32,32,0.85);
        backdrop-filter: blur(40px);
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05);
        flex-shrink: 0;
    }
    .titlebar-left { display: flex; align-items: center; gap: 12px; }
    .window-icon {
        width: 20px; height: 20px;
        background: linear-gradient(135deg, #0078d4, #1ea7fd);
        border-radius: 4px; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(0,120,212,0.5), inset 0 1px 0 rgba(255,255,255,0.3),
                    inset 0 -1px 0 rgba(0,0,0,0.2);
    }
    .window-icon::before {
        content: ''; width: 12px; height: 12px;
        background: rgba(255,255,255,0.9); border-radius: 2px;
    }
    .window-title { color: #fff; font-size: 12px; font-weight: 400; letter-spacing: 0.2px; }

    .titlebar-controls { display: flex; gap: 0; margin-right: -8px; }
    .titlebar-button {
        width: 46px; height: 48px; border: none; background: transparent;
        color: #fff; cursor: pointer; display: flex; align-items: center;
        justify-content: center; transition: background-color 0.08s ease;
        font-size: 10px;
    }
    .titlebar-button:hover { background: rgba(255,255,255,0.08); }
    .titlebar-button:active { background: rgba(255,255,255,0.05); }
    .titlebar-button.close:hover { background: #c42b1c; }
    .titlebar-button.close:active { background: #a02314; }

    .minimize-icon { width: 10px; height: 1px; background: currentColor; }
    .maximize-icon {
        width: 10px; height: 10px; border: 1px solid currentColor;
        border-radius: 1px; transition: transform 0.2s ease;
    }
    .window.maximized .maximize-icon { width: 9px; height: 9px; position: relative; }
    .window.maximized .maximize-icon::before {
        content: ''; position: absolute; width: 9px; height: 9px;
        border: 1px solid currentColor; top: -3px; left: 3px;
        background: rgba(32,32,32,0.85);
    }
    .close-icon { position: relative; width: 12px; height: 12px; }
    .close-icon::before, .close-icon::after {
        content: ''; position: absolute; width: 12px; height: 1px;
        background: currentColor; top: 50%; left: 0;
    }
    .close-icon::before { transform: rotate(45deg); }
    .close-icon::after  { transform: rotate(-45deg); }

    /* ── MENUBAR ── */
    .menubar {
        height: 40px; background: #fff;
        border-bottom: 1px solid rgba(0,0,0,0.08);
        display: flex; align-items: stretch;
        padding: 0 8px; position: relative; z-index: 100; flex-shrink: 0;
    }
    .menu-item {
        position: relative; display: flex; align-items: center;
        padding: 0 12px; font-size: 13px; color: #1f1f1f;
        cursor: pointer; transition: background-color 0.08s ease;
        border-radius: 4px; margin: 4px 2px;
        user-select: none; white-space: nowrap;
    }
    .menu-item:hover { background: rgba(0,0,0,0.04); }
    .menu-item.active { background: rgba(0,120,212,0.1); }

    .dropdown-menu {
        position: absolute; top: 100%; left: 0; min-width: 220px;
        background: rgba(249,249,249,0.98); backdrop-filter: blur(40px);
        border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        border: 1px solid rgba(0,0,0,0.08); padding: 4px; margin-top: 4px;
        opacity: 0; visibility: hidden; transform: translateY(-8px);
        transition: all 0.15s cubic-bezier(0.16,1,0.3,1);
        z-index: 1000; max-height: 80vh; overflow-y: auto;
    }
    .menu-item.active .dropdown-menu {
        opacity: 1; visibility: visible; transform: translateY(0);
    }
    .dropdown-item {
        display: flex; align-items: center; padding: 8px 12px;
        font-size: 13px; color: #1f1f1f; cursor: pointer;
        border-radius: 4px; transition: background-color 0.08s ease;
        position: relative; white-space: nowrap;
    }
    .dropdown-item:hover { background: rgba(0,120,212,0.08); }
    .dropdown-item.disabled { color: #a0a0a0; cursor: default; }
    .dropdown-item.disabled:hover { background: transparent; }
    .dropdown-item-icon { width: 16px; margin-right: 12px; text-align: center; }
    .dropdown-item-shortcut {
        margin-left: auto; padding-left: 24px; font-size: 11px; color: #616161;
    }
    .dropdown-separator { height: 1px; background: rgba(0,0,0,0.08); margin: 4px 8px; }
    .submenu-indicator { margin-left: auto; padding-left: 24px; font-size: 10px; color: #616161; }
    .submenu {
        position: absolute; left: 100%; top: -4px; min-width: 200px;
        background: rgba(249,249,249,0.98); backdrop-filter: blur(40px);
        border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        border: 1px solid rgba(0,0,0,0.08); padding: 4px; margin-left: 4px;
        opacity: 0; visibility: hidden; transform: translateX(-8px);
        transition: all 0.15s cubic-bezier(0.16,1,0.3,1);
    }
    .dropdown-item:hover .submenu {
        opacity: 1; visibility: visible; transform: translateX(0);
    }

    /* ── CONTENT ── */
    .window-content {
        flex: 1; padding: 24px;
        background: linear-gradient(to bottom, #f9f9f9 0%, #f3f3f3 100%);
        overflow: auto; min-height: 0;
    }
    .content-header {
        font-size: clamp(20px,4vw,28px); font-weight: 600; color: #1f1f1f;
        margin-bottom: 8px; letter-spacing: -0.3px;
    }
    .content-subheader {
        font-size: clamp(12px,2vw,14px); color: #616161;
        margin-bottom: 20px; font-weight: 400;
    }
    .card {
        background: #fff; border-radius: 8px; padding: clamp(12px,3vw,20px);
        margin-bottom: clamp(8px,2vw,16px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04),
                    inset 0 1px 0 rgba(255,255,255,0.8);
        border: 1px solid rgba(0,0,0,0.06);
        transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .card:hover {
        box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.08),
                    inset 0 1px 0 rgba(255,255,255,0.9);
        transform: translateY(-4px);
    }
    .card-title { font-size: clamp(14px,2.5vw,16px); font-weight: 600; color: #1f1f1f; margin-bottom: 8px; }
    .card-text  { font-size: clamp(12px,2vw,14px); color: #616161; line-height: 1.6; }

    /* ── STATUS BAR ── */
    .status-bar {
        height: 32px; background: rgba(249,249,249,0.8);
        border-top: 1px solid rgba(0,0,0,0.06);
        display: flex; align-items: center; padding: 0 16px;
        font-size: 12px; color: #616161; flex-shrink: 0;
    }

    /* ── TASKBAR ── */
    .taskbar {
        position: fixed; bottom: 0; left: 0; right: 0;
        height: 48px;
        background: rgba(32,32,32,0.95);
        backdrop-filter: blur(40px);
        display: flex; align-items: center; justify-content: center;
        gap: 4px; padding: 0 8px;
        z-index: 10000;
        box-shadow: 0 -2px 16px rgba(0,0,0,0.3);
    }

    /* przycisk Start */
    .taskbar-start {
        width: 40px; height: 36px;
        background: transparent; border: none; cursor: pointer;
        border-radius: 6px; display: flex; align-items: center;
        justify-content: center; transition: background 0.15s ease;
        margin-right: 4px; flex-shrink: 0;
    }
    .taskbar-start:hover { background: rgba(255,255,255,0.12); }
    .taskbar-start-icon {
        width: 18px; height: 18px;
        display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
    }
    .taskbar-start-icon span {
        background: #fff; border-radius: 1px; display: block;
    }

    /* separator */
    .taskbar-sep {
        width: 1px; height: 24px;
        background: rgba(255,255,255,0.12); margin: 0 4px; flex-shrink: 0;
    }

    /* okna zminimalizowane */
    .taskbar-item {
        display: flex; align-items: center; gap: 8px;
        padding: 6px 12px;
        background: rgba(255,255,255,0.08);
        border-radius: 6px; cursor: pointer;
        transition: all 0.2s ease; user-select: none;
        position: relative; max-width: 180px;
    }
    .taskbar-item:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
    .taskbar-item:active { transform: translateY(0); }
    .taskbar-item-icon {
        width: 20px; height: 20px; flex-shrink: 0;
        background: linear-gradient(135deg, #0078d4, #1ea7fd);
        border-radius: 4px; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,120,212,0.4); font-size: 12px;
    }
    .taskbar-item-icon::before {
        content: ''; width: 12px; height: 12px;
        background: rgba(255,255,255,0.9); border-radius: 2px;
    }
    .taskbar-item-icon.custom::before { display: none; }
    .taskbar-item-title {
        color: #fff; font-size: 12px; font-weight: 400;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    /* menu taskbara (prawy przycisk / rozwijane) */
    .taskbar-menu {
        position: absolute; bottom: 56px; left: 0;
        min-width: 160px;
        background: rgba(40,40,40,0.97);
        backdrop-filter: blur(20px);
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.08);
        padding: 4px; z-index: 20000;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        opacity: 0; visibility: hidden; transform: translateY(8px);
        transition: all 0.15s cubic-bezier(0.16,1,0.3,1);
    }
    .taskbar-menu.open { opacity: 1; visibility: visible; transform: translateY(0); }
    .taskbar-menu-item {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 12px; border-radius: 4px; cursor: pointer;
        font-size: 13px; color: #f0f0f0;
        transition: background 0.08s ease;
    }
    .taskbar-menu-item:hover { background: rgba(255,255,255,0.1); }
    .taskbar-menu-sep { height: 1px; background: rgba(255,255,255,0.08); margin: 4px 8px; }

    /* prawy obszar paska (ikona okien + zegar) */
    .taskbar-right {
        position: absolute; right: 8px;
        display: flex; align-items: center; gap: 4px;
    }

    /* przycisk tray z listą okien */
    .taskbar-tray-btn {
        width: 36px; height: 36px;
        background: transparent; border: none; cursor: pointer;
        border-radius: 6px; display: flex; align-items: center;
        justify-content: center; transition: background 0.15s ease;
        color: #fff; font-size: 18px; position: relative;
        flex-shrink: 0;
    }
    .taskbar-tray-btn:hover { background: rgba(255,255,255,0.12); }

    /* dropdown z listą okien */
    .taskbar-windows-menu {
        position: absolute; bottom: 46px; right: 0;
        min-width: 220px;
        background: rgba(40,40,40,0.97);
        backdrop-filter: blur(20px);
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.08);
        padding: 4px; z-index: 20000;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        opacity: 0; visibility: hidden; transform: translateY(8px);
        transition: all 0.15s cubic-bezier(0.16,1,0.3,1);
    }
    .taskbar-windows-menu.open { opacity: 1; visibility: visible; transform: translateY(0); }
    .taskbar-windows-menu-item {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 12px; border-radius: 4px; cursor: pointer;
        font-size: 13px; color: #f0f0f0;
        transition: background 0.08s ease;
    }
    .taskbar-windows-menu-item:hover { background: rgba(255,255,255,0.1); }
    .taskbar-windows-menu-item.minimized { opacity: 0.65; }
    .taskbar-windows-menu-empty {
        padding: 8px 12px; font-size: 13px; color: rgba(255,255,255,0.45);
    }

    /* zegar */
    .taskbar-clock {
        color: #fff; font-size: 11px; text-align: right;
        line-height: 1.4; padding: 4px 8px; border-radius: 4px;
        cursor: default; user-select: none; white-space: nowrap;
    }
    .taskbar-clock:hover { background: rgba(255,255,255,0.08); }

    /* scrollbar */
    ::-webkit-scrollbar { width: 12px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.2); border-radius: 6px;
        border: 3px solid transparent; background-clip: padding-box;
    }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); background-clip: padding-box; }

    /* responsive */
    @media (max-height: 700px) {
        .window:not(.maximized) { height: calc(100vh - 40px); }
        .window-content { padding: 16px; }
        .content-header { margin-bottom: 4px; }
        .content-subheader { margin-bottom: 16px; }
    }
    @media (max-width: 768px) {
        body { padding: 10px; }
        .window:not(.maximized) { width: calc(100vw - 20px); height: calc(100vh - 20px); }
        .titlebar { height: 40px; padding: 0 12px; }
        .titlebar-button { width: 40px; height: 40px; }
        .menubar { height: 36px; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; }
        .menubar::-webkit-scrollbar { display: none; }
        .menu-item { font-size: 12px; padding: 0 8px; }
        .dropdown-menu { min-width: 200px; max-height: 60vh; }
    }
    @media (max-width: 480px) {
        .window:not(.maximized) { border-radius: 8px; }
        .menubar { font-size: 11px; }
        .menu-item { padding: 0 6px; }
        .window-content { padding: 12px; }
        .card { padding: 12px; margin-bottom: 12px; }
        .taskbar { height: 40px; }
        .taskbar-item { padding: 4px 8px; }
        .taskbar-item-title { display: none; }
    }
</style>


</head>
<body>
    <div class="desktop-bg"></div>
    <div class="taskbar" id="taskbar"></div>
    <div class="window-container" id="windowContainer"></div>

<script>
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
</script>

</body>
</html>