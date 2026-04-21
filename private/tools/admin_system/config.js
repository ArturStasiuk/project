


import LAUNGE from './launge.js';

class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.api = parent.api;
        this.lang = 'English';
        this.t = LAUNGE[this.lang] || {};
        this.idMemiuItem = "icon_zarzadaj_firmami";
        this.idWindow = "window_zarzadaj_firmami";

    }


    /** Inicjalizacja modułu CONFIG */
    async initialize() {
        // Pobiera język użytkownika przez API i ustawia tłumaczenia
        const odp = await this.api.send({ method: "getUserLanguage" });
        this.lang = odp.lang || 'English';
        this.t = LAUNGE[this.lang] || {};
       // console.log(`Język użytkownika: ${this.lang}`);
    }

    // Zwraca konfigurację pozycji w menu startowym dla narzędzia ADMIN_SYSTEM
   async getMenuItem() {
        return {
            id: this.idMemiuItem,
            icon: this.t.icon ,
            label: this.t.label_zarzadzaj_firmami ,
            disabled: false,
            onClick: async () => await this.parent.open_Window_ZarzadzajFirmami()
        };
   }
    /** okno powitalne */
    async getWelcomeMessage() {
        return {
            title: this.t.title_welcome ,
            message: this.t.welcome 
            
        };
    }

    /** konfiguracja okna */
    async get_Window_ZarzadzajFirmami() {
        return {
            id: this.idWindow,
            icon: this.t.icon,
            title: this.t.label_zarzadzaj_firmami,
            width: 600,
            height: 400,

        };
    }

    /** meniu dla window zarzadzaj firmami */
    async getMenu_Window_ZarzadzajFirmami() {
        const opcjeMeniu = await this.parent.method.accessMenu_Window_ZarzadzajFirmami();
        return {
            id: this.idWindow, // id musi być taki sam jak id okna, do którego menu ma być przypisane
            menuId: 'menu:'+ this.idWindow,
            label: this.t.menu_label_zarzadzaj_firmami,
            items: [
                {
                    icon: '📂', label: this.t.menu_otworz,
                    disabled: !opcjeMeniu.read, onClick: async () => { await this.parent.przegladajFirmy() }
                },
                {
                    icon: '➕', label: this.t.menu_zapisz,
                    disabled: !opcjeMeniu.create, onClick: async () => { }
                },
                {
                    icon: '✏️', label: this.t.menu_edytuj,
                    disabled: !opcjeMeniu.update, onClick: async () => { }
                },
                {
                    icon: '🗑️', label: this.t.menu_usun,
                    disabled: !opcjeMeniu.delete, onClick: async () => { }
                }
            ]
        };
    }

    //okno informacyjne 
    async getInfoWindow(title, message, useTranslation = true) {
        return {
            title: useTranslation ? (this.t[title] || title) : title,
            message: useTranslation ? (this.t[message] || message) : message
        };
    }
    
    /** content dla firm wformie divow */
    async getContent_PrzegladajFirmy(data) { 
        if (!Array.isArray(data)) return '';
        return data.map(firm => {
            return `
                <div class="company-card" data-id="${firm.id}">
                    <h3>${firm.name || ''}</h3>
                    <p><strong>id:</strong> ${firm.id}</p>
                    <p><strong>name:</strong> ${firm.name || '-'}</p>
                    <p><strong>type:</strong> ${firm.type || '-'}</p>
                    <p><strong>active:</strong> ${firm.active ? '✔️' : '❌'}</p>
                    <p><strong>tax_id:</strong> ${firm.tax_id || '-'}</p>
                    <p><strong>regon:</strong> ${firm.regon || '-'}</p>
                    <p><strong>krs:</strong> ${firm.krs || '-'}</p>
                    <p><strong>address:</strong> ${firm.address || '-'}</p>
                    <p><strong>city:</strong> ${firm.city || '-'}</p>
                    <p><strong>postal_code:</strong> ${firm.postal_code || '-'}</p>
                    <p><strong>country:</strong> ${firm.country || '-'}</p>
                    <p><strong>phone:</strong> ${firm.phone || '-'}</p>
                    <p><strong>email:</strong> ${firm.email || '-'}</p>
                    <p><strong>website:</strong> ${firm.website || '-'}</p>
                    <p><strong>created_at:</strong> ${firm.created_at || '-'}</p>
                    <p><strong>updated_at:</strong> ${firm.updated_at || '-'}</p>
                </div>
            `;
        }).join('\n');
    }




}

export default CONFIG;