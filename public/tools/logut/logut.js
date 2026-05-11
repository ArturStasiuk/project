// importowanie potrzebnych narzedzi
import api from '../../../private/api/api.js';
import view from '../../view/app.js';
import handlers from '../../system/handlers.js';
import modal from '../../view/modal.js';
//---
import Config from './config.js';
//---


class Logut{
    constructor(){
        this.api = api;// api do komunikacji z backendem
        this.view = view;// widok aplikacji
        this.handlers = handlers;// handlers do obsługi eventow
        this.modal = modal;// modal do wyswietlania komunikatow
        this.config = new Config(this);
        
    }

   // uruchomianie wylogowywania uzytkownika
    async init(){
      await this.config.syncLanguage();
      const itemMenu = await this.config.configItemMenu();
      await this.view.addStartMenuItem(itemMenu);
    }
    // pokazanie okna wylogowywania
    async showLogoutWindow(){
      const window = await this.config.configLogoutWindow();
      await this.view.addWindow(window);
      const content = await this.config.configLogoutContent();
      await this.view.addWindowCard(content);
    }


 

}
const logut = new Logut();
export default logut;