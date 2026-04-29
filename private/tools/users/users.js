import modal from 'modal';
import view from 'view';
import api from 'api';
import handlers from 'handlers';
import CONFIG from './config.js';
import METHOD from './method.js';
class USERS {
    constructor(idUrzytkownika=null,idFirmy=null) {
        this.idUrzytkownika = idUrzytkownika;
        this.idFirmy = idFirmy;
        this.init();

    }

    // dodanie ikony do paska nawigacji
        addNav() {
         this.method.addNav();
    }




    /** ladowanie glownych modowow */
    async init() {
        this.modal = modal; // okna modalne
        this.windows = view; // glowne okna i elementy widoku
        this.api = api ; // komunikacja z backendem
        this.handlers = handlers ; // uchwyty do zdarzen
        this.config = new CONFIG(this); // konfiguracja i ustawienia
        this.method = new METHOD(this); // metody i funkcje
        this.addNav(); // dodanie ikony do paska nawigacji
    }



}

const users = new USERS();