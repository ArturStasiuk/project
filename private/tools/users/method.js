
class METHOD {
    constructor(parent){
        this.parent = parent;
        this.api = this.parent.api;
        this.config = null;
        this.handlers = this.parent.handlers;
        this.windows = this.parent.windows;
        this.modal = this.parent.modal;
    }
    // sprawdzenie czy uzytkownik jest zalogowany i ma dostep do tego narzedzia
    async getAccessTools() {
        const odp = await this.api.send({ modules: 'modules_access_tools', method: "getAccessTools", param: { tools: "users" } });
        return odp;
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
    // pobranie konfiguracji językowej
    async getLang() {
        return await this.api.send({ method: "getUserLanguage" });
        
    }
    // pobranie danych firmy po id
    async getCompanyDataById(id) {
        const odp = await this.api.send({ modules: 'modules_company', method:'getCompanyDataById', param: { id_company: id } });
        return odp.data;
    }
    async getUsersByCompanyId(id) {
        const odp = await this.api.send({ modules: 'modules_users', method:'getUsersByCompanyId', param: { id_company: id } });
        return odp.data;
    }


}
export default METHOD;