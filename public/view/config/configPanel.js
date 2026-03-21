
class configPanel{
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
        // Unikalne klasy i ID dla panelu 
        this.nameClass = 'panel';
        this.Id = 'id_panel';
    }

    async configPanel() {
        const panel = document.createElement('div');
        panel.className = this.nameClass;
        panel.id = this.Id;
        // Dynamiczne dopasowanie rozmiaru
        panel.style.position = 'fixed';
        panel.style.top = '0';
        panel.style.left = '0';
        panel.style.width = window.innerWidth + 'px';
        panel.style.height = window.innerHeight + 'px';
        panel.style.boxSizing = 'border-box';

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

        const p = document.createElement('p');
      //  p.textContent = 'Panel konfiguracji';
        panel.appendChild(p);
        return panel;
    }
    // wyswietlenie panelu 
    async showPanel() {
        let panel = document.getElementById(this.Id);
        if (panel) {
            panel.style.display = 'block';
        } else {
            document.body.appendChild(await this.configPanel());
        }
    }

    // wylaczanie panelu 
    async hidePanel() {
        const panel = document.getElementById(this.Id);
        if (panel) {
            panel.remove();
        }
    }






    


}

export { configPanel };