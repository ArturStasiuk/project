import { panel } from "../panel/panel.js";
import { window} from "./window.js";
class view { 
    constructor() {
        this.window = new window(this);
        this.panel = new panel(this ,this.window);
       
        

     
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
    // dodanie ikony/meniu do tascBar
    async addIconTascBar(data) {
     await this.panel.addIconTascBar(data);
    }
    // refreszowanie ikony/meniu w tascBar na podstawie configuracji 
    async refreshIconTascBar(data) {
        await this.panel.refreshIconTascBar(data);
    }
    // usuwanie ikony/meniu z tascBar na podstawie idIcon
    async removeIconTascBar(idIcon) {
        await this.panel.removeIconTascBar(idIcon);
    }
   // dodanie okna do widoku
   async addWindow(data) {
        await this.panel.addWindow(data);

   }

    

    

}
export { view };