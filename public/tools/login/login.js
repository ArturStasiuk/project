// ostatnia aktualizacja: 10.05.2026
import LAUNGE_LOGIN from './laungue_login.js';
import view from '../../view/app.js';
import api from '../../../private/api/api.js';
import config from './config.js';
import handlers from '../../system/handlers.js';
import modal from '../../view/modal.js';
class Login{
    constructor(){
        this.view = view;// widok aplikacji
        this.api = api;// api do komunikacji z backendem
        this.language = 'English';// domyslny jezyk (klucz LAUNGE_LOGIN)
        this.launge = LAUNGE_LOGIN.English;
        this.config = new config(this);// config logowania
        this.isInitialized = false;// czy logowanie jest już inicjalizowane
        this.handlers = handlers;// handlers do obsługi eventow
        this.modal = modal;// modal do wyswietlania komunikatow
        this.init();// inicjalizacja logowania

    }

    async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        await this.setLanguage();
       await this.showLoginWindow();
    }


    // pokaz okno logowania 
    async showLoginWindow() {
    const window = await this.config.getLoginWindow();
    const content = await this.config.getLoginContent();
       // dodanie okna
       await this.view.addWindow(window);
       // dodanie karty
       await  this.view.addWindowCard(content);
       // podpiecie eventow do nasluchiwania klikniecia na przyciski
       this.handlers.handleButtonClicks(['button_zaloguj', 'button_anuluj'], (id) => {
        if(id === 'button_zaloguj'){
            this.zaloguj();
        }else if(id === 'button_anuluj'){
            //zminimalizowanie okna 
            this.view.minimizeWindow({id:window.id});
           // this.view.removeWindow({id:window.id});
        }
       });

    }
    // obsługa klikniecia na przycisk zaloguj
    async zaloguj(){
        // odczytanie danych z formularza
        const data = await this.handlers.getFormData('login_form');
        if (!data?.email || !data?.password) {
            // pobranie komunikatu o bledzie 
           const modal = await this.config.getAlert_Please_sign();
            await this.modal.alert(modal.title, modal.message);
            return;
        }
        // wyslanie danych do backendu
        const odp = await this.api.login(data);
       if (odp.status_response.status === false){
        // wyswietlenie komunikatu o bledzie logowania
        const modal = await this.config.getAlert_Login_Error();
        await this.modal.alert(modal.title, modal.message);
        return;
       }
       else {
        // wywolanie po zalogowaniu strony głównej
        const modal = await this.config.getAlert_Logged_In(odp.data.name + ' ' + odp.data.last_name);
        await this.modal.alert(modal.title, modal.message);
        return;
       }
    }




    /** ustawienie jezyka */
    async setLanguage() {
        const res = await this.api.getLanguageUser();
        const code = res?.data?.language ?? 'English';
        const supported = Object.keys(LAUNGE_LOGIN);
        this.language = supported.includes(code) ? code : 'English';
        this.launge = LAUNGE_LOGIN[this.language];
    }



}
const login = new Login();
export default login;