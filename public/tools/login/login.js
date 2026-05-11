
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

        this.config = new config(this);// config logowania
        this.isInitialized = false;// czy logowanie jest już inicjalizowane
        this.handlers = handlers;// handlers do obsługi eventow
        this.modal = modal;// modal do wyswietlania komunikatow
      //  this.init();// inicjalizacja logowania

    }

    async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        await this.setLanguage();
        // sprawdzenie czy jest zalogowany uzytkownik
        const odp = await this.api.getSessionData();
        if(odp.data.id) {
            // wywolanie po zalogowaniu strony głównej
            window.location.reload();
            return;
        }
        else {
           // dodanie ikony logowania do paska menu
           await this.addLoginIconToTaskbar();
        }
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
       await this.handlers.handleButtonClicks(['button_zaloguj', 'button_anuluj'], async (id) => {
        if(id === 'button_zaloguj'){
            // usuniecie nasluchiwania na eventy
            await this.handlers.removeButtonClicks(['button_zaloguj', 'button_anuluj']);
            this.zaloguj();
        }else if(id === 'button_anuluj'){
            // usuniecie nasluchiwania na eventy
            await this.handlers.removeButtonClicks(['button_zaloguj', 'button_anuluj']);
            //usuniecie okna logowania
            await this.view.removeWindow({id:window.id});
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
        // przeladowanie strony głownej
        window.location.reload();
        return;
       }
    }
    // dodanie ikony logowania do paska menu
    async addLoginIconToTaskbar() {

        await this.view.addTaskbarItem(await this.config.getLoginIcon());
    }



    /** ustawienie jezyka z window.dataSystem (uzupelnione przez system.loadLanguageUser). */
    async setLanguage() {
        const code = window.dataSystem.language ?? 'English';
        this.language = code;
        this.launge = window.dataSystem.launge ?? LAUNGE_LOGIN.English;
    }



}
const login = new Login();
export default login;