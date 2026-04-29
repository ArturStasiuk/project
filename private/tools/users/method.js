
class METHOD {
    constructor(parent){
        this.parent = parent;
        this.api = this.parent.api;
        this.config = this.parent.config;
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



}
export default METHOD;