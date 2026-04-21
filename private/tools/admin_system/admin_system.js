// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import view from 'view';
import api from 'api';
import CONFIG from './config.js';
import METHOD from './method.js';
class ADMIN_SYSTEM {
    
    constructor() {
        this.method = new METHOD(this);
        this.modal = modal;
        this.api = api;
        this.view = view;
        this.config = new CONFIG(this);
        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_SYSTEM */
    async initialize() {
        // inicjalizacja konfiguracji 
        await this.config.initialize();
        await this.view.addStartMenuItem(await this.config.getMenuItem());
    }
    
    /** otwieranie glownego okna o pdanym id */
    async open_Window_ZarzadzajFirmami() { 
        // sprawdzenie dostempu do tabeli company, jesli brak dostepu to nie otwieramy okna
        if (!await this.method.isAccessOpenWindow()) {
            const info = await this.config.getInfoWindow('alert', 'brak_dostempu_do_modulu');
            await this.modal.alert(info.title,info.message);
            return;
        }
        // otwarcie okna
         await this.view.addWindow(await this.config.get_Window_ZarzadzajFirmami());
        /** dodanie glownego meniu do okna  */
        await this.view.addMeniuWindow(await this.config.getMenu_Window_ZarzadzajFirmami());
        
       // await this.method.getCompanyData(); 
        
       
    }

    /** otworzenie przegladania firm */
        async przegladajFirmy() {
            const response = await this.method.getCompanyData();
            const data = Array.isArray(response) ? response : (response && Array.isArray(response.data) ? response.data : []);
            const content = await this.config.getContent_PrzegladajFirmy(data);
            await this.view.addWindowCard({
                id: this.config.idWindow,// id okna do ktorego dodajemy card
                cardId: 'przeglad-firm',// unikalny id dla card
                title: 'Lista firm', // wyswietlany tytul card
                text: content // zawartosc html dla card
            });
            await this.method.zaznaczanieWierszaTabeli();
        }





}

const adminSystem = new ADMIN_SYSTEM();