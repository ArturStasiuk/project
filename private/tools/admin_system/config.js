


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
    
    /** content dla przegladania firm w formie tabeli */
    async getContent_PrzegladajFirmy(data) { 
        if (!Array.isArray(data)) return '';
        const tableStyle = `width:100%;border-collapse:collapse;margin-bottom:16px;`;
        const thStyle = `background:#f5f7fa;border:1px solid #ccc;padding:6px 8px;text-align:left;`;
        const tdStyle = `border:1px solid #ccc;padding:6px 8px;`;
        const headers = [
            'name','type','active','country','city','address'
        ];
        let html = `<div style=\"overflow-x:auto;width:100%;max-width:100%;\"><table class=\"company-table\" style=\"${tableStyle}\"><thead><tr>`;
        html += headers.map(h => `<th style=\"${thStyle}\">${h}</th>`).join('');
        html += `</tr></thead><tbody>`;
        html += data.map(firm => {
            return `<tr id=\"firm-row-${firm.id}\" data-id=\"${firm.id}\">\n` +
                `<td style=\"${tdStyle}\">${firm.name || '-'}</td>` +
                `<td style=\"${tdStyle}\">${firm.type || '-'}</td>` +
                `<td style=\"${tdStyle}\">${firm.active ? '✔️' : '❌'}</td>` +
                `<td style=\"${tdStyle}\">${firm.country || '-'}</td>` +
                `<td style=\"${tdStyle}\">${firm.city || '-'}</td>` +
                `<td style=\"${tdStyle}\">${firm.address || '-'}</td>\n` +
            `</tr>`;
        }).join('');
        html += `</tbody></table></div>`;
        return html;
    }




}

export default CONFIG;