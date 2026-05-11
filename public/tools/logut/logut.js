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
      // podpiecie eventow do nasluchiwania klikniecia na przyciski
      await this.handlers.handleButtonClicks(['button_wyloguj', 'button_anuluj_wylogowanie'], async (id) => {
        if(id === 'button_wyloguj'){
          // usuniecie nasluchiwania na eventy
          await this.handlers.removeButtonClicks(['button_wyloguj', 'button_anuluj_wylogowanie']);
         this.wyloguj();
        }else if(id === 'button_anuluj_wylogowanie'){
          // usuniecie nasluchiwania na eventy
          await this.handlers.removeButtonClicks(['button_wyloguj', 'button_anuluj_wylogowanie']);
          this.anulujWylogowanie();
        }
      });
    }

    // obsługa klikniecia na przycisk wyloguj
    async wyloguj(){
       // usuniecie danych sesji uzytkwnika z sesji
       await this.api.logout();
       // odswiezenie strony
       window.location.reload();
    }
    // obsługa klikniecia na przycisk anuluj wylogowanie
    async anulujWylogowanie(){
      // usuniecie okna wylogowywania
      await this.view.removeWindow({id:'logout_window'});
    }


 

}
const logut = new Logut();
export default logut;