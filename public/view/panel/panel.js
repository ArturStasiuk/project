import { config } from './config.js';

class panel {
    constructor(parent) {
        this.parent = parent; // Przechowywanie referencji do rodzica, jeśli 
        this.config = new config(this); // Inicjalizacja konfiguracji panelu

    }


    // wyswietlenie panelu 
    async showPanel() {
        let panel = document.getElementById(this.config.idPanel);
        if (panel) {
            panel.style.display = 'block';
        } else {
            // Utwórz panel
            panel = await this.config.configPanel();
            document.body.appendChild(panel);
        }
    }

    // wylaczanie panelu 
    async hidePanel() {
        const panel = document.getElementById(this.config.idPanel);
        if (panel) {
            panel.remove();
        }
    }

    // wlaczenie tascBar
    async showTascBar() {
        let tascBar = document.getElementById(this.config.idTascBar);
        if (tascBar) {
            tascBar.style.display = 'block';
        } else {
            // Utwórz tascBar
            tascBar = await this.config.configTascBar();
            const panel = document.getElementById(this.config.idPanel);
            if (panel) {
                panel.appendChild(tascBar);
            }
        }
    }
    // wylaczenie tascBar
    async hideTascBar() {
        const tascBar = document.getElementById(this.config.idTascBar);
        if (tascBar) {
            tascBar.remove();
        }
    }
    // // twozy wyglad dla ikon/meniu w tascBar na podstawie configuracji a satempnie dodaje ja do taskbar 
    async addIconTascBar(data) {
        const icon = await this.config.createTascBarIcon(data);
        let tascBar = document.getElementById(this.config.idTascBar);
        if (!tascBar) {
            // Jeśli tascBar nie istnieje, utwórz go i dodaj do panelu
            tascBar = await this.config.configTascBar();
            const panel = document.getElementById(this.config.idPanel);
            if (panel) {
                panel.appendChild(tascBar);
            }
        }
        tascBar.appendChild(icon);
    }
    // odswiezanie ikonu/meniu w tascBar na podstawie configuracji 
    async refreshIconTascBar(data) {
        if (!data || !data.idIcon) return;
        const tascBar = document.getElementById(this.config.idTascBar);
        if (!tascBar) return;
        const oldIcon = document.getElementById(data.idIcon);
        if (!oldIcon) return;
        // Utwórz nowy element ikony/menu na podstawie aktualnej konfiguracji
        const newIcon = await this.config.createTascBarIcon(data);
        tascBar.replaceChild(newIcon, oldIcon);
    }
    // usuwanie ikonu/meniu z tascBar na podstawie id ikony
    async removeIconTascBar(idIcon) {
        if (!idIcon) return;
        const tascBar = document.getElementById(this.config.idTascBar);
        if (!tascBar) return;
        const icon = document.getElementById(idIcon);
        if (icon) {
            tascBar.removeChild(icon);
        }
    }



    // dodanie okna do widoku
    async addWindow(data) {
        // Dodaje nowe okno do panelu (kontener panelu lub body)
        const win = this.config.createWindow(data);
        const panel = document.getElementById(this.config.idPanel);
        if (panel) {
            panel.appendChild(win);
        } else {
            document.body.appendChild(win);
        }
    }
    



}

export { panel };