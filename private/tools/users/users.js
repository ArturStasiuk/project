import modal from 'modal';
import view from 'view';
import api from 'api';
import handlers from 'handlers';
import CONFIG from './config.js';
import METHOD from './method.js';
class USERS {
    static instances = {};

    static async getOrCreate(name = 'default', idUsers = null, idCompany = null) {
        const key = name || 'default';
        if (!USERS.instances[key]) {
            const instance = new USERS(idUsers, idCompany);
            instance.name = key;
            USERS.instances[key] = instance;
            return { instance, created: true };
        }

        const existing = USERS.instances[key];
        if (idUsers !== null) existing.idUsers = idUsers;
        if (idCompany !== null) existing.idCompany = idCompany;

        if (typeof existing.refresh === 'function') {
            await existing.refresh(idUsers, idCompany);
        }

        return { instance: existing, created: false };
    }

    constructor(idUsers=null,idCompany=null) {
        this.idUsers= idUsers;
        this.idCompany = idCompany;
        this.modal = modal; // okna modalne
        this.windows = view; // glowne okna i elementy widoku
        this.api = api ; // komunikacja z backendem
        this.handlers = handlers ; // uchwyty do zdarzen
        this.method = new METHOD(this); // metody i funkcje
        this.config = new CONFIG(this); // konfiguracja i ustawienia
        this.method.config = this.config;
        this.config.configLang(); // pobranie konfiguracji językowej przed dodaniem nav
      //  this.init();

    }

    // dodanie ikony do paska nawigacji
    async addNav() {
        await this.method.addNav();
    }
    // otwarcie okna po kliknięciu na element nawigacji
     async openWindow() {
        await this.method.openWindow();
    }



    /** pierwsze uruchomienie */
    async init(idUsers = null, idCompany = null) {
        alert('init users');
        if (idUsers !== null) this.idUsers = idUsers;
        if (idCompany !== null) this.idCompany = idCompany;
        await this.openWindow(); // dodanie ikony do paska nawigacji
    }
    /** odswierzanie istniejacego obiektu USERS */
    async refresh(idUsers = null, idCompany = null) {
        alert('refresh users');
    }

}

window.USERS = window.USERS || USERS;
const existingUsers = window.users;
if (existingUsers instanceof USERS) {
    window.users = { default: existingUsers };
} else {
    window.users = existingUsers || {};
}
USERS.instances = window.users;