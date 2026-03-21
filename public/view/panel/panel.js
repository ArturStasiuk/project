import { config } from './config.js';

class Panel{
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



    


}

export { Panel };