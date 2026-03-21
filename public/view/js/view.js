import { configPanel } from "../config/configPanel.js";

class Wiew { 
    constructor() {
        
     this.panel = new configPanel(this);

     
 }

    
    /** wyswietlenie panelu */
    async showPanel() {
        await this.panel.showPanel();
    }
    /** ukrycie panelu */
    async hidePanel() {
        await this.panel.hidePanel();
    }
    



    

    

}
export { Wiew };