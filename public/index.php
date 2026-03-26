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

<script src="view/View.js"></script>

<script>

/* ════════════════════════════════════════════════════════════
 *  INICJALIZACJA
 * ════════════════════════════════════════════════════════════ */
const view = new View({ taskbarId: 'taskbar', containerId: 'windowContainer' });

/* ── 1. Taskbar – tylko Start na początku ── */
view.taskbar.refresh({ showStart: true, items: [] });

/* ── 2. Utwórz okno ── */
view.window.create({ title: 'Moja Aplikacja - Windows 11', statusText: 'Gotowe' });

/* ── 3. Podpnij przyciski okna ── */
view.titlebar.bindControls({
    onMinimize: () => {
        view.window.minimize();
    },
    onMaximize: () => {
        if (view.isMaximized()) view.window.restore();
        else                    view.window.maximize();
    },
    onClose: () => {
        view.window.close();
    }
});

/* ── 4. Menubar ── */
view.menubar.refresh({
    menus: [
        {
            label: 'Plik', id: 'menu-file',
            items: [
                { id: 'mi-new',    icon: '📄', label: 'Nowy',        shortcut: 'Ctrl+N', onClick: () => {} },
                { id: 'mi-open',   icon: '📂', label: 'Otwórz',      shortcut: 'Ctrl+O', onClick: () => {} },
                { id: 'mi-save',   icon: '💾', label: 'Zapisz',      shortcut: 'Ctrl+S', onClick: () => {} },
                { id: 'mi-saveas', icon: '📝', label: 'Zapisz jako...', shortcut: 'Ctrl+Shift+S', onClick: () => {} },
                { separator: true },
                { id: 'mi-print',  icon: '🖨️', label: 'Drukuj',      shortcut: 'Ctrl+P', onClick: () => {} },
                { separator: true },
                { id: 'mi-close',  icon: '❌', label: 'Zamknij',     shortcut: 'Alt+F4',
                  onClick: () => { view.window.close(); } }
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
                        { icon: '🔎', label: 'Znajdź w dokumencie', shortcut: 'Ctrl+F',       onClick: () => {} },
                        { icon: '🔄', label: 'Znajdź i zamień',     shortcut: 'Ctrl+H',       onClick: () => {} },
                        { icon: '⏭️', label: 'Znajdź następny',     shortcut: 'F3',           onClick: () => {} },
                        { icon: '⏮️', label: 'Znajdź poprzedni',    shortcut: 'Shift+F3',     onClick: () => {} },
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
                    view.window.setStatus('Windows 11 – wersja 1.0.0');
                }}
            ]
        }
    ]
});

/* ── 5. Zawartość okna ── */
view.content.refresh({
    header:    'Witaj w Windows 11',
    subheader: 'Nowoczesny interfejs z pełnym menu kontekstowym',
    cards: [
        { id: 'card-menu',    title: '🎨 Menu górne',
          text: 'Kliknij na elementy menu na górze okna, aby zobaczyć rozwijane opcje. Menu zawiera podmenu z dodatkowymi opcjami.' },
        { id: 'card-fluent',  title: '✨ Fluent Design',
          text: 'Menu zostało zaprojektowane w stylu Windows 11 z efektem Acrylic, zaokrąglonymi rogami i płynnymi animacjami.' },
        { id: 'card-interact',title: '⚡ Interaktywność',
          text: 'Najedź myszką na opcje z strzałką (▶), aby zobaczyć dodatkowe podmenu. Wszystko działa płynnie i responsywnie.' },
    ]
});

/* ── 6. Resize okna przy zmianie rozmiaru przeglądarki ── */
window.addEventListener('resize', () => {
    if (!view.isMaximized()) view._updateSize();
});

/*
 ════════════════════════════════════════════════════════════
  PRZYKŁADY – wklej w konsolę przeglądarki (F12)
 ════════════════════════════════════════════════════════════

  // Zmień tytuł okna:
  view.window.setTitle('Nowy tytuł');

  // Zmień status bar:
  view.window.setStatus('Plik zapisany pomyślnie');

  // Dodaj nową kartę do treści:
  view.content.addCard({ id: 'card-new', title: '🚀 Nowa karta', text: 'Treść nowej karty.' });

  // Zaktualizuj kartę:
  view.content.updateCard('card-menu', { title: '🎨 Zmieniony tytuł' });

  // Usuń kartę:
  view.content.removeCard('card-fluent');

  // Dodaj pozycję do menu Plik:
  view.menubar.addMenuItem('menu-file', { icon: '📤', label: 'Eksportuj', onClick: () => alert('Eksport!') });

  // Usuń pozycję z menu:
  view.menubar.removeMenuItem('menu-file', 'mi-print');

  // Dodaj nowe menu:
  view.menubar.addMenu({ label: 'Narzędzia', id: 'menu-tools', items: [
      { icon: '🔧', label: 'Opcja 1', onClick: () => {} }
  ]});

  // Usuń menu:
  view.menubar.removeMenu('menu-view');

  // Dodaj przycisk do taskbara ręcznie:
  view.taskbar.addItem({ id: 'tb-extra', icon: '📌', title: 'Przypięty', onClick: () => alert('klik!') });

  // Usuń z taskbara:
  view.taskbar.removeItem('tb-extra');

  // dodaj nowe okno:
    const view2 = new View({ taskbarId: 'taskbar', containerId: 'windowContainer' });
    view2.window.create({ title: 'Drugie okno', statusText: 'Inne okno' });
    view2.titlebar.bindControls({
        onMinimize: () => view2.window.minimize(),
        onMaximize: () => {
            if (view2.isMaximized()) view2.window.restore();
            else                    view2.window.maximize();
        },
        onClose: () => view2.window.close()
    }); 
        // Dodaj menu do drugiego okna
        view2.menubar.refresh({
            menus: [
                {
                    label: 'Plik', id: 'menu2-file',
                    items: [
                        { id: 'mi2-new',    icon: '📄', label: 'Nowy',        shortcut: 'Ctrl+N', onClick: () => {} },
                        { id: 'mi2-open',   icon: '📂', label: 'Otwórz',      shortcut: 'Ctrl+O', onClick: () => {} },
                        { id: 'mi2-save',   icon: '💾', label: 'Zapisz',      shortcut: 'Ctrl+S', onClick: () => {} },
                        { separator: true },
                        { id: 'mi2-close',  icon: '❌', label: 'Zamknij',     shortcut: 'Alt+F4',
                          onClick: () => { view2.window.close(); } }
                    ]
                },
                {
                    label: 'Pomoc', id: 'menu2-help',
                    items: [
                        { icon: 'ℹ️', label: 'O programie', onClick: () => {
                            view2.window.setStatus('Drugie okno – wersja 1.0.0');
                        }}
                    ]
                }
            ]
        });
    
*/
</script>

</body>
</html>