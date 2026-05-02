import modal from 'modal';
import view from 'view';
import api from 'api';
import handlers from 'handlers';
import CONFIG from './config.js';
import METHOD from './method.js';
import DATA from './data.js';
class USERS {
    static instances = {};

    static get(name = 'default') {
        const key = name || 'default';
        return USERS.instances[key] || null;
    }

    static async getOrCreate(name = 'default', idUsers = null, idCompany = null) {
        const key = name || 'default';
        const existing = USERS.instances[key];

        if (!existing) {
            const instance = new USERS(key, idUsers, idCompany);
            USERS.instances[key] = instance;
            await instance.init(idUsers, idCompany);
            return instance;
        }

        if (idUsers !== null) existing.idUsers = idUsers;
        if (idCompany !== null) existing.idCompany = idCompany;

        if (typeof existing.refresh === 'function') {
            await existing.refresh(idUsers, idCompany);
        }

        return existing;
    }

    static async call(name = 'default', methodName, ...args) {
        const existing = USERS.get(name);
        if (!existing || typeof existing[methodName] !== 'function') {
            return null;
        }
        return existing[methodName](...args);
    }

    constructor(name = 'default', idUsers=null, idCompany=null) {
        this.name = name; // nazwa instancji USERS
        this.idUsers= idUsers;
        this.idCompany = idCompany;
        this.modal = modal; // okna modalne
        this.windows = view; // glowne okna i elementy widoku
        this.api = api; // komunikacja z backendem
        this.data = new DATA(this); // dane i logika biznesowa
        this.handlers = handlers ; // uchwyty do zdarzen
        this.method = new METHOD(this); // metody i funkcje
        this.config = new CONFIG(this); // konfiguracja i ustawienia
        this.method.config = this.config;
        this.config.configLang(); // pobranie konfiguracji językowej przed dodaniem nav
      //  this.init();

    }

    // dodanie ikony do paska nawigacji
    async addNav() {
        if (!await this.checkAccess()) return;
        await this.data.getUsersByCompanyId();
        await this.data.getAccessMenu();
        await this.method.refreshMenu();
        await this.method.addNav();
    }
    // otwarcie okna po kliknięciu na element nawigacji
     async openWindow() {
        if (!await this.checkAccess()) return;
      //  await this.data.getUsersByCompanyId();
        await this.data.getAccessMenu();
        await this.method.openWindow();
        await this.method.refreshMenu();
        await this.data.getActiveUsers();
    }

    // sprawdzenie czy uzytkownik jest zalogowany i ma dostep do tego narzedzia
    async checkAccess() {
        const access_tools = await this.data.getAccessTools();
        if (!access_tools || parseInt(access_tools.access_tools, 10) !== 1) {
            // Brak dostępu - wyświetlenie komunikatu i zamknięcie okna
            this.modal.alert(this.config.lang.access_tools || "Access Tools", this.config.lang.noAccess || "You do not have access to this tool.");
            this.destroy();
            return false;
        }
        return true;
    }

    // wyswietlenie aktywnych uzytkownikow
    async showActiveUsers() {
        this.method.showActiveUsers();

    }
    // wyswietlenie nieaktywnych uzytkownikow
    async showInactiveUsers() {
        this.method.showInactiveUsers();
    }












    /** pierwsze uruchomienie obiektu USERS */
    async init(idUsers = null, idCompany = null) {
       await this.openWindow(); // dodanie ikony do paska nawigacji
    }
    /** odświeżanie istniejącego obiektu USERS */
    async refresh(idUsers = null, idCompany = null) {
       await this.openWindow(); // odświeżenie okna, można dodać dodatkowe logiki jeśli potrzebne
    }
    /** usunięcie obiektu USERS */
    async destroy() {
        try {
            const windowId = this.name;
            const navId = "nav-users-" + this.name;

            if (this.windows) {
                await this.windows.removeWindow({ id: windowId });
                await this.windows.removeStartMenuItem({ id: navId });
            }
        } catch (error) {
            console.warn('USERS.destroy: nie udało się usunąć widoku lub nawigacji', error);
        } finally {
            if (USERS.instances && typeof USERS.instances === 'object') {
                delete USERS.instances[this.name];
            }
        }
    }

}

window.USERS = window.USERS || USERS;

// Wywołanie obiektu USERS po nazwie:
// - jeśli obiekt nie istnieje: tworzy nowy, przekazując idUsers i idCompany do konstruktora i uruchamia init()
// - jeśli obiekt istnieje: aktualizuje parametry i uruchamia refresh()
// Przykład: await users('firma123', 1, 5);
const users = async (name = 'default', idUsers = null, idCompany = null) => {
    return window.USERS.getOrCreate(name, idUsers, idCompany);
};

// Wywołanie dowolnej metody na istniejącym obiekcie USERS:
// - jeśli obiekt lub metoda nie istnieje, zwraca null
// Przykład: await window.USERS.call('firma123', 'refresh');
// Przykład: await window.USERS.call('firma123', 'someMethod', arg1, arg2);
window.users = users;
