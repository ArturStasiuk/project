import { Panel } from "../panel/panel.js";

class Wiew { 
    constructor() {
        
     this.panel = new Panel(this);

     
 }

    
    /** wyswietlenie panelu */
    async showPanel() {
        await this.panel.showPanel();
    }
    /** ukrycie panelu */
    async hidePanel() {
        await this.panel.hidePanel();
    }
    /// wyswietlenie tascBar
    async showTascBar() {
        await this.panel.showTascBar();
    }
    /// ukrycie tascBar
    async hideTascBar() {
        await this.panel.hideTascBar();
    }



    

    

}
export { Wiew };