
class METHOD {
    constructor(parent){
        this.parent = parent;
        this.api = this.parent.api;
        this.config = null;
        this.handlers = this.parent.handlers;
        this.windows = this.parent.windows;
        this.modal = this.parent.modal;
    }

    // dodanie ikony do paska nawigacji
    async addNav() {
        // pobranie konfiguracji elementu nawigacji z CONFIG
        const navConfig = await this.config.configNavBar();
        // dodanie elementu nawigacji do paska nawigacji
        this.windows.addStartMenuItem(navConfig);
    }
    // otwarcie okna po kliknięciu na element nawigacji
    async openWindow() {
        // pobranie konfiguracji okna z CONFIG
        const windowConfig = await this.config.configWindow();
        // otwarcie okna z pobraną konfiguracją
       await this.windows.addWindow(windowConfig);
    }
    // odswiezanie meniu w oknie
    async refreshMenu() {
        const menuConfig = await this.config.configMenu();
        this.windows.addWindowMenu(menuConfig);
    }
    


}
export default METHOD;