import modal from 'modal';
import view from 'view';
import api from 'api';
import handlers from 'handlers';
import CONFIG from './config.js';
import METHOD from './method.js';
class USERS {
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
        await this.config.configLang(); // pobranie konfiguracji językowej przed dodaniem nav
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



    /** ladowanie glownych modowow */
    async init() {
        await this.openWindow(); // dodanie ikony do paska nawigacji


    }



}

const users = window.users || new USERS();
window.USERS = USERS;
window.users = users;