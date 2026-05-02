
class METHOD {
    constructor(parent){
        this.parent = parent;
        this.api = this.parent.api;
        this.data = this.parent.data;
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
    // wyswietlanie aktywnych uzytkownikow
    async showActiveUsers() {
      // pobranie danych uzytkownikow z DATA
      const activeUsers = await this.data.getActiveUsers();
      // generowanie zawartości tabeli z aktywnymi uzytkownikami
       const content = await this.config.getConfigTableUsers(activeUsers);
        // wyswietlenie zawartości w oknie
       await this.windows. addWindowCard(content);
    }
    // wyswietlenie nieaktywnych uzytkownikow
    async showInactiveUsers() {
        // pobranie danych uzytkownikow z DATA
        const inactiveUsers = await this.data.getInactiveUsers();
        // generowanie zawartości tabeli z nieaktywnymi uzytkownikami
        const content = await this.config.getConfigTableUsers(inactiveUsers);
        // wyswietlenie zawartości w oknie
        await this.windows.addWindowCard(content);
    }
        


}
export default METHOD;