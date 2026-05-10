// importowanie potrzebnych narzedzi
import api from '../../../private/api/api.js';
import view from '../../view/app.js';
import handlers from '../../system/handlers.js';
import modal from '../../view/modal.js';


class Logut{
    constructor(){
        this.api = api;// api do komunikacji z backendem
        this.view = view;// widok aplikacji
        this.handlers = handlers;// handlers do obsługi eventow
        this.modal = modal;// modal do wyswietlania komunikatow
    }

   // uruchomianie wylogowywania uzytkownika
    async init(){
      alert('wylogowywanie uzytkownika');
    }
}
const logut = new Logut();
export default logut;