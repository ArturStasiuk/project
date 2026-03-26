<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Moja Aplikacja - Windows 11</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* ── BASE ── */
        body {
            font-family: 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif;
            width: 100vw; height: 100vh;
            overflow: hidden;
            position: fixed; inset: 0;
        }
        .desktop-bg {
            position: fixed; inset: 0;
            background: linear-gradient(135deg, #0078d4 0%, #00a3ff 50%, #5eb8ff 100%);
            z-index: -1;
        }
        .window-container {
            position: fixed;
            top: 0; left: 0; right: 0;
            bottom: 48px;
            overflow: hidden;
        }
        @media (max-width: 480px) { .window-container { bottom: 44px; } }

        /* ══════════════════════════════════════
         *  WINDOW
         * ══════════════════════════════════════ */
        .window {
            position: absolute;
            display: flex; flex-direction: column;
            background: rgba(243,243,243,0.96);
            backdrop-filter: blur(40px);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.22);
            box-shadow: 0 20px 60px rgba(0,0,0,0.28), 0 6px 20px rgba(0,0,0,0.18),
                        inset 0 1px 0 rgba(255,255,255,0.5);
            min-width: 300px; min-height: 220px;
            transition: box-shadow 0.2s ease;
            will-change: transform;
        }
        .window.focused {
            box-shadow: 0 28px 72px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.25),
                        inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .window.unfocused { opacity: 0.88; }
        .window.maximized {
            border-radius: 0 !important;
            transition: none;
        }
        .window.maximized .win-resize { display: none; }

        @keyframes winOpen {
            from { opacity: 0; transform: scale(0.94) translateY(10px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes winClose {
            from { opacity: 1; transform: scale(1); }
            to   { opacity: 0; transform: scale(0.92) translateY(14px); }
        }
        @keyframes winMinimize {
            from { opacity: 1; transform: scale(1) translateY(0); }
            to   { opacity: 0; transform: scale(0.88) translateY(50px); }
        }
        .win-anim-open     { animation: winOpen     0.24s cubic-bezier(0.16,1,0.3,1) forwards; }
        .win-anim-close    { animation: winClose    0.2s  cubic-bezier(0.55,0,1,0.45) forwards; }
        .win-anim-minimize { animation: winMinimize 0.22s cubic-bezier(0.55,0,1,0.45) forwards; }
        .win-anim-restore  { animation: winOpen     0.24s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ── RESIZE HANDLES ── */
        .win-resize { position: absolute; z-index: 10; }
        .win-resize-n  { top: 0;    left: 10px; right: 10px;  height: 5px;  cursor: n-resize; }
        .win-resize-s  { bottom: 0; left: 10px; right: 10px;  height: 5px;  cursor: s-resize; }
        .win-resize-w  { left: 0;   top: 10px;  bottom: 10px; width: 5px;   cursor: w-resize; }
        .win-resize-e  { right: 0;  top: 10px;  bottom: 10px; width: 5px;   cursor: e-resize; }
        .win-resize-nw { top: 0;    left: 0;    width: 14px;  height: 14px; cursor: nw-resize; }
        .win-resize-ne { top: 0;    right: 0;   width: 14px;  height: 14px; cursor: ne-resize; }
        .win-resize-sw { bottom: 0; left: 0;    width: 14px;  height: 14px; cursor: sw-resize; }
        .win-resize-se { bottom: 0; right: 0;   width: 14px;  height: 14px; cursor: se-resize; border-radius: 0 0 12px 0; }

        /* ── TITLEBAR ── */
        .titlebar {
            height: 48px; flex-shrink: 0;
            background: rgba(28,28,28,0.92);
            backdrop-filter: blur(40px);
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 0 0 16px;
            box-shadow: 0 1px 0 rgba(255,255,255,0.06);
            user-select: none; -webkit-user-select: none;
            cursor: default;
        }
        .titlebar-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; pointer-events: none; }
        .window-icon {
            width: 20px; height: 20px; flex-shrink: 0;
            border-radius: 4px; display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #0078d4, #1ea7fd);
            box-shadow: 0 2px 8px rgba(0,120,212,0.5); font-size: 13px;
        }
        .window-icon.default::before {
            content: ''; width: 12px; height: 12px;
            background: rgba(255,255,255,0.9); border-radius: 2px;
        }
        .window-title {
            color: #fff; font-size: 12px; font-weight: 400; letter-spacing: 0.2px;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .titlebar-controls { display: flex; margin-right: 0; flex-shrink: 0; }
        .titlebar-button {
            width: 46px; height: 48px; border: none; background: transparent;
            color: rgba(255,255,255,0.9); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: background-color 0.08s ease; flex-shrink: 0;
        }
        .titlebar-button:hover  { background: rgba(255,255,255,0.09); }
        .titlebar-button:active { background: rgba(255,255,255,0.05); }
        .titlebar-button.close:hover  { background: #c42b1c; }
        .titlebar-button.close:active { background: #a02314; }
        @media (max-width: 480px) {
            .titlebar { height: 42px; }
            .titlebar-button { width: 40px; height: 42px; }
        }
        .minimize-icon { width: 10px; height: 1px; background: currentColor; }
        .maximize-icon { width: 10px; height: 10px; border: 1px solid currentColor; border-radius: 1px; }
        .window.maximized .maximize-icon { position: relative; }
        .window.maximized .maximize-icon::before {
            content: ''; position: absolute; width: 9px; height: 9px;
            border: 1px solid currentColor; top: -3px; left: 3px;
            background: rgba(28,28,28,0.92);
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
            height: 40px; flex-shrink: 0; position: relative; z-index: 100;
            background: #fff;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            display: flex; align-items: stretch;
            padding: 0 6px;
            overflow: visible;
        }
        .menu-item {
            position: relative; display: flex; align-items: center;
            padding: 0 11px; font-size: 13px; color: #1f1f1f;
            cursor: pointer; border-radius: 4px; margin: 4px 1px;
            user-select: none; white-space: nowrap;
            transition: background-color 0.08s ease;
        }
        .menu-item:hover  { background: rgba(0,0,0,0.05); }
        .menu-item.active { background: rgba(0,120,212,0.1); color: #005fb8; }

        .menu-hamburger {
            display: none; align-items: center; justify-content: center;
            width: 36px; height: 32px; margin: 4px 2px;
            border: none; background: transparent; cursor: pointer;
            border-radius: 4px; flex-shrink: 0;
        }
        .menu-hamburger:hover { background: rgba(0,0,0,0.05); }
        .menu-hamburger-icon { width: 16px; display: flex; flex-direction: column; gap: 3px; }
        .menu-hamburger-icon span { width: 100%; height: 1.5px; background: #333; border-radius: 1px; display: block; }

        .dropdown-menu {
            position: absolute; top: calc(100% + 2px); left: 0;
            min-width: 220px;
            background: rgba(249,249,249,0.99); backdrop-filter: blur(40px);
            border-radius: 8px;
            box-shadow: 0 8px 28px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.08);
            padding: 4px; z-index: 1000;
            max-height: 75vh; overflow-y: auto;
            opacity: 0; visibility: hidden; transform: translateY(-6px);
            transition: opacity 0.12s ease, transform 0.12s ease, visibility 0s linear 0.12s;
        }
        .menu-item.active .dropdown-menu {
            opacity: 1; visibility: visible; transform: translateY(0);
            transition: opacity 0.12s ease, transform 0.12s ease, visibility 0s;
        }
        .dropdown-item {
            display: flex; align-items: center; padding: 7px 11px;
            font-size: 13px; color: #1f1f1f; cursor: pointer;
            border-radius: 4px; transition: background-color 0.08s ease;
            position: relative;
        }
        .dropdown-item:hover { background: rgba(0,120,212,0.08); color: #005fb8; }
        .dropdown-item.disabled { color: #b0b0b0; cursor: default; }
        .dropdown-item.disabled:hover { background: transparent; color: #b0b0b0; }
        .dropdown-item-icon     { width: 20px; flex-shrink: 0; margin-right: 10px; text-align: center; font-size: 14px; }
        .dropdown-item-label    { flex: 1; white-space: nowrap; }
        .dropdown-item-shortcut { padding-left: 20px; font-size: 11px; color: #909090; white-space: nowrap; }
        .dropdown-separator     { height: 1px; background: rgba(0,0,0,0.08); margin: 4px 8px; }
        .submenu-indicator      { padding-left: 6px; font-size: 10px; color: #999; }
        .submenu {
            position: absolute; left: calc(100% + 2px); top: -4px;
            min-width: 200px;
            background: rgba(249,249,249,0.99); backdrop-filter: blur(40px);
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            border: 1px solid rgba(0,0,0,0.08);
            padding: 4px; z-index: 1001;
            opacity: 0; visibility: hidden; transform: translateX(-6px);
            transition: opacity 0.12s ease, transform 0.12s ease, visibility 0s linear 0.12s;
        }
        .dropdown-item:hover > .submenu {
            opacity: 1; visibility: visible; transform: translateX(0);
            transition: opacity 0.12s ease, transform 0.12s ease, visibility 0s;
        }

        /* Mobile accordion menu panel */
        .menubar-mobile-panel {
            display: none;
            position: absolute; top: 100%; left: 0; right: 0;
            background: rgba(252,252,252,0.99); backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(0,0,0,0.1);
            box-shadow: 0 8px 24px rgba(0,0,0,0.14);
            z-index: 998; max-height: 60vh; overflow-y: auto;
        }
        .menubar-mobile-panel.open { display: block; }
        .mob-group-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 10px 14px 10px 16px;
            font-size: 13px; font-weight: 600; color: #1f1f1f;
            cursor: pointer; user-select: none;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            transition: background 0.1s ease;
        }
        .mob-group-header:hover { background: rgba(0,0,0,0.03); }
        .mob-group-header .mob-arrow { font-size: 10px; color: #888; transition: transform 0.2s ease; }
        .mob-group-header.open .mob-arrow { transform: rotate(90deg); }
        .mob-group-items { display: none; background: rgba(0,0,0,0.02); }
        .mob-group-items.open { display: block; }
        .mob-item {
            display: flex; align-items: center; padding: 9px 14px 9px 28px;
            font-size: 13px; color: #1f1f1f; cursor: pointer;
            transition: background 0.08s ease;
        }
        .mob-item:hover { background: rgba(0,120,212,0.08); color: #005fb8; }
        .mob-item.disabled { color: #b0b0b0; cursor: default; }
        .mob-item.disabled:hover { background: transparent; color: #b0b0b0; }
        .mob-item-icon     { width: 20px; flex-shrink: 0; margin-right: 10px; }
        .mob-item-label    { flex: 1; }
        .mob-item-shortcut { font-size: 11px; color: #999; }
        .mob-sub-item      { padding-left: 44px; font-size: 12px; color: #444; }
        .mob-sub-item:hover { background: rgba(0,120,212,0.06); color: #005fb8; }
        .mob-separator     { height: 1px; background: rgba(0,0,0,0.07); margin: 2px 16px; }

        @media (max-width: 768px) {
            .menubar > .menu-item { display: none !important; }
            .menu-hamburger { display: flex; }
        }
        @media (max-width: 480px) { .menubar { height: 38px; } }

        /* ── WINDOW CONTENT ── */
        .window-content {
            flex: 1; min-height: 0;
            padding: clamp(12px, 3vw, 24px);
            background: linear-gradient(180deg, #f9f9f9, #f2f2f2);
            overflow: auto;
        }
        .content-header {
            font-size: clamp(18px, 4vw, 28px); font-weight: 600;
            color: #1a1a1a; margin-bottom: 6px; letter-spacing: -0.3px;
        }
        .content-subheader {
            font-size: clamp(12px, 2vw, 14px); color: #616161;
            margin-bottom: clamp(12px, 3vw, 20px); font-weight: 400; line-height: 1.5;
        }
        .card {
            background: #fff; border-radius: 8px;
            padding: clamp(12px, 3vw, 20px); margin-bottom: clamp(8px, 2vw, 14px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
            border: 1px solid rgba(0,0,0,0.06);
            transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .card:hover {
            box-shadow: 0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
            transform: translateY(-2px);
        }
        .card-title { font-size: clamp(13px, 2.5vw, 15px); font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .card-text  { font-size: clamp(12px, 2vw, 13px); color: #616161; line-height: 1.6; }

        /* ── STATUS BAR ── */
        .status-bar {
            height: 28px; flex-shrink: 0;
            background: rgba(249,249,249,0.85);
            border-top: 1px solid rgba(0,0,0,0.06);
            display: flex; align-items: center;
            padding: 0 14px; font-size: 12px; color: #666; gap: 12px;
        }
        .status-bar-right { margin-left: auto; display: flex; gap: 12px; }

        /* ══════════════════════════════════════
         *  TASKBAR
         * ══════════════════════════════════════ */
        .taskbar {
            position: fixed; bottom: 0; left: 0; right: 0;
            height: 48px;
            background: rgba(28,28,28,0.96);
            backdrop-filter: blur(40px);
            display: flex; align-items: center;
            padding: 0 6px; gap: 2px;
            z-index: 10000;
            box-shadow: 0 -1px 0 rgba(255,255,255,0.05), 0 -4px 20px rgba(0,0,0,0.4);
        }
        @media (max-width: 480px) { .taskbar { height: 44px; padding: 0 4px; } }

        .taskbar-start {
            width: 40px; height: 38px; flex-shrink: 0;
            border: none; background: transparent; cursor: pointer;
            border-radius: 6px;
            display: flex; align-items: center; justify-content: center;
            transition: background 0.15s ease;
        }
        .taskbar-start:hover  { background: rgba(255,255,255,0.12); }
        .taskbar-start:active { background: rgba(255,255,255,0.06); }
        .taskbar-start-grid {
            width: 18px; height: 18px;
            display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
        }
        .taskbar-start-grid span { background: #fff; border-radius: 1px; display: block; }

        .taskbar-sep {
            width: 1px; height: 24px; flex-shrink: 0;
            background: rgba(255,255,255,0.1); margin: 0 2px;
        }

        .taskbar-pins { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
        .taskbar-pin {
            width: 38px; height: 38px; flex-shrink: 0;
            border: none; background: transparent; cursor: pointer;
            border-radius: 6px;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; position: relative;
            transition: background 0.15s ease;
        }
        .taskbar-pin:hover  { background: rgba(255,255,255,0.12); }
        .taskbar-pin:active { background: rgba(255,255,255,0.06); }
        .taskbar-pin-dot {
            position: absolute; bottom: 4px; left: 50%;
            transform: translateX(-50%);
            width: 4px; height: 4px;
            background: #60cdff; border-radius: 50%;
        }

        .taskbar-windows {
            display: flex; align-items: center; gap: 2px;
            flex: 1; min-width: 0; overflow: hidden;
        }
        .taskbar-item {
            display: flex; align-items: center; gap: 7px;
            padding: 5px 10px; flex-shrink: 0;
            background: rgba(255,255,255,0.09);
            border-radius: 6px; cursor: pointer;
            transition: background 0.15s ease, transform 0.15s ease;
            user-select: none; max-width: 180px; min-width: 36px;
            position: relative;
        }
        .taskbar-item:hover  { background: rgba(255,255,255,0.16); transform: translateY(-1px); }
        .taskbar-item:active { background: rgba(255,255,255,0.10); transform: translateY(0); }
        .taskbar-item.tb-active {
            background: rgba(255,255,255,0.16);
            border-bottom: 2px solid #60cdff;
        }
        .taskbar-item-icon {
            width: 20px; height: 20px; flex-shrink: 0;
            border-radius: 4px; display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #0078d4, #1ea7fd);
            box-shadow: 0 2px 8px rgba(0,120,212,0.35); font-size: 13px;
        }
        .taskbar-item-icon.default::before {
            content: ''; width: 12px; height: 12px;
            background: rgba(255,255,255,0.9); border-radius: 2px;
        }
        .taskbar-item-title {
            color: #e8e8e8; font-size: 12px; font-weight: 400;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            flex: 1; min-width: 0;
        }
        @media (max-width: 768px) {
            .taskbar-item-title { display: none; }
            .taskbar-item { padding: 5px 7px; min-width: 32px; }
        }
        @media (max-width: 480px) { .taskbar-item { padding: 4px 6px; } }

        .taskbar-overflow-btn {
            width: 32px; height: 38px; flex-shrink: 0;
            border: none; background: transparent; cursor: pointer;
            border-radius: 6px;
            display: none; align-items: center; justify-content: center;
            color: #ccc; font-size: 16px; font-weight: 600;
            transition: background 0.15s ease;
        }
        .taskbar-overflow-btn.visible { display: flex; }
        .taskbar-overflow-btn:hover  { background: rgba(255,255,255,0.12); color: #fff; }
        .taskbar-overflow-btn:active { background: rgba(255,255,255,0.06); }

        .taskbar-overflow-popup {
            position: fixed; min-width: 230px; max-width: 340px;
            background: rgba(36,36,36,0.98); backdrop-filter: blur(20px);
            border-radius: 10px; border: 1px solid rgba(255,255,255,0.09);
            padding: 6px; z-index: 20000;
            box-shadow: 0 14px 40px rgba(0,0,0,0.55);
            opacity: 0; visibility: hidden; transform: translateY(8px);
            transition: all 0.15s cubic-bezier(0.16,1,0.3,1);
            pointer-events: none;
        }
        .taskbar-overflow-popup.open {
            opacity: 1; visibility: visible; transform: translateY(0);
            pointer-events: all;
        }
        .overflow-popup-title {
            font-size: 11px; color: #888; padding: 4px 10px 8px;
            letter-spacing: 0.5px; text-transform: uppercase;
        }
        .overflow-popup-item {
            display: flex; align-items: center; gap: 10px;
            padding: 8px 10px; border-radius: 6px; cursor: pointer;
            transition: background 0.1s ease;
        }
        .overflow-popup-item:hover { background: rgba(255,255,255,0.1); }
        .overflow-popup-icon {
            width: 22px; height: 22px; flex-shrink: 0;
            border-radius: 4px; display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #0078d4, #1ea7fd); font-size: 13px;
        }
        .overflow-popup-icon.default::before {
            content: ''; width: 12px; height: 12px;
            background: rgba(255,255,255,0.9); border-radius: 2px;
        }
        .overflow-popup-label { color: #ebebeb; font-size: 13px; flex: 1; }

        .taskbar-ctx-menu {
            position: fixed; min-width: 180px;
            background: rgba(36,36,36,0.98); backdrop-filter: blur(20px);
            border-radius: 8px; border: 1px solid rgba(255,255,255,0.09);
            padding: 4px; z-index: 20001;
            box-shadow: 0 8px 28px rgba(0,0,0,0.55);
            opacity: 0; visibility: hidden;
            transition: opacity 0.1s ease, visibility 0s linear 0.1s;
            pointer-events: none;
        }
        .taskbar-ctx-menu.open {
            opacity: 1; visibility: visible;
            transition: opacity 0.1s ease, visibility 0s;
            pointer-events: all;
        }
        .taskbar-ctx-item {
            display: flex; align-items: center; gap: 10px;
            padding: 8px 12px; border-radius: 4px; cursor: pointer;
            font-size: 13px; color: #f0f0f0;
            transition: background 0.08s ease;
        }
        .taskbar-ctx-item:hover { background: rgba(255,255,255,0.1); }
        .taskbar-ctx-sep { height: 1px; background: rgba(255,255,255,0.09); margin: 4px 8px; }

        .taskbar-tray {
            display: flex; align-items: center; gap: 2px;
            flex-shrink: 0; margin-left: auto; padding-left: 4px;
        }
        .taskbar-clock {
            color: #ccc; font-size: 11px; line-height: 1.4;
            padding: 3px 8px; border-radius: 4px;
            text-align: center; cursor: default; white-space: nowrap;
            transition: background 0.1s ease;
        }
        .taskbar-clock:hover { background: rgba(255,255,255,0.09); }
        @media (max-width: 480px) { .taskbar-clock { display: none; } }

        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.22); border-radius: 5px;
            border: 2px solid transparent; background-clip: padding-box;
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.38); background-clip: padding-box; }

        body.win-dragging   { cursor: move !important;    user-select: none !important; }
        body.win-resizing   { user-select: none !important; }
        body.win-resizing * { cursor: inherit !important; }

        @media (max-height: 600px) {
            .window:not(.maximized) { max-height: calc(100vh - 52px) !important; }
            .dropdown-menu { max-height: 50vh; }
        }
    </style>
</head>
<body>
    <div class="desktop-bg"></div>
    <div class="taskbar"          id="taskbar"></div>
    <div class="window-container" id="windowContainer"></div>

<script>
/* ======================================================================
 *  WindowManager  – singleton zarządzający wszystkimi oknami
 *
 *  API:
 *    createWindow(cfg)  → id
 *      cfg: { id?, title?, icon?, statusText?, width?, height?, x?, y? }
 *    closeWindow(id)
 *    minimizeWindow(id)
 *    maximizeWindow(id)   (toggle max/restore)
 *    restoreWindow(id)
 *    focusWindow(id)
 *    onResize()           – wywołaj przy window.resize
 *    getWindowEl(id)      → HTMLElement | null
 *    getWindowState(id)   → { id, title, icon, minimized, maximized }
 *    getWindowIds()       → string[]
 *    isMinimized(id), isMaximized(id)
 *    getFocusedId()
 * ====================================================================== */
class WindowManager {
    constructor(containerId) {
        this._cont    = document.getElementById(containerId);
        this._windows = new Map();   // id -> HTMLElement
        this._z       = 100;
        this._focused = null;

        document.addEventListener('mousedown',  e => this._hitTest(e), true);
        document.addEventListener('touchstart', e => this._hitTest(e), { capture: true, passive: true });
    }

    _uid()  { return 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

    _hitTest(e) {
        const winEl = e.target && e.target.closest && e.target.closest('.window');
        if (winEl && winEl.dataset.winId) this.focusWindow(winEl.dataset.winId);
    }

    _html(title, icon, statusText) {
        const iconHtml  = icon ? '<span style="font-size:14px">' + icon + '</span>' : '';
        const iconClass = 'window-icon' + (icon ? '' : ' default');
        return [
            '<div class="win-resize win-resize-n"  data-dir="n"></div>',
            '<div class="win-resize win-resize-s"  data-dir="s"></div>',
            '<div class="win-resize win-resize-w"  data-dir="w"></div>',
            '<div class="win-resize win-resize-e"  data-dir="e"></div>',
            '<div class="win-resize win-resize-nw" data-dir="nw"></div>',
            '<div class="win-resize win-resize-ne" data-dir="ne"></div>',
            '<div class="win-resize win-resize-sw" data-dir="sw"></div>',
            '<div class="win-resize win-resize-se" data-dir="se"></div>',
            '<div class="titlebar">',
            '  <div class="titlebar-left">',
            '    <div class="' + iconClass + '">' + iconHtml + '</div>',
            '    <span class="window-title">' + title + '</span>',
            '  </div>',
            '  <div class="titlebar-controls">',
            '    <button class="titlebar-button minimize" title="Minimalizuj"><div class="minimize-icon"></div></button>',
            '    <button class="titlebar-button maximize" title="Maksymalizuj / Przywróć"><div class="maximize-icon"></div></button>',
            '    <button class="titlebar-button close"   title="Zamknij"><div class="close-icon"></div></button>',
            '  </div>',
            '</div>',
            '<div class="menubar"></div>',
            '<div class="window-content"></div>',
            '<div class="status-bar">',
            '  <span class="status-text">' + statusText + '</span>',
            '  <span class="status-bar-right"></span>',
            '</div>'
        ].join('\n');
    }

    /* ---- CREATE ---- */
    createWindow({ id, title = '', icon = null, statusText = 'Gotowe',
                   width, height, x, y } = {}) {
        if (!id) id = this._uid();
        const vw = this._cont.offsetWidth;
        const vh = this._cont.offsetHeight;
        const w  = width  || Math.min(900, Math.max(400, vw - 60));
        const h  = height || Math.min(600, Math.max(280, vh - 60));
        const n  = this._windows.size;
        const px = (x != null) ? x : Math.max(0, Math.min(vw - w, (vw - w) / 2 + n * 24));
        const py = (y != null) ? y : Math.max(0, Math.min(vh - h, (vh - h) / 2 + n * 24));

        const win = document.createElement('div');
        win.className = 'window win-anim-open';
        win.dataset.winId = id;
        win.style.cssText = 'width:' + w + 'px;height:' + h + 'px;left:' + px + 'px;top:' + py + 'px;z-index:' + (++this._z);
        win.innerHTML = this._html(title, icon, statusText);
        win._wm = { id: id, title: title, icon: icon, minimized: false, maximized: false, prev: null };

        win.addEventListener('animationend', function() { win.classList.remove('win-anim-open'); }, { once: true });

        this._cont.appendChild(win);
        this._windows.set(id, win);
        this._bindDrag(win);
        this._bindResize(win);
        this.focusWindow(id);
        return id;
    }

    /* ---- FOCUS ---- */
    focusWindow(id) {
        const win = this._windows.get(id);
        if (!win || win._wm.minimized) return;
        win.style.zIndex = ++this._z;
        this._windows.forEach(function(w, wid) {
            w.classList.toggle('focused',   wid === id);
            w.classList.toggle('unfocused', wid !== id);
        });
        this._focused = id;
    }

    /* ---- MINIMIZE ---- */
    minimizeWindow(id) {
        const win = this._windows.get(id);
        if (!win || win._wm.minimized) return;
        win._wm.minimized = true;
        win.classList.add('win-anim-minimize');
        win.addEventListener('animationend', function() {
            win.style.display = 'none';
            win.classList.remove('win-anim-minimize');
        }, { once: true });
        this._focusNext(id);
    }

    _focusNext(exceptId) {
        const ids = Array.from(this._windows.keys()).reverse();
        for (let i = 0; i < ids.length; i++) {
            const wid = ids[i];
            if (wid !== exceptId && !this._windows.get(wid)._wm.minimized) {
                this.focusWindow(wid); return;
            }
        }
        this._focused = null;
    }

    /* ---- MAXIMIZE ---- */
    maximizeWindow(id) {
        const win = this._windows.get(id);
        if (!win) return;
        if (win._wm.maximized) { this.restoreWindow(id); return; }
        win._wm.prev = { left: win.style.left, top: win.style.top,
                         width: win.style.width, height: win.style.height };
        win._wm.maximized = true;
        win.classList.add('maximized');
        const c = this._cont;
        win.style.left   = '0';
        win.style.top    = '0';
        win.style.width  = c.offsetWidth  + 'px';
        win.style.height = c.offsetHeight + 'px';
        win.style.zIndex = ++this._z;
    }

    /* ---- RESTORE ---- */
    restoreWindow(id) {
        const win = this._windows.get(id);
        if (!win) return;
        const s = win._wm;
        if (s.minimized) {
            s.minimized = false;
            win.style.display = '';
            win.classList.add('win-anim-restore');
            win.addEventListener('animationend', function() { win.classList.remove('win-anim-restore'); }, { once: true });
            this.focusWindow(id);
            return;
        }
        if (s.maximized) {
            s.maximized = false;
            win.classList.remove('maximized');
            if (s.prev) {
                win.style.left   = s.prev.left;
                win.style.top    = s.prev.top;
                win.style.width  = s.prev.width;
                win.style.height = s.prev.height;
                s.prev = null;
            }
            this.focusWindow(id);
        }
    }

    /* ---- CLOSE ---- */
    closeWindow(id) {
        const win = this._windows.get(id);
        if (!win) return;
        win._wm.minimized = false;
        win.style.display = '';
        win.classList.add('win-anim-close');
        win.addEventListener('animationend', function() { win.remove(); }, { once: true });
        this._windows.delete(id);
        this._focusNext(id);
    }

    /* ---- DRAG (mouse + touch) ---- */
    _bindDrag(win) {
        const self = this;
        const tb = win.querySelector('.titlebar');
        let active = false, ox = 0, oy = 0;

        function start(cx, cy) {
            if (win._wm.maximized) return;
            active = true;
            ox = cx - win.offsetLeft;
            oy = cy - win.offsetTop;
            document.body.classList.add('win-dragging');
            self.focusWindow(win.dataset.winId);
        }
        function move(cx, cy) {
            if (!active) return;
            const maxX = self._cont.offsetWidth  - 40;
            const maxY = self._cont.offsetHeight - 40;
            win.style.left = Math.max(-win.offsetWidth + 80, Math.min(maxX, cx - ox)) + 'px';
            win.style.top  = Math.max(0, Math.min(maxY, cy - oy)) + 'px';
        }
        function end() {
            if (!active) return;
            active = false;
            document.body.classList.remove('win-dragging');
        }

        tb.addEventListener('mousedown', function(e) {
            if (e.target.closest('.titlebar-controls') || e.target.closest('[data-tbtn-id]')) return;
            e.preventDefault();
            start(e.clientX, e.clientY);
        });
        document.addEventListener('mousemove', function(e) { if (active) move(e.clientX, e.clientY); });
        document.addEventListener('mouseup', end);

        tb.addEventListener('touchstart', function(e) {
            if (e.target.closest('.titlebar-controls')) return;
            var t = e.touches[0];
            start(t.clientX, t.clientY);
        }, { passive: true });
        document.addEventListener('touchmove', function(e) {
            if (!active) return;
            var t = e.touches[0];
            move(t.clientX, t.clientY);
        }, { passive: true });
        document.addEventListener('touchend', end, { passive: true });

        tb.addEventListener('dblclick', function(e) {
            if (e.target.closest('.titlebar-controls')) return;
            self.maximizeWindow(win.dataset.winId);
        });
    }

    /* ---- RESIZE (mouse + touch) ---- */
    _bindResize(win) {
        const self = this;
        const MIN_W = 300, MIN_H = 220;
        win.querySelectorAll('.win-resize').forEach(function(handle) {
            var dir = handle.dataset.dir;
            var active = false, sx = 0, sy = 0, sw = 0, sh = 0, sl = 0, st = 0;

            function start(cx, cy) {
                if (win._wm.maximized) return;
                active = true;
                sx = cx; sy = cy;
                sw = win.offsetWidth;  sh = win.offsetHeight;
                sl = win.offsetLeft;   st = win.offsetTop;
                document.body.style.cursor = handle.style.cursor;
                document.body.classList.add('win-resizing');
                self.focusWindow(win.dataset.winId);
            }
            function move(cx, cy) {
                if (!active) return;
                var dx = cx - sx, dy = cy - sy;
                var nw = sw, nh = sh, nl = sl, nt = st;
                if (dir.indexOf('e') !== -1) nw = Math.max(MIN_W, sw + dx);
                if (dir.indexOf('s') !== -1) nh = Math.max(MIN_H, sh + dy);
                if (dir.indexOf('w') !== -1) { nw = Math.max(MIN_W, sw - dx); nl = sl + (sw - nw); }
                if (dir.indexOf('n') !== -1) { nh = Math.max(MIN_H, sh - dy); nt = st + (sh - nh); }
                win.style.width  = nw + 'px'; win.style.height = nh + 'px';
                win.style.left   = nl + 'px'; win.style.top    = nt + 'px';
            }
            function end() {
                if (!active) return;
                active = false;
                document.body.style.cursor = '';
                document.body.classList.remove('win-resizing');
            }

            handle.addEventListener('mousedown',  function(e) { e.stopPropagation(); e.preventDefault(); start(e.clientX, e.clientY); });
            document.addEventListener('mousemove', function(e) { move(e.clientX, e.clientY); });
            document.addEventListener('mouseup', end);
            handle.addEventListener('touchstart',  function(e) { e.stopPropagation(); var t = e.touches[0]; start(t.clientX, t.clientY); }, { passive: true });
            document.addEventListener('touchmove',  function(e) { if (!active) return; var t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
            document.addEventListener('touchend', end, { passive: true });
        });
    }

    /* ---- VIEWPORT RESIZE ---- */
    onResize() {
        this._windows.forEach(function(win) {
            if (win._wm.maximized) {
                var c = win.closest('.window-container') || document.getElementById('windowContainer');
                if (c) {
                    win.style.width  = c.offsetWidth  + 'px';
                    win.style.height = c.offsetHeight + 'px';
                }
            }
        });
    }

    /* ---- ACCESSORS ---- */
    getWindowEl(id)    { return this._windows.get(id) || null; }
    getWindowIds()     { return Array.from(this._windows.keys()); }
    getWindowState(id) { var w = this._windows.get(id); return w ? Object.assign({}, w._wm) : null; }
    isMinimized(id)    { var w = this._windows.get(id); return w ? w._wm.minimized  : false; }
    isMaximized(id)    { var w = this._windows.get(id); return w ? w._wm.maximized  : false; }
    getFocusedId()     { return this._focused; }
}

/* ======================================================================
 *  TaskbarController  – singleton zarządzający paskiem zadań
 *
 *  API:
 *    build({ showStart?, pins? })
 *    addPin({ id?, icon, title?, onClick })  /  removePin(id)
 *    setPinActive(id, bool)
 *    addWindowItem(cfg)  /  removeWindowItem(id)  /  updateWindowItem(id,cfg)
 *    setItemActive(id, bool)
 *    onMinimize(winId)   – auto-dodaje okno do paska
 *    onRestore(winId)    – auto-usuwa okno z paska
 * ====================================================================== */
class TaskbarController {
    constructor(taskbarId, wm) {
        this._el      = document.getElementById(taskbarId);
        this._wm      = wm;
        this._pins    = new Map();
        this._items   = new Map();
        this._pinsEl  = null;
        this._pinSep  = null;
        this._winsEl  = null;
        this._ovBtn   = null;
        this._ovPopup = null;
        this._ctx     = null;
        this._built   = false;

        var self = this;
        document.addEventListener('click', function() {
            if (self._ctx)     self._ctx.classList.remove('open');
            if (self._ovPopup) self._ovPopup.classList.remove('open');
        });
    }

    /* ---- BUILD ---- */
    build({ showStart = true, pins = [] } = {}) {
        this._el.innerHTML = '';
        this._items.clear();
        this._pins.clear();

        if (showStart) {
            var s = document.createElement('button');
            s.className = 'taskbar-start';
            s.title = 'Start';
            s.innerHTML = '<div class="taskbar-start-grid"><span></span><span></span><span></span><span></span></div>';
            s.addEventListener('click', function(e) { e.stopPropagation(); });
            this._el.appendChild(s);
            this._el.appendChild(this._sep());
        }

        this._pinsEl = document.createElement('div');
        this._pinsEl.className = 'taskbar-pins';
        this._el.appendChild(this._pinsEl);

        this._pinSep = this._sep();
        this._el.appendChild(this._pinSep);

        pins.forEach(p => this.addPin(p));
        this._pinSep.style.display = this._pinsEl.children.length ? '' : 'none';

        this._winsEl = document.createElement('div');
        this._winsEl.className = 'taskbar-windows';
        this._el.appendChild(this._winsEl);

        this._ovBtn = document.createElement('button');
        this._ovBtn.className = 'taskbar-overflow-btn';
        this._ovBtn.title = 'Wiecej okien';
        this._ovBtn.textContent = '\u229e';
        var self = this;
        this._ovBtn.addEventListener('click', function(e) { e.stopPropagation(); self._toggleOverflow(); });
        this._el.appendChild(this._ovBtn);

        if (this._ovPopup) this._ovPopup.remove();
        this._ovPopup = document.createElement('div');
        this._ovPopup.className = 'taskbar-overflow-popup';
        document.body.appendChild(this._ovPopup);

        if (this._ctx) this._ctx.remove();
        this._ctx = document.createElement('div');
        this._ctx.className = 'taskbar-ctx-menu';
        document.body.appendChild(this._ctx);

        var tray = document.createElement('div');
        tray.className = 'taskbar-tray';
        this._buildClock(tray);
        this._el.appendChild(tray);

        this._built = true;
    }

    _sep() {
        var d = document.createElement('div');
        d.className = 'taskbar-sep';
        return d;
    }

    _ensureBuilt() { if (!this._built) this.build(); }

    _buildClock(container) {
        var el = document.createElement('div');
        el.className = 'taskbar-clock';
        function update() {
            var now = new Date();
            el.innerHTML =
                now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) +
                '<br>' +
                now.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        update();
        setInterval(update, 15000);
        container.appendChild(el);
    }

    /* ---- PINS ---- */
    addPin({ id, icon, title, onClick } = {}) {
        this._ensureBuilt();
        if (id && this._pins.has(id)) return;
        var btn = document.createElement('button');
        btn.className = 'taskbar-pin';
        btn.title = title || '';
        btn.innerHTML = icon || '\ud83d\udccc';
        if (id) btn.dataset.pinId = id;
        btn.addEventListener('click', function(e) { e.stopPropagation(); if (onClick) onClick(e); });
        this._pinsEl.appendChild(btn);
        if (id) this._pins.set(id, btn);
        this._pinSep.style.display = '';
    }

    removePin(id) {
        var btn = this._pins.get(id);
        if (!btn) return;
        btn.remove();
        this._pins.delete(id);
        if (!this._pinsEl.children.length) this._pinSep.style.display = 'none';
    }

    setPinActive(id, active) {
        var btn = this._pins.get(id);
        if (!btn) return;
        var dot = btn.querySelector('.taskbar-pin-dot');
        if (active && !dot) {
            dot = document.createElement('span');
            dot.className = 'taskbar-pin-dot';
            btn.appendChild(dot);
        } else if (!active && dot) {
            dot.remove();
        }
    }

    /* ---- WINDOW ITEMS ---- */
    addWindowItem({ id, icon, title, onClick, menuItems = [] } = {}) {
        this._ensureBuilt();
        if (id && this._items.has(id)) return;
        var self = this;

        var item = document.createElement('div');
        item.className = 'taskbar-item';
        if (id) item.dataset.tbId = id;

        var ic = document.createElement('div');
        ic.className = 'taskbar-item-icon' + (icon ? '' : ' default');
        if (icon) ic.textContent = icon;

        var ti = document.createElement('span');
        ti.className = 'taskbar-item-title';
        ti.textContent = title || '';

        item.appendChild(ic);
        item.appendChild(ti);

        item.addEventListener('click', function(e) {
            e.stopPropagation();
            self._ctx.classList.remove('open');
            if (onClick) onClick(e);
        });

        if (menuItems.length) {
            item.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var rect = item.getBoundingClientRect();
                self._showCtx(menuItems, rect.left, rect.top);
            });
        }

        this._winsEl.appendChild(item);
        if (id) this._items.set(id, { el: item, icon: icon, title: title, onClick: onClick, menuItems: menuItems });
        this._updateOverflow();
    }

    removeWindowItem(id) {
        var entry = this._items.get(id);
        if (!entry) return;
        entry.el.remove();
        this._items.delete(id);
        this._updateOverflow();
    }

    updateWindowItem(id, { title, icon } = {}) {
        var entry = this._items.get(id);
        if (!entry) return;
        if (title !== undefined) {
            entry.title = title;
            entry.el.querySelector('.taskbar-item-title').textContent = title;
        }
        if (icon !== undefined) {
            entry.icon = icon;
            var ic = entry.el.querySelector('.taskbar-item-icon');
            ic.textContent = icon;
            ic.classList.remove('default');
        }
    }

    setItemActive(id, active) {
        var entry = this._items.get(id);
        if (!entry) return;
        entry.el.classList.toggle('tb-active', active);
    }

    /* ---- OVERFLOW ---- */
    _updateOverflow() {
        if (!this._ovBtn) return;
        var show = this._items.size > 0 &&
            (this._items.size > 5 ||
             this._winsEl.scrollWidth > this._winsEl.offsetWidth + 8);
        this._ovBtn.classList.toggle('visible', show);
    }

    _toggleOverflow() {
        var p = this._ovPopup;
        if (p.classList.contains('open')) { p.classList.remove('open'); return; }

        p.innerHTML = '<div class="overflow-popup-title">Otwarte okna (' + this._items.size + ')</div>';
        this._items.forEach(function(entry) {
            var row = document.createElement('div');
            row.className = 'overflow-popup-item';

            var ic = document.createElement('div');
            ic.className = 'overflow-popup-icon' + (entry.icon ? '' : ' default');
            if (entry.icon) ic.textContent = entry.icon;

            var lbl = document.createElement('span');
            lbl.className = 'overflow-popup-label';
            lbl.textContent = entry.title || 'Okno';

            row.appendChild(ic);
            row.appendChild(lbl);
            var clickFn = entry.onClick;
            row.addEventListener('click', function(e) {
                e.stopPropagation();
                p.classList.remove('open');
                if (clickFn) clickFn(e);
            });
            p.appendChild(row);
        });

        var bRect = this._ovBtn.getBoundingClientRect();
        p.style.bottom = (window.innerHeight - bRect.top + 6) + 'px';
        p.style.right  = (window.innerWidth  - bRect.right)  + 'px';
        p.style.left   = 'auto';
        p.classList.add('open');
    }

    /* ---- CONTEXT MENU ---- */
    _showCtx(items, x, y) {
        var m = this._ctx;
        m.innerHTML = '';
        items.forEach(function(it) {
            if (it === 'separator') {
                var s = document.createElement('div');
                s.className = 'taskbar-ctx-sep';
                m.appendChild(s);
            } else {
                var mi = document.createElement('div');
                mi.className = 'taskbar-ctx-item';
                mi.textContent = it.label || '';
                var fn = it.onClick;
                mi.addEventListener('click', function(e) {
                    e.stopPropagation();
                    m.classList.remove('open');
                    if (fn) fn(e);
                });
                m.appendChild(mi);
            }
        });
        m.style.left   = Math.min(x, window.innerWidth - 200) + 'px';
        m.style.bottom = (window.innerHeight - y + 4) + 'px';
        m.style.top    = 'auto';
        m.classList.add('open');
    }

    /* ---- WM INTEGRATION ---- */
    onMinimize(winId) {
        this._ensureBuilt();
        var win = this._wm.getWindowEl(winId);
        if (!win) return;
        var title = (win._wm && win._wm.title) || (win.querySelector('.window-title') || {}).textContent || 'Okno';
        var icon  = (win._wm && win._wm.icon)  || null;
        if (this._items.has(winId)) return;
        var self = this;
        this.addWindowItem({
            id: winId, icon: icon, title: title,
            onClick: function() { self._wm.restoreWindow(winId); self.onRestore(winId); },
            menuItems: [
                { label: '\ud83d\uddd7 Przywroc',    onClick: function() { self._wm.restoreWindow(winId); self.onRestore(winId); } },
                { label: '\ud83d\uddd6 Maksymalizuj', onClick: function() { self._wm.restoreWindow(winId); self._wm.maximizeWindow(winId); self.onRestore(winId); } },
                'separator',
                { label: '\u2715 Zamknij', onClick: function() { self._wm.closeWindow(winId); self.removeWindowItem(winId); } }
            ]
        });
    }

    onRestore(winId) {
        this.removeWindowItem(winId);
    }
}

/* ======================================================================
 *  class View  – fasada na WindowManager + TaskbarController
 *
 *  Tworzy jedno okno per instancja.
 *  WindowManager i TaskbarController sa singletonami (window._wm, window._tb).
 *
 *  API:
 *    view.taskbar  – { refresh, addPin, removePin, setPinActive,
 *                      addItem, removeItem, updateItem, setItemActive }
 *    view.window   – { create, setTitle, setStatus, setStatusRight,
 *                      minimize, maximize, restore, close, focus }
 *    view.titlebar – { bindControls, addButton, removeButton }
 *    view.menubar  – { refresh, addMenu, removeMenu, addMenuItem, removeMenuItem }
 *    view.content  – { refresh, setHeader, setSubheader, setHTML,
 *                      addCard, removeCard, updateCard, getElement }
 *    view.isMinimized()  /  view.isMaximized()  /  view.getWindowId()
 * ====================================================================== */
class View {
    constructor({ taskbarId, containerId }) {
        if (!window._wm) window._wm = new WindowManager(containerId);
        if (!window._tb) window._tb = new TaskbarController(taskbarId, window._wm);

        this._wm  = window._wm;
        this._tb  = window._tb;
        this._wid = null;

        this.taskbar  = this._buildTaskbarModule();
        this.window   = this._buildWindowModule();
        this.titlebar = this._buildTitlebarModule();
        this.menubar  = this._buildMenubarModule();
        this.content  = this._buildContentModule();
    }

    /* ===================== TASKBAR ===================== */
    _buildTaskbarModule() {
        var tb = this._tb;
        return {
            refresh: function({ showStart = true, pins = [], items = [] } = {}) {
                tb.build({ showStart: showStart, pins: pins });
                items.forEach(function(it) { tb.addWindowItem(it); });
            },
            addPin:        function(cfg)       { tb.addPin(cfg); },
            removePin:     function(id)        { tb.removePin(id); },
            setPinActive:  function(id, a)     { tb.setPinActive(id, a); },
            addItem:       function(cfg)       { tb.addWindowItem(cfg); },
            removeItem:    function(id)        { tb.removeWindowItem(id); },
            updateItem:    function(id, cfg)   { tb.updateWindowItem(id, cfg); },
            setItemActive: function(id, a)     { tb.setItemActive(id, a); }
        };
    }

    /* ===================== WINDOW ===================== */
    _buildWindowModule() {
        var self = this;
        return {
            create: function(cfg) {
                if (cfg === undefined) cfg = {};
                self._wid = self._wm.createWindow(cfg);
                self._autoBind();
                return self._wid;
            },
            setTitle: function(title) {
                var win = self._wm.getWindowEl(self._wid);
                if (!win) return;
                win.querySelector('.window-title').textContent = title;
                win._wm.title = title;
                self._tb.updateWindowItem(self._wid, { title: title });
            },
            setStatus: function(text) {
                var el = self._wm.getWindowEl(self._wid);
                if (el) el.querySelector('.status-text').textContent = text;
            },
            setStatusRight: function(html) {
                var win = self._wm.getWindowEl(self._wid);
                if (win) win.querySelector('.status-bar-right').innerHTML = html;
            },
            minimize: function() { self._wm.minimizeWindow(self._wid); self._tb.onMinimize(self._wid); },
            maximize: function() { self._wm.maximizeWindow(self._wid); },
            restore:  function() { self._wm.restoreWindow(self._wid);  self._tb.onRestore(self._wid); },
            close:    function() { self._wm.closeWindow(self._wid);    self._tb.removeWindowItem(self._wid); },
            focus:    function() { self._wm.focusWindow(self._wid); }
        };
    }

    /* ===================== TITLEBAR ===================== */
    _buildTitlebarModule() {
        var self = this;
        return {
            bindControls: function({ onMinimize, onMaximize, onClose } = {}) {
                var win = self._wm.getWindowEl(self._wid);
                if (!win) return;
                if (onMinimize) win.querySelector('.minimize').onclick = function(e) { e.stopPropagation(); onMinimize(e); };
                if (onMaximize) win.querySelector('.maximize').onclick = function(e) { e.stopPropagation(); onMaximize(e); };
                if (onClose)    win.querySelector('.close').onclick    = function(e) { e.stopPropagation(); onClose(e);    };
            },
            addButton: function({ id, label, onClick, position } = {}) {
                var win = self._wm.getWindowEl(self._wid);
                if (!win) return;
                if (!position) position = 'before-controls';
                var btn = document.createElement('button');
                btn.className = 'titlebar-button';
                btn.title = label || '';
                if (id) btn.dataset.tbtnId = id;
                btn.innerHTML = '<span style="font-size:14px">' + (label || '') + '</span>';
                btn.addEventListener('click', function(e) { e.stopPropagation(); if (onClick) onClick(e); });
                var ctrl = win.querySelector('.titlebar-controls');
                if (position === 'before-controls') win.querySelector('.titlebar').insertBefore(btn, ctrl);
                else ctrl.insertBefore(btn, ctrl.firstChild);
            },
            removeButton: function(id) {
                var win = self._wm.getWindowEl(self._wid);
                if (!win) return;
                var btn = win.querySelector('[data-tbtn-id="' + id + '"]');
                if (btn) btn.remove();
            }
        };
    }

    /* ===================== MENUBAR ===================== */
    _buildMenubarModule() {
        var self = this;
        var _active = null;

        function _mb() {
            var win = self._wm.getWindowEl(self._wid);
            return win ? win.querySelector('.menubar') : null;
        }

        function _makeItems(items, container) {
            items.forEach(function(it) {
                if (it.separator) {
                    var s = document.createElement('div');
                    s.className = 'dropdown-separator';
                    container.appendChild(s);
                    return;
                }
                var el = document.createElement('div');
                el.className = 'dropdown-item' + (it.disabled ? ' disabled' : '');
                if (it.id) el.dataset.miId = it.id;
                var html = '';
                if (it.icon)     html += '<span class="dropdown-item-icon">' + it.icon + '</span>';
                html += '<span class="dropdown-item-label">' + (it.label || '') + '</span>';
                if (it.shortcut) html += '<span class="dropdown-item-shortcut">' + it.shortcut + '</span>';
                if (it.submenu)  html += '<span class="submenu-indicator">&#9658;</span>';
                el.innerHTML = html;
                if (it.submenu) {
                    var sub = document.createElement('div');
                    sub.className = 'submenu';
                    _makeItems(it.submenu, sub);
                    el.appendChild(sub);
                } else if (!it.disabled && it.onClick) {
                    var fn = it.onClick;
                    var lbl = it.label;
                    el.addEventListener('click', function(e) {
                        e.stopPropagation();
                        _closeMenus();
                        fn(e);
                        self.window.setStatus('Wykonano: ' + lbl);
                    });
                }
                container.appendChild(el);
            });
        }

        function _makeMenu(m) {
            var mi = document.createElement('div');
            mi.className = 'menu-item';
            if (m.id) mi.dataset.menuId = m.id;
            mi.textContent = m.label;

            var drop = document.createElement('div');
            drop.className = 'dropdown-menu';
            _makeItems(m.items || [], drop);
            drop.addEventListener('click', function(e) { e.stopPropagation(); });
            mi.appendChild(drop);

            mi.addEventListener('click', function(e) {
                e.stopPropagation();
                if (_active === mi) { mi.classList.remove('active'); _active = null; }
                else { _closeMenus(); mi.classList.add('active'); _active = mi; }
            });
            mi.addEventListener('mouseenter', function() {
                if (_active && _active !== mi) { _closeMenus(); mi.classList.add('active'); _active = mi; }
            });
            return mi;
        }

        function _closeMenus() {
            var mb = _mb();
            if (mb) mb.querySelectorAll('.menu-item.active').forEach(function(m) { m.classList.remove('active'); });
            _active = null;
        }
        document.addEventListener('click', _closeMenus);

        function _buildMobilePanel(menus, panel) {
            panel.innerHTML = '';
            menus.forEach(function(menu) {
                var hdr = document.createElement('div');
                hdr.className = 'mob-group-header';
                hdr.innerHTML = '<span>' + menu.label + '</span><span class="mob-arrow">&#9658;</span>';

                var body = document.createElement('div');
                body.className = 'mob-group-items';

                function addMobItems(items, container, depth) {
                    if (!depth) depth = 0;
                    items.forEach(function(it) {
                        if (it.separator) {
                            var s = document.createElement('div'); s.className = 'mob-separator';
                            container.appendChild(s); return;
                        }
                        var el = document.createElement('div');
                        el.className = 'mob-item' + (it.disabled ? ' disabled' : '') + (depth > 0 ? ' mob-sub-item' : '');
                        var html = '';
                        if (it.icon)     html += '<span class="mob-item-icon">' + it.icon + '</span>';
                        html += '<span class="mob-item-label">' + (it.label || '') + '</span>';
                        if (it.shortcut) html += '<span class="mob-item-shortcut">' + it.shortcut + '</span>';
                        el.innerHTML = html;
                        if (!it.disabled && it.onClick) {
                            var fn = it.onClick; var lbl = it.label;
                            el.addEventListener('click', function(e) {
                                e.stopPropagation();
                                panel.classList.remove('open');
                                fn(e);
                                self.window.setStatus('Wykonano: ' + lbl);
                            });
                        }
                        container.appendChild(el);
                        if (it.submenu) addMobItems(it.submenu, container, depth + 1);
                    });
                }

                addMobItems(menu.items || [], body);
                hdr.addEventListener('click', function(e) {
                    e.stopPropagation();
                    hdr.classList.toggle('open');
                    body.classList.toggle('open');
                });
                panel.appendChild(hdr);
                panel.appendChild(body);
            });
        }

        return {
            refresh: function({ menus = [] } = {}) {
                var mb = _mb(); if (!mb) return;
                mb.innerHTML = '';
                menus.forEach(function(m) { mb.appendChild(_makeMenu(m)); });

                var ham = document.createElement('button');
                ham.className = 'menu-hamburger';
                ham.title = 'Menu';
                ham.innerHTML = '<div class="menu-hamburger-icon"><span></span><span></span><span></span></div>';

                var panel = document.createElement('div');
                panel.className = 'menubar-mobile-panel';
                _buildMobilePanel(menus, panel);

                ham.addEventListener('click', function(e) {
                    e.stopPropagation();
                    panel.classList.toggle('open');
                    _closeMenus();
                });
                document.addEventListener('click', function() { panel.classList.remove('open'); });

                mb.appendChild(ham);
                mb.appendChild(panel);
            },

            addMenu: function({ label, id, items, position } = {}) {
                var mb = _mb(); if (!mb) return;
                if (!items) items = [];
                if (!position) position = 'last';
                var el = _makeMenu({ label: label, id: id, items: items });
                var existing = Array.from(mb.querySelectorAll('.menu-item'));
                var ham = mb.querySelector('.menu-hamburger');
                if (position === 'first') mb.insertBefore(el, mb.firstChild);
                else if (position === 'last' || position >= existing.length) mb.insertBefore(el, ham || null);
                else mb.insertBefore(el, existing[position]);
            },

            removeMenu: function(id) {
                var mb = _mb(); if (!mb) return;
                var el = mb.querySelector('[data-menu-id="' + id + '"]');
                if (el) el.remove();
            },

            addMenuItem: function(menuId, item) {
                var mb = _mb(); if (!mb) return;
                var drop = mb.querySelector('[data-menu-id="' + menuId + '"] .dropdown-menu');
                if (!drop) return;
                var tmp = document.createElement('div');
                _makeItems([item], tmp);
                Array.from(tmp.children).forEach(function(c) { drop.appendChild(c); });
            },

            removeMenuItem: function(menuId, itemId) {
                var mb = _mb(); if (!mb) return;
                var el = mb.querySelector('[data-menu-id="' + menuId + '"] .dropdown-menu [data-mi-id="' + itemId + '"]');
                if (el) el.remove();
            }
        };
    }

    /* ===================== CONTENT ===================== */
    _buildContentModule() {
        var self = this;

        function _c() {
            var win = self._wm.getWindowEl(self._wid);
            return win ? win.querySelector('.window-content') : null;
        }

        function _makeCard(cfg) {
            var card = document.createElement('div');
            card.className = 'card';
            if (cfg.id) card.dataset.cardId = cfg.id;
            if (cfg.html) {
                card.innerHTML = cfg.html;
            } else {
                card.innerHTML =
                    '<div class="card-title">' + (cfg.title || '') + '</div>' +
                    '<div class="card-text">'  + (cfg.text  || '') + '</div>';
            }
            return card;
        }

        return {
            refresh: function({ header, subheader, cards, html } = {}) {
                var c = _c(); if (!c) return;
                if (!header)    header    = '';
                if (!subheader) subheader = '';
                if (!cards)     cards     = [];
                if (!html)      html      = '';
                if (html) { c.innerHTML = html; return; }
                c.innerHTML = '';
                if (header)    { var h = document.createElement('div'); h.className = 'content-header';    h.textContent = header;    c.appendChild(h); }
                if (subheader) { var s = document.createElement('div'); s.className = 'content-subheader'; s.textContent = subheader; c.appendChild(s); }
                cards.forEach(function(card) { c.appendChild(_makeCard(card)); });
            },

            setHeader: function(text) {
                var c = _c(); if (!c) return;
                var h = c.querySelector('.content-header');
                if (!h) { h = document.createElement('div'); h.className = 'content-header'; c.prepend(h); }
                h.textContent = text;
            },

            setSubheader: function(text) {
                var c = _c(); if (!c) return;
                var s = c.querySelector('.content-subheader');
                if (!s) {
                    s = document.createElement('div'); s.className = 'content-subheader';
                    var h = c.querySelector('.content-header');
                    if (h) h.after(s); else c.prepend(s);
                }
                s.textContent = text;
            },

            setHTML: function(html) {
                var c = _c(); if (c) c.innerHTML = html;
            },

            addCard: function(cfg) {
                if (!cfg) cfg = {};
                var c = _c(); if (!c) return;
                c.appendChild(_makeCard(cfg));
            },

            removeCard: function(id) {
                var c = _c(); if (!c) return;
                var card = c.querySelector('[data-card-id="' + id + '"]');
                if (card) card.remove();
            },

            updateCard: function(id, opts) {
                if (!opts) opts = {};
                var c = _c(); if (!c) return;
                var card = c.querySelector('[data-card-id="' + id + '"]');
                if (!card) return;
                if (opts.html  !== undefined) { card.innerHTML = opts.html; return; }
                if (opts.title !== undefined) card.querySelector('.card-title').textContent = opts.title;
                if (opts.text  !== undefined) card.querySelector('.card-text').textContent  = opts.text;
            },

            getElement: function() { return _c() || null; }
        };
    }

    /* ===================== AUTO-BIND ===================== */
    _autoBind() {
        var self = this;
        var win  = this._wm.getWindowEl(this._wid);
        if (!win) return;
        win.querySelector('.minimize').onclick = function(e) { e.stopPropagation(); self.window.minimize(); };
        win.querySelector('.maximize').onclick = function(e) { e.stopPropagation(); self.window.maximize(); };
        win.querySelector('.close').onclick    = function(e) { e.stopPropagation(); self.window.close();    };
    }

    /* ===================== HELPERS ===================== */
    isMinimized() { return this._wm.isMinimized(this._wid); }
    isMaximized() { return this._wm.isMaximized(this._wid); }
    getWindowId() { return this._wid; }
}

/* ======================================================================
 *  INICJALIZACJA
 * ====================================================================== */
var view = new View({ taskbarId: 'taskbar', containerId: 'windowContainer' });

/* ── 1. Taskbar – Start + przypięte ikony modułów ── */
view.taskbar.refresh({
    showStart: true,
    pins: [
        { id: 'pin-explorer', icon: '\ud83d\udcc1', title: 'Eksplorator plikow',  onClick: function() { console.log('Eksplorator'); } },
        { id: 'pin-browser',  icon: '\ud83c\udf10', title: 'Przegladarka',        onClick: function() { console.log('Przegladarka'); } },
        { id: 'pin-terminal', icon: '\ud83d\udcbb', title: 'Terminal',            onClick: function() { console.log('Terminal'); } },
        { id: 'pin-settings', icon: '\u2699\ufe0f', title: 'Ustawienia',         onClick: function() { console.log('Ustawienia'); } }
    ]
});

/* ── 2. Utwórz pierwsze okno ── */
view.window.create({ title: 'Moja Aplikacja', icon: '\ud83d\udda5\ufe0f', statusText: 'Gotowe' });

/* ── 3. Menubar ── */
view.menubar.refresh({
    menus: [
        {
            label: 'Plik', id: 'menu-file',
            items: [
                { id: 'mi-new',    icon: '\ud83d\udcc4', label: 'Nowy',          shortcut: 'Ctrl+N',       onClick: function() {} },
                { id: 'mi-open',   icon: '\ud83d\udcc2', label: 'Otworz\u2026',  shortcut: 'Ctrl+O',       onClick: function() {} },
                { id: 'mi-save',   icon: '\ud83d\udcbe', label: 'Zapisz',        shortcut: 'Ctrl+S',       onClick: function() {} },
                { id: 'mi-saveas', icon: '\ud83d\udcdd', label: 'Zapisz jako\u2026', shortcut: 'Ctrl+Shift+S', onClick: function() {} },
                { separator: true },
                { id: 'mi-print',  icon: '\ud83d\udda8\ufe0f', label: 'Drukuj', shortcut: 'Ctrl+P',       onClick: function() {} },
                { separator: true },
                { id: 'mi-close',  icon: '\u274c',       label: 'Zamknij',       shortcut: 'Alt+F4',
                  onClick: function() { view.window.close(); } }
            ]
        },
        {
            label: 'Edycja', id: 'menu-edit',
            items: [
                { id: 'mi-undo',  icon: '\u21b6', label: 'Cofnij',  shortcut: 'Ctrl+Z', onClick: function() {} },
                { id: 'mi-redo',  icon: '\u21b7', label: 'Ponow',   shortcut: 'Ctrl+Y', onClick: function() {} },
                { separator: true },
                { id: 'mi-cut',   icon: '\u2702\ufe0f', label: 'Wytnij',  shortcut: 'Ctrl+X', onClick: function() {} },
                { id: 'mi-copy',  icon: '\ud83d\udccb',  label: 'Kopiuj',  shortcut: 'Ctrl+C', onClick: function() {} },
                { id: 'mi-paste', icon: '\ud83d\udcc4',  label: 'Wklej',   shortcut: 'Ctrl+V', onClick: function() {} },
                { separator: true },
                {
                    id: 'mi-find', icon: '\ud83d\udd0d', label: 'Znajdz',
                    submenu: [
                        { icon: '\ud83d\udd0e', label: 'Znajdz w dokumencie', shortcut: 'Ctrl+F',   onClick: function() {} },
                        { icon: '\ud83d\udd04', label: 'Znajdz i zamien',     shortcut: 'Ctrl+H',   onClick: function() {} },
                        { icon: '\u23ed\ufe0f', label: 'Znajdz nastepny',     shortcut: 'F3',       onClick: function() {} },
                        { icon: '\u23ee\ufe0f', label: 'Znajdz poprzedni',    shortcut: 'Shift+F3', onClick: function() {} }
                    ]
                },
                {
                    id: 'mi-prefs', icon: '\u2699\ufe0f', label: 'Preferencje',
                    submenu: [
                        { icon: '\ud83c\udfa8', label: 'Motyw',              onClick: function() {} },
                        { icon: '\ud83d\udd24', label: 'Czcionki',           onClick: function() {} },
                        { icon: '\u2328\ufe0f', label: 'Skroty klawiszowe', onClick: function() {} },
                        { separator: true },
                        { icon: '\ud83c\udf0d', label: 'Jezyk',              onClick: function() {} }
                    ]
                }
            ]
        },
        {
            label: 'Widok', id: 'menu-view',
            items: [
                { icon: '\ud83d\udcca', label: 'Pasek narzedzi', onClick: function() {} },
                { icon: '\ud83d\udccf', label: 'Linijka',        onClick: function() {} },
                { separator: true },
                { icon: '\ud83d\udd0d', label: 'Powieksz',       shortcut: 'Ctrl++', onClick: function() {} },
                { icon: '\ud83d\udd0e', label: 'Pomniejsz',      shortcut: 'Ctrl+-', onClick: function() {} }
            ]
        },
        {
            label: 'Pomoc', id: 'menu-help',
            items: [
                { icon: '\ud83d\udcd6', label: 'Dokumentacja', shortcut: 'F1', onClick: function() {} },
                { icon: '\u2139\ufe0f', label: 'O programie',
                  onClick: function() { view.window.setStatus('Windows 11 View \u2013 wersja 2.0.0'); } }
            ]
        }
    ]
});

/* ── 4. Zawartość okna ── */
view.content.refresh({
    header:    'Witaj w systemie okienek',
    subheader: 'Wielookienkowy, responsywny interfejs \u2013 Windows 11 style',
    cards: [
        { id: 'card-windows',
          title: '\ud83e\ude9f Wiele okien',
          text:  'Twórz wiele niezależnych okien, przeciągaj je (też na dotyk), zmieniaj rozmiar krawędziami/rogami, każde ma własne menu i zawartość.' },
        { id: 'card-taskbar',
          title: '\ud83d\udccc Pasek zadań',
          text:  'Pasek zadań: przycisk Start, przypięte ikony modułów (Eksplorator, Przeglądarka…), lista otwartych okien z prawym przyciskiem, overflow ⊞ oraz zegar.' },
        { id: 'card-overflow',
          title: '\u229e Zarządzanie wieloma oknami',
          text:  'Gdy okien jest zbyt wiele, przycisk ⊞ (prawy koniec listy) pokazuje popup ze wszystkimi otwartymi oknami.' },
        { id: 'card-mobile',
          title: '\ud83d\udcf1 Responsywność',
          text:  'Na ekranach ≤768 px tytuły okien są ukrywane. Menubar zastępuje hamburger ≡ z akordeionem. Na ≤480 px zegar jest ukrywany.' },
        { id: 'card-resize',
          title: '\u2194 Zmiana rozmiaru i drag',
          text:  'Przeciągnij pasek tytułowy, by przesunąć okno. Przeciągnij krawędź lub róg, by zmienić rozmiar. Podwójne kliknięcie tytułu – max/restore.' }
    ]
});

/* ── 5. Viewport resize ── */
window.addEventListener('resize', function() { if (window._wm) window._wm.onResize(); });

/*
 ======================================================================
  PRZYKŁADY – wklej w konsole przeglądarki (F12)
 ======================================================================

  // --- OKNO PIERWSZE (view) ---

  // Zmień tytuł:
  view.window.setTitle('Nowy tytul');

  // Zmień status:
  view.window.setStatus('Plik zapisany pomyslnie');

  // Prawa czesc statusbara:
  view.window.setStatusRight('<span>Connected</span>');

  // Minimalizuj / maksymalizuj / przywroc:
  view.window.minimize();
  view.window.maximize();
  view.window.restore();

  // Dodaj kartę:
  view.content.addCard({ id: 'c-new', title: 'Nowa karta', text: 'Tresc nowej karty.' });

  // Zaktualizuj kartę:
  view.content.updateCard('card-windows', { title: 'Okna – zaktualizowano' });

  // Usuń kartę:
  view.content.removeCard('card-mobile');

  // Własny HTML:
  view.content.setHTML('<h2 style="padding:20px">HTML</h2>');

  // Dodaj pozycję do menu Plik:
  view.menubar.addMenuItem('menu-file', { icon: '📤', label: 'Eksportuj', onClick: function() { alert('Eksport!'); } });

  // Usuń pozycję:
  view.menubar.removeMenuItem('menu-file', 'mi-print');

  // Dodaj nowe menu:
  view.menubar.addMenu({ label: 'Narzedzia', id: 'menu-tools', items: [
      { icon: '🔧', label: 'Opcja 1', onClick: function() { alert('Opcja 1'); } }
  ]});

  // Dodaj przycisk do titlebar:
  view.titlebar.addButton({ id: 'tb-info', label: 'ℹ', onClick: function() { alert('Info'); } });
  view.titlebar.removeButton('tb-info');

  // --- TASKBAR ---

  // Dodaj pin modulu:
  view.taskbar.addPin({ id: 'pin-calc', icon: '🧮', title: 'Kalkulator', onClick: function() { alert('Kalkulator'); } });
  view.taskbar.removePin('pin-calc');
  view.taskbar.setPinActive('pin-explorer', true);

  // --- DRUGIE OKNO ---

  var view2 = new View({ taskbarId: 'taskbar', containerId: 'windowContainer' });
  view2.window.create({ title: 'Edytor dokumentow', icon: '📝', width: 700, height: 460, x: 60, y: 60 });
  view2.menubar.refresh({
      menus: [
          { label: 'Plik', id: 'menu2-file', items: [
              { icon: '📄', label: 'Nowy',    shortcut: 'Ctrl+N', onClick: function() {} },
              { icon: '💾', label: 'Zapisz',  shortcut: 'Ctrl+S', onClick: function() {} },
              { separator: true },
              { icon: '❌', label: 'Zamknij', shortcut: 'Alt+F4', onClick: function() { view2.window.close(); } }
          ]},
          { label: 'Pomoc', id: 'menu2-help', items: [
              { icon: 'ℹ️', label: 'O programie', onClick: function() { view2.window.setStatus('Edytor v1.0'); } }
          ]}
      ]
  });
  view2.content.refresh({
      header: 'Edytor dokumentow',
      subheader: 'Drugie niezalezne okno',
      cards: [
          { id: 'ed-1', title: 'Dokument 1', text: 'Tu bedzie tresc edytora.' }
      ]
  });

  // --- TRZECIE OKNO (własny HTML) ---

  var view3 = new View({ taskbarId: 'taskbar', containerId: 'windowContainer' });
  view3.window.create({ title: 'Panel sterowania', icon: '⚙️', width: 500, height: 380, x: 140, y: 80 });
  view3.content.refresh({
      html: '<div style="padding:20px"><h2 style="margin-bottom:12px">Panel</h2>' +
            '<button onclick="alert(\'Akcja!\')" ' +
            'style="padding:8px 20px;background:#0078d4;color:#fff;border:none;border-radius:6px;cursor:pointer">Akcja</button></div>'
  });
*/
</script>
</body>
</html>
