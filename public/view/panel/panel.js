import { config }

class Panel{
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
        // sciezka do tapety panelu
        this.wallpapers=['./view/css/wallpapers/wallpapers1.jpg'];


        // Unikalne klasy i ID dla panelu 
        this.classNamePanel = 'panel';
        this.idPanel= 'id_panel';
        // Unikelne klasy i ID dla tascBar
        this.classNameTascBar = 'tascBar';
        this.idTascBar ='idTascBar'
    

    }


    // wyswietlenie panelu 
    async showPanel() {
        let panel = document.getElementById(this.idPanel);
        if (panel) {
            panel.style.display = 'block';
        } else {
            document.body.appendChild(await this.configPanel());
        }
    }

    // wylaczanie panelu 
    async hidePanel() {
        const panel = document.getElementById(this.idPanel);
        if (panel) {
            panel.remove();
        }
    }






    


}

export { Panel };