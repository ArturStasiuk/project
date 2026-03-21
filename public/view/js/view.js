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
    



    

    

}
export { Wiew };