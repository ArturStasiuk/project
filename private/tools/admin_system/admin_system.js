// Prywatne narzędzie ładowane przez API jako Blob URL.
// Ścieżki względne (np. '../../view/modal.js') nie działają w Blob URL —
// zamiast tego używamy krótkich nazw zdefiniowanych w import map (index.php).
import modal from 'modal';
import view from 'view';
import api from 'api';
import handlers from 'handlers';
import CONFIG from './config.js';
import METHOD from './method.js';
import EDYCJA_FIRMY from './edytuj.js';
import USUN_FIRME from './usun.js';

class ADMIN_SYSTEM {
    
    constructor() {
        this.view = view;
        this.zdarzenia = handlers;
        this.method = new METHOD(this);
        this.modal = modal;
        this.api = api;
        this.config = new CONFIG(this);
        this.edytuj = new EDYCJA_FIRMY(this);
        this.usun = new USUN_FIRME(this);
        this.initialize();
    }
    /** Inicjalizacja modułu ADMIN_SYSTEM */
    async initialize() {
        // inicjalizacja konfiguracji 
        await this.config.initialize();
        await this.modal.initialize();
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
        const menuZarzadzajFirmami = await this.config.getMenu_Window_ZarzadzajFirmami();
        if (menuZarzadzajFirmami) {
            await this.view.refreshWindowMenubar({ id: this.config.idWindow, menus: [] });
            await this.view.addMeniuWindow(menuZarzadzajFirmami);
        }
        
       // await this.method.getCompanyData(); 
        
       
    }

    /** otworzenie przegladania firm */
    async przegladajFirmy() {
        await this.view.refreshWindowContent({ id: this.config.idWindow, cards: [] }); // odświeżenie zawartości okna przed dodaniem nowej karty
        /** wstawienie glownego meniu  */
        const menuZarzadzajFirmami = await this.config.getMenu_Window_ZarzadzajFirmami();
        if (menuZarzadzajFirmami) {
            await this.view.refreshWindowMenubar({ id: this.config.idWindow, menus: [] });
            await this.view.addMeniuWindow(menuZarzadzajFirmami);
        }
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
        const companyId = firma?.id ?? firma?.company_id ?? firma;
        if (!companyId) {
            console.warn('szczegolyFirmy: brak id firmy', firma);
            return;
        }
        await this.view.refreshWindowContent({ id: this.config.idWindow, cards: [] }); // odświeżenie zawartości okna przed dodaniem nowej karty
        const firmaData = await this.method.getCompanyDataById(companyId); // pobranie danych firmy po id
        const usersData = await this.method.getUsersByCompanyId(companyId); // pobranie danych uzytkownikow firmy po id firmy
        const config = await this.config.getContent_SzczegolyFirmy(firmaData, usersData);
        await this.view.addWindowCard(config);
        /** zmiana meniu w oknie  */
        const menuSzczegolyFirmy = await this.config.getMenu_Window_SzczegolyFirmy();
        if (menuSzczegolyFirmy) {
            await this.view.refreshWindowMenubar({ id: this.config.idWindow, menus: [] });
            await this.view.addMeniuWindow(menuSzczegolyFirmy);
        }
        /** dodanie meniu zarzadzania urzytkownikami w firmie */
        const menuPracownicy = await this.config.get_Menu_Window_ZarzadzajPracownikami();
        if (menuPracownicy) {
            await this.view.addMeniuWindow(menuPracownicy);
        }

    }

    /** dodaj firme */
    async formularzDodajFirme() {
        await this.view.refreshWindowContent({ id: this.config.idWindow, cards: [] }); // odświeżenie zawartości okna przed dodaniem nowej karty
        /** dodanie meniu do okna */
        const menuDodajFirme = await this.config.getMeniu_window_DodajFirme();
        if (menuDodajFirme) {
            await this.view.refreshWindowMenubar({ id: this.config.idWindow, menus: [] });
            await this.view.addMeniuWindow(menuDodajFirme);
        }
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


    // edytuj dane firmy 
    async edytujFirme(){
        let companyId = null;
        const hiddenInput = document.querySelector('input[name="company_id"]');
        if (hiddenInput && hiddenInput.value) {
            companyId = hiddenInput.value;
        } else {
            const row = document.querySelector('#company-table tr.selectable-row');
            companyId = row?.dataset.id;
        }

        if (!companyId) return;

        
        const edycjaFirmy = new EDYCJA_FIRMY(this, companyId);
        await edycjaFirmy.open();
    }
    // usun firme
    async usunFirme() {
        let companyId = null;
        const hiddenInput = document.querySelector('input[name="company_id"]'); 
        if (hiddenInput && hiddenInput.value) {
            companyId = hiddenInput.value;
        } else {
            const row = document.querySelector('#company-table tr.selectable-row');
            companyId = row?.dataset.id;
        }   
        if (!companyId) return;
        const usunFirmy = new USUN_FIRME(this, companyId);
        await usunFirmy.usunFirme();
    }


}

const adminSystem = new ADMIN_SYSTEM();