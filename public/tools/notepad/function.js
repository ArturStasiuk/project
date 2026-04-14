class FUNCTION {
    constructor(parent) {
      //  this.nameFunction = 'FUNCTION';
        this.parent = parent;
    }


    async addStartMenuItem() {
        await this.parent.view.addStartMenuItem(await this.parent.conf.getStartMenuItem());
        // Tworzenie okna przed dodaniem karty

    }

    async openWindow() {
        await this.parent.view.addWindow(await this.parent.conf.getWindowItem());
        await this.parent.view.refreshWindowMenubar(await this.parent.conf.getWindowMenu());
        await this.parent.view.addWindowCard(await this.parent.conf.getWindowContent()); 
    }







}
export default FUNCTION;