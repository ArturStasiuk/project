import { configPanel } from "../config/configPanel.js";

class Panel { 
    constructor() {
     this.panel = new configPanel();

     
 }

    
    /** pobranie konfiguracji panelu i wstawienie go do dokumentu */
    async showPanel() {
        document.body.appendChild(await this.panel.configPanel());
    }
    /** usuniecie panelu z dokumentu */
    async hidePanel() {
        const panel = document.getElementById('panel');
        if (panel) {
            panel.remove();
        }
    }




    

    

}
export { Panel };