class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.idWindow = 'win-browser';
        this.homeUrl = 'https://www.google.com/webhp?igu=1';
    }

    // Konfiguracja elementu menu w pasku startowym
    async getStartMenuItem() {
        return {
            id: 'sm-browser',
            icon: '🌐',
            label: 'Przeglądarka',
            disabled: false,
            onClick: async () => {
                await this.parent.func.openWindow();
            }
        };
    }

    // Konfiguracja okna
    async getWindowItem() {
        return {
            id: this.idWindow,
            title: 'Przeglądarka',
            icon: '🌐',
            statusText: 'Gotowe',
        };
    }

    // Konfiguracja menu okna
    async getWindowMenu() {
        return {
            id: this.idWindow,
            menuId: 'menu-browser-nav',
            label: 'Nawigacja',
            items: [
                { icon: '◀', label: 'Wstecz',         onClick: () => { window._browserNav && window._browserNav.goBack();    } },
                { icon: '▶', label: 'Dalej',           onClick: () => { window._browserNav && window._browserNav.goForward(); } },
                { icon: '🔄', label: 'Odśwież',        onClick: () => { window._browserNav && window._browserNav.reload();    } },
                { separator: true },
                { icon: '🏠', label: 'Strona główna',  onClick: () => { window._browserNav && window._browserNav.goHome();   } },
            ]
        };
    }

    // Konfiguracja zawartości okna
    async getWindowContent() {
        const winId   = this.idWindow;
        const homeUrl = this.homeUrl;
        return {
            id: winId,
            cardId: 'card-browser',
            title: '',
            text: `<style>
#${winId} .window-content { padding: 0 !important; overflow: hidden; }
#${winId} [data-card-id="card-browser"] { padding: 0 !important; border-radius: 0; box-shadow: none !important; border: none !important; margin: 0 !important; height: 100%; display: flex; flex-direction: column; }
#${winId} [data-card-id="card-browser"] .card-title { display: none; }
#${winId} [data-card-id="card-browser"] .card-text  { flex: 1; display: flex; flex-direction: column; min-height: 0; }
</style>
<div style="display:flex;flex-direction:column;width:100%;height:100%;min-height:0;">
    <div id="browser-navbar" style="display:flex;align-items:center;gap:4px;padding:6px 8px;background:#f5f5f5;border-bottom:1px solid #ddd;flex-shrink:0;">
        <button id="browser-back"    title="Wstecz"         style="width:30px;height:30px;border:none;border-radius:50%;background:transparent;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;opacity:0.4;" disabled>◀</button>
        <button id="browser-forward" title="Dalej"          style="width:30px;height:30px;border:none;border-radius:50%;background:transparent;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;opacity:0.4;" disabled>▶</button>
        <button id="browser-reload"  title="Odśwież"        style="width:30px;height:30px;border:none;border-radius:50%;background:transparent;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">🔄</button>
        <button id="browser-home"    title="Strona główna"  style="width:30px;height:30px;border:none;border-radius:50%;background:transparent;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">🏠</button>
        <input  id="browser-url"     type="text" placeholder="Wpisz adres URL i naciśnij Enter..." value="" style="flex:1;padding:5px 12px;border:1px solid #ccc;border-radius:20px;font-size:13px;outline:none;min-width:0;" />
        <button id="browser-go"      style="padding:5px 14px;border:none;border-radius:20px;background:#1976d2;color:#fff;cursor:pointer;font-size:13px;white-space:nowrap;flex-shrink:0;">Idź</button>
    </div>
    <div style="flex:1;position:relative;min-height:0;overflow:hidden;">
        <iframe id="browser-iframe"
            style="width:100%;height:100%;border:none;background:#fff;display:block;"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            src="about:blank">
        </iframe>
        <div id="browser-blocked" style="display:none;position:absolute;inset:0;background:#f8f8f8;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-family:sans-serif;color:#555;">
            <span style="font-size:48px;">🚫</span>
            <p style="font-size:16px;font-weight:600;">Ta strona nie może być wyświetlona</p>
            <p id="browser-blocked-url" style="font-size:13px;color:#888;word-break:break-all;max-width:400px;text-align:center;"></p>
            <p style="font-size:13px;color:#aaa;">Witryna blokuje wyświetlanie w ramkach (X-Frame-Options).</p>
        </div>
    </div>
</div>
<script>
setTimeout(function() {
    var winId   = '${winId}';
    var homeUrl = '${homeUrl}';
    var iframe      = document.getElementById('browser-iframe');
    var urlInput    = document.getElementById('browser-url');
    var goBtn       = document.getElementById('browser-go');
    var backBtn     = document.getElementById('browser-back');
    var fwdBtn      = document.getElementById('browser-forward');
    var reloadBtn   = document.getElementById('browser-reload');
    var homeBtn     = document.getElementById('browser-home');
    var blockedDiv  = document.getElementById('browser-blocked');
    var blockedUrl  = document.getElementById('browser-blocked-url');

    if (!iframe) return;

    var hist = [];
    var histIdx = -1;

    function updateBtns() {
        var canBack = histIdx > 0;
        var canFwd  = histIdx < hist.length - 1;
        backBtn.disabled = !canBack;
        fwdBtn.disabled  = !canFwd;
        backBtn.style.opacity = canBack ? '1' : '0.4';
        fwdBtn.style.opacity  = canFwd  ? '1' : '0.4';
    }

    function loadUrl(url) {
        blockedDiv.style.display = 'none';
        iframe.src = url;
    }

    function navigate(url) {
        if (!url) return;
        if (url === 'about:blank') return;
        if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;
        urlInput.value = url;
        hist.splice(histIdx + 1);
        hist.push(url);
        histIdx = hist.length - 1;
        loadUrl(url);
        updateBtns();
        var statusEl = document.querySelector('#' + winId + ' .status-bar span');
        if (statusEl) statusEl.textContent = 'Ładowanie: ' + url;
    }

    window._browserNav = {
        goBack:    function() { if (histIdx > 0)                  { histIdx--; urlInput.value = hist[histIdx]; loadUrl(hist[histIdx]); updateBtns(); } },
        goForward: function() { if (histIdx < hist.length - 1)    { histIdx++; urlInput.value = hist[histIdx]; loadUrl(hist[histIdx]); updateBtns(); } },
        reload:    function() { if (histIdx >= 0)                 { loadUrl(hist[histIdx]); } else { iframe.contentWindow && iframe.contentWindow.location.reload(); } },
        goHome:    function() { navigate(homeUrl); },
        navigate:  navigate
    };

    goBtn.addEventListener('click', function() { navigate(urlInput.value); });
    urlInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') navigate(urlInput.value); });
    backBtn.addEventListener('click', function() { window._browserNav.goBack(); });
    fwdBtn.addEventListener('click',  function() { window._browserNav.goForward(); });
    reloadBtn.addEventListener('click', function() { window._browserNav.reload(); });
    homeBtn.addEventListener('click',   function() { window._browserNav.goHome(); });

    iframe.addEventListener('load', function() {
        var loc;
        try { loc = iframe.contentWindow.location.href; } catch(e) { loc = null; }
        var statusEl = document.querySelector('#' + winId + ' .status-bar span');
        if (loc && loc !== 'about:blank') {
            urlInput.value = loc;
            if (statusEl) statusEl.textContent = 'Gotowe: ' + loc;
        } else if (histIdx >= 0) {
            if (statusEl) statusEl.textContent = 'Gotowe';
        }
    });

    iframe.addEventListener('error', function() {
        if (histIdx >= 0) {
            blockedDiv.style.display = 'flex';
            if (blockedUrl) blockedUrl.textContent = hist[histIdx] || '';
        }
    });

    navigate(homeUrl);
    updateBtns();
}, 50);
</script>`
        };
    }
}

export default CONFIG;
