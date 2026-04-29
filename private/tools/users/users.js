import modal from 'modal';
import view from 'view';
import api from 'api';
import handlers from 'handlers';

class USERS {
    constructor() {
        this.init();


    }






    /** ladowanie glownych modowow */
    init() {
        this.oknoModalne = modal;
        this.windows = view;
        this.api = api;
        this.uchwyt = handlers;
    }

}

const users = new USERS();