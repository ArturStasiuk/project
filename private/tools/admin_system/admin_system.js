// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import view from 'view';
import api from 'api';
import handlers from 'handlers';
import CONFIG from './config.js';
import METHOD from './method.js';

class ADMIN_SYSTEM {
    
    constructor() {
        this.view = view;
        this.zdarzenia = handlers;
        this.method = new METHOD(this);
        this.modal = modal;
        this.api = api;
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
        await this.view.refreshWindowContent({ id: this.config.idWindow, cards: [] }); // odświeżenie zawartości okna przed dodaniem nowej karty
        /** dodanie glownego meniu do okna  */
        await this.view.addMeniuWindow(await this.config.getMenu_Window_ZarzadzajFirmami());
        
       // await this.method.getCompanyData(); 
        
       
    }

    /** otworzenie przegladania firm */
    async przegladajFirmy() {
        await this.view.refreshWindowContent({ id: this.config.idWindow, cards: [] }); // odświeżenie zawartości okna przed dodaniem nowej karty
        /** wstawienie glownego meniu  */
            await this.view.addMeniuWindow(await this.config.getMenu_Window_ZarzadzajFirmami());
        const response = await this.method.getCompanyData();
        const data = Array.isArray(response) ? response : (response && Array.isArray(response.data) ? response.data : []);
        const config = await this.config.getContent_PrzegladajFirmy(data);
        await this.view.addWindowCard(config);
        // wywolanie handlera klikniecia w wiersz tabeli, callback zwraca dane z wiersza oraz data-id firmy
       
            await this.zdarzenia.handleTableRowClick("company-table", (rowData) => { // tu odczytanie danych kliknietego wiersza w tabeli
            // usuniecie nasluchiwania 
            this.zdarzenia.removeTableRowClickHandler("company-table");
                 this.szczegolyFirmy(rowData);
            });
        }
    


    /**szczegoly firmy */
    async szczegolyFirmy(firma) {
       // console.log(firma);
       await this.view.refreshWindowContent({ id: this.config.idWindow, cards: [] }); // odświeżenie zawartości okna przed dodaniem nowej karty
       const firmaData = await this.method.getCompanyDataById(firma.id); // pobranie danych firmy po id
       const usersData = await this.method.getUsersByCompanyId(firma.id); // pobranie danych uzytkownikow firmy po id firmy
       const config = await this.config.getContent_SzczegolyFirmy(firmaData, usersData);
        await this.view.addWindowCard(config);
        /** zmiana meniu w oknie  */
        await this.view.addMeniuWindow(await this.config.getMenu_Window_SzczegolyFirmy());
    }

    /** dodaj firme */
    async formularzDodajFirme() {
        await this.view.refreshWindowContent({ id: this.config.idWindow, cards: [] }); // odświeżenie zawartości okna przed dodaniem nowej karty
        /** dodanie meniu do okna */
        await this.view.addMeniuWindow(await this.config.getMeniu_window_DodajFirme());
        const config = await this.config.getContent_DodajFirme();
        await this.view.addWindowCard(config);
        /** nasluchiwanie klikniecia przycisku zapisz i anuluj, callback zwraca id kliknietego przycisku */
        await this.zdarzenia.handleButtonClicks(["buttonAddCompany", "buttonCancelAddCompany"], async (buttonId) => {

            if (buttonId === "buttonAddCompany") { 
                await this.zapiszFirme();
            }
            else if (buttonId === "buttonCancelAddCompany") {
                await this.anulujZapisFirmy();
            }

        }); 

    }
    /** dodawanie firmy  */
    async zapiszFirme() {

        // pobranie danych z formularza po id formularza
        const formData = await this.zdarzenia.getFormData("formularz-dodaj-firme"); 
        /** walidacja danych */
        const validation = await this.method.validateAndSaveCompanyData(formData);
        if (!validation.status) {
            // obsługa błędów walidacji: formularz pozostaje otwarty,
            // czekamy na kolejne kliknięcie "Zapisz" lub "Anuluj"
            const errorsText = Object.values(validation.errors).join('\n');
            const title = this.config?.t?.alert || 'Alert!';
            await this.modal.alert(title, errorsText);
            return;
        }
       const saveResult = await this.method.saveCompanyData(validation.data); // zapis danych firmy do bazy danych
        if (!saveResult || saveResult.status !== true) {
            const title = this.config?.t?.alert || 'Alert!';
            await this.modal.alert(title, (saveResult && saveResult.message) || 'An error occurred while saving company data.');
            return;
        }
        await this.modal.alert(this.config?.t?.success || 'Success!', this.config?.t?.company_saved_successfully || 'Company data saved successfully.');

        await this.zdarzenia.removeButtonClicks(["buttonAddCompany", "buttonCancelAddCompany"]);
        await this.przegladajFirmy(); // przejście do przeglądania firm po pomyślnym zapisaniu nowej firmy
    }

    /** anulowanie dodawania firmy i powrót do przeglądania firm */
    async anulujZapisFirmy() {
        await this.zdarzenia.removeButtonClicks(["buttonAddCompany", "buttonCancelAddCompany"]);
        await this.open_Window_ZarzadzajFirmami(); // powrót do przeglądania firm po kliknięciu anuluj
    }
   

}

const adminSystem = new ADMIN_SYSTEM();