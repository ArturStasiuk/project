class FUNCTION {
    constructor(parent) {
      //  this.nameFunction = 'FUNCTION';
        this.parent = parent;
    }


    async addStartMenuItem() {
        await window._view.addStartMenuItem(await this.parent.conf.getStartMenuItem());
        // Tworzenie okna przed dodaniem karty

    }

    async openWindow() {
        await window._view.create(await this.parent.conf.getWindowItem());
        await window._view.addMenu({
            id: this.parent.conf.idWindow,
            menus: await this.parent.conf.getWindowMenu()
        });
        await window._view.addCard(await this.parent.conf.getWindowContent()); 
    }







}
export default FUNCTION;