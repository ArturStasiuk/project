


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
                    <p><strong>ID:</strong> ${firm.id}</p>
                    <p><strong>${this.t.type || 'Typ'}:</strong> ${firm.type || '-'}</p>
                    <p><strong>${this.t.active || 'Aktywna'}:</strong> ${firm.active ? '✔️' : '❌'}</p>
                    <p><strong>NIP:</strong> ${firm.tax_id || '-'}</p>
                    <p><strong>REGON:</strong> ${firm.regon || '-'}</p>
                    <p><strong>KRS:</strong> ${firm.krs || '-'}</p>
                    <p><strong>${this.t.address || 'Adres'}:</strong> ${firm.address || '-'}</p>
                    <p><strong>${this.t.city || 'Miasto'}:</strong> ${firm.city || '-'}</p>
                    <p><strong>${this.t.postal_code || 'Kod pocztowy'}:</strong> ${firm.postal_code || '-'}</p>
                    <p><strong>${this.t.country || 'Kraj'}:</strong> ${firm.country || '-'}</p>
                    <p><strong>${this.t.phone || 'Telefon'}:</strong> ${firm.phone || '-'}</p>
                    <p><strong>${this.t.email || 'Email'}:</strong> ${firm.email || '-'}</p>
                    <p><strong>${this.t.website || 'Strona www'}:</strong> ${firm.website || '-'}</p>
                    <p><strong>${this.t.created_at || 'Utworzono'}:</strong> ${firm.created_at || '-'}</p>
                    <p><strong>${this.t.updated_at || 'Zaktualizowano'}:</strong> ${firm.updated_at || '-'}</p>
                </div>
            `;
        }).join('\n');
    }




}

export default CONFIG;