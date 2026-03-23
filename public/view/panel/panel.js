import { config } from './config.js';

class panel {
    constructor(parent) {
        this.parent = parent;
        this.config = new config(this);
    }

    // Wyświetlenie panelu
    async showPanel() {
        let panel = document.getElementById(this.config.idPanel);
        if (panel) {
            panel.style.display = 'block';
        } else {
            panel = await this.config.configPanel();
            document.body.appendChild(panel);
        }
    }

    // Ukrycie/usunięcie panelu
    async hidePanel() {
        const panel = document.getElementById(this.config.idPanel);
        if (panel) panel.remove();
    }

    // Wyświetlenie tascBar
    async showTascBar() {
        let tascBar = document.getElementById(this.config.idTascBar);
        if (tascBar) {
            tascBar.style.display = 'flex';
        } else {
            tascBar = await this.config.configTascBar();
            const panel = document.getElementById(this.config.idPanel);
            if (panel) panel.appendChild(tascBar);
        }
    }

    // Ukrycie/usunięcie tascBar
    async hideTascBar() {
        const tascBar = document.getElementById(this.config.idTascBar);
        if (tascBar) tascBar.remove();
    }

    // Dodanie ikony/menu do tascBar
    async addIconTascBar(data) {
        const icon = await this.config.createTascBarIcon(data);
        let tascBar = document.getElementById(this.config.idTascBar);
        if (!tascBar) {
            tascBar = await this.config.configTascBar();
            const panel = document.getElementById(this.config.idPanel);
            if (panel) panel.appendChild(tascBar);
        }
        tascBar.appendChild(icon);
    }

    // Odświeżenie ikony/menu w tascBar
    async refreshIconTascBar(data) {
        if (!data?.idIcon) return;
        const tascBar = document.getElementById(this.config.idTascBar);
        if (!tascBar) return;
        const oldIcon = document.getElementById(data.idIcon);
        if (!oldIcon) return;
        const newIcon = await this.config.createTascBarIcon(data);
        tascBar.replaceChild(newIcon, oldIcon);
    }

    // Usunięcie ikony/menu z tascBar
    async removeIconTascBar(idIcon) {
        if (!idIcon) return;
        const tascBar = document.getElementById(this.config.idTascBar);
        if (!tascBar) return;
        const icon = document.getElementById(idIcon);
        if (icon) tascBar.removeChild(icon);
    }

    // Dodanie okna do widoku
    async addWindow(data) {
        const appWindow = this.parent?.appWindow;
        if (!appWindow) throw new Error('Brak instancji AppWindow!');
        const win = await appWindow.winDemo();
        const panel = document.getElementById(this.config.idPanel);
        if (panel) panel.appendChild(win);
    }
}

export { panel };
