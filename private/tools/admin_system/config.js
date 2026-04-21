


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
                    disabled: !opcjeMeniu.create, onClick: async () => { await this.parent.dodajFirme()}
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
    
    /** content dla przegladania firm w formie tabeli 
     * Tabela ma teraz id="company-table", a każdy wiersz posiada klasę .* selectable-row, id w formacie firm-row-{id} oraz data-id z id firmy. Dzięki temu możesz łatwo napisać kod JS do zaznaczania wiersza i odczytywania id firmy z data-id.
    */
    async getContent_PrzegladajFirmy(data) {
        if (!Array.isArray(data)) data = [];
        const tableStyle = `width:100%;border-collapse:collapse;margin-bottom:16px;`;
        const thStyle = `background:#f5f7fa;border:1px solid #ccc;padding:6px 8px;text-align:left;`;
        const tdStyle = `border:1px solid #ccc;padding:6px 8px;`;
        const headers = [
            'name','type','active','country','city','address'
        ];
        let html = `<div style=\"overflow-x:auto;width:100%;max-width:100%;\"><table id=\"company-table\" class=\"company-table\" style=\"${tableStyle}\"><thead><tr>`;
        html += headers.map(h => `<th style=\"${thStyle}\">${this.t[h] || h}</th>`).join('');
        html += `</tr></thead><tbody>`;
        html += data.map(firm => {
            return `<tr class=\"selectable-row\" id=\"firm-row-${firm.id}\" data-id=\"${firm.id}\" style=\"cursor:pointer;\">\n` +
                `<td style=\"${tdStyle}\">${firm.name || '-'}</td>` +
                `<td style=\"${tdStyle}\">${firm.type || '-'}</td>` +
                `<td style=\"${tdStyle}\">${firm.active ? '✔️' : '❌'}</td>` +
                `<td style=\"${tdStyle}\">${firm.country || '-'}</td>` +
                `<td style=\"${tdStyle}\">${firm.city || '-'}</td>` +
                `<td style=\"${tdStyle}\">${firm.address || '-'}</td>\n` +
            `</tr>`;
        }).join('');
        html += `</tbody></table></div>`;
        return {
            id: this.idWindow,
            cardId: 'przeglad-firm',
            title: this.t.lista_firm || 'Lista firm',
            text: html
        };
    }

    /** content dla dodawania nowej firmy */
    async getContent_DodajFirme() {
        const t = this.t;
        const html = `
        <form id="add-company-form" style="max-width:520px;margin:auto;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div style="grid-column:1/3"><label>${t.name}*<br>
                    <input type="text" name="name" maxlength="255" required placeholder="${t.name}"></label></div>
                <div><label>${t.type}*<br>
                    <input type="text" name="type" maxlength="100" required placeholder="${t.type}"></label></div>
                <div><label>${t.active}<br>
                    <select name="active">
                        <option value="1">✔️ ${t.active}</option>
                        <option value="0">❌</option>
                    </select></label></div>
                <div><label>${t.tax_id}<br>
                    <input type="text" name="tax_id" maxlength="50" placeholder="${t.tax_id}"></label></div>
                <div><label>${t.regon}<br>
                    <input type="text" name="regon" maxlength="50" placeholder="${t.regon}"></label></div>
                <div><label>${t.krs}<br>
                    <input type="text" name="krs" maxlength="50" placeholder="${t.krs}"></label></div>
                <div style="grid-column:1/3"><label>${t.address}<br>
                    <input type="text" name="address" maxlength="255" placeholder="${t.address}"></label></div>
                <div><label>${t.city}<br>
                    <input type="text" name="city" maxlength="100" placeholder="${t.city}"></label></div>
                <div><label>${t.postal_code}<br>
                    <input type="text" name="postal_code" maxlength="20" placeholder="${t.postal_code}"></label></div>
                <div><label>${t.country}<br>
                    <input type="text" name="country" maxlength="100" placeholder="${t.country}"></label></div>
                <div><label>${t.phone}<br>
                    <input type="text" name="phone" maxlength="50" placeholder="${t.phone}"></label></div>
                <div><label>${t.email}<br>
                    <input type="email" name="email" maxlength="100" placeholder="${t.email}"></label></div>
                <div style="grid-column:1/3"><label>${t.website}<br>
                    <input type="url" name="website" maxlength="100" placeholder="${t.website}"></label></div>
            </div>
            <div style="margin-top:18px;text-align:right;">
                <button type="submit">${t.zapisz}</button>
                <button type="button" style="margin-left:8px;">${t.anuluj}</button>
            </div>
        </form>
        `;
        return {
            id: this.idWindow,
            cardId: 'dodaj-firme',
            title: t.menu_zapisz || 'Dodaj firmę',
            text: html
        };
    }



}

export default CONFIG;