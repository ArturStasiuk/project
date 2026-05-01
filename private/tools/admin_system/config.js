


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
            icon: this.t.icon,
            label: this.t.label_zarzadzaj_firmami,
            disabled: false,
            onClick: async () => await this.parent.open_Window_ZarzadzajFirmami()
        };
    }
    /** okno powitalne */
    async getWelcomeMessage() {
        return {
            title: this.t.title_welcome,
            message: this.t.welcome
            
        };
    }

    /** konfiguracja okna */
    async get_Window_ZarzadzajFirmami() {
        return {
            id: this.idWindow,
            icon: this.t.icon,
            title: this.t.label_zarzadzaj_firmami,
            size: { width: 800, height: 600 } 

        };
    }

    /** meniu dla window zarzadzaj firmami */
    async getMenu_Window_ZarzadzajFirmami() {
        const opcjeMeniu = await this.parent.method.accessMenu_Window_ZarzadzajFirmami();
            if (!opcjeMeniu.access_table) {
                return null; // Brak dostępu do modułu zarządzania firmami, nie dodajemy menu
            }
        return {
            id: this.idWindow, // id musi być taki sam jak id okna, do którego menu ma być przypisane
            menuId: 'menu:' + this.idWindow,
            label: '📂 ' + this.t.menu_label_zarzadzaj_firmami,

            items: [
                {
                    icon: '📂', label: this.t.menu_otworz,
                    disabled: !opcjeMeniu.read, onClick: async () => { await this.parent.przegladajFirmy() }
                },
                {
                    icon: '➕', label: this.t.menu_zapisz,
                    disabled: !opcjeMeniu.create, onClick: async () => { await this.parent.formularzDodajFirme() }
                },
                {
                    icon: '✏️', label: this.t.menu_edytuj,
                    disabled: true, onClick: async () => { }
                },
                {
                    icon: '🗑️', label: this.t.menu_usun,
                    disabled: true, onClick: async () => { }
                }
            ]
        };
    }

    /** meniu po wybraniu szczegowow firmy */
    async getMenu_Window_SzczegolyFirmy() {
        const opcjeMeniu = await this.parent.method.accessMenu_Window_ZarzadzajFirmami();
        return {
            id: this.idWindow, // id musi być taki sam jak id okna, do którego menu ma być przypisane
            menuId: 'menu:' + this.idWindow,
            label: '📂 ' + this.t.menu_label_zarzadzaj_firmami,

            items: [
                {
                    icon: '📂', label: this.t.menu_otworz,
                    disabled: !opcjeMeniu.read, onClick: async () => { await this.parent.przegladajFirmy() }
                },
                {
                    icon: '➕', label: this.t.menu_zapisz,
                    disabled: !opcjeMeniu.create, onClick: async () => { await this.parent.formularzDodajFirme() }
                },
                {
                    icon: '✏️', label: this.t.menu_edytuj,
                    disabled: !opcjeMeniu.update, onClick: async () => {  await this.parent.edytujFirme()}
                },
                {
                    icon: '🗑️', label: this.t.menu_usun,
                    disabled: !opcjeMeniu.delete, onClick: async () => { await this.parent.usunFirme() }
                }
            ]
        };    
    }
    /** menu dla zarządzania użytkownikami */
    async get_Menu_Window_ZarzadzajUzytkownikami() {
        const opcjeMeniu = await this.parent.method.accessMenu_Window_ZarzadzajUzytkownikami();
         if (!opcjeMeniu.access_table) {
            return null; // Brak dostępu do modułu zarządzania użytkownikami, nie dodajemy menu
            }
        return {
            id: this.idWindow,
            menuId: 'menu:' + this.idWindow + ':uzytkownicy',
            label: '👥 ' + (this.t.menu_label_zarzadzaj_uzytkownikami || 'Manage users'),
            items: [
                {
                    icon: '👥',
                    label: this.t.menu_otworz_uzytkownikow || 'Browse users',
                    disabled: !opcjeMeniu.read,
                    onClick: async () => {await this.parent.przeglajUzytkownikow()
                    }
                },
                {   
                    icon: '➕',
                    label: this.t.menu_zapisz_uzytkownika || 'Add new user',
                    disabled: !opcjeMeniu.create, // Dodawanie użytkowników nie jest jeszcze zaimplementowane
                },
                {
                    icon: '✏️',
                    label: this.t.menu_edytuj_uzytkownika || 'Edit user',
                    disabled: true, // Edycja użytkowników nie jest jeszcze zaimplementowana
                },
                {
                    icon: '🗑️',
                    label: this.t.menu_usun_uzytkownika || 'Delete user',
                    disabled: true, // Usuwanie użytkowników nie jest jeszcze zaimplementowane
                }   
            ]
        };
    }






    /** meniu dodaj nowa firme */
    async getMeniu_window_DodajFirme() {
        const opcjeMeniu = await this.parent.method.accessMenu_Window_ZarzadzajFirmami();
        return {
            id: this.idWindow, // id musi być taki sam jak id okna, do którego menu ma być przypisane
            menuId: 'menu:' + this.idWindow,
            label: '📂 ' + this.t.menu_label_zarzadzaj_firmami,

            items: [
                {
                    icon: '📂', label: this.t.menu_otworz,
                    disabled: !opcjeMeniu.read, onClick: async () => { await this.parent.przegladajFirmy() }
                },
                {
                    icon: '➕', label: this.t.menu_zapisz,
                    disabled: true, onClick: async () => { await this.parent.formularzDodajFirme() }
                },
                {
                    icon: '✏️', label: this.t.menu_edytuj,
                    disabled: true, onClick: async () => { 
                       
                    }
                },
                {
                    icon: '🗑️', label: this.t.menu_usun,
                    disabled: true, onClick: async () => { }
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
        // Style inspirowane modal.css i formularzem
        const wrapperStyle = [
            'background: rgba(243,243,243,0.97)',
            'border-radius: 12px',
            'box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(25,118,210,0.08)',
            'padding: 28px 32px 24px 32px',
            'max-width: 820px',
            'margin: 32px auto',
            'font-family: \'Segoe UI Variable\', \'Segoe UI\', Arial, sans-serif',
            'color: #222',
            'border: 1px solid rgba(180,200,230,0.18)',
            'overflow-x: auto',
            'width: 100%'
        ].join(';');
        const tableStyle = [
            'width: 100%',
            'border-collapse: separate',
            'border-spacing: 0',
            'background: transparent',
            'margin-bottom: 0',
            'font-size: 1.04rem',
            'box-shadow: none'
        ].join(';');
        const thStyle = [
            'background: #f5f7fa',
            'border-bottom: 2px solid #b4c7e7',
            'padding: 10px 12px',
            'text-align: left',
            'font-weight: 600',
            'color: #1976d2',
            'letter-spacing: 0.01em',
            'font-size: 1.04rem'
        ].join(';');
        const tdStyle = [
            'border-bottom: 1px solid #e0e7ef',
            'padding: 9px 12px',
            'background: #fff',
            'font-size: 1.01rem',
            'color: #222'
        ].join(';');
        const trHover = 'this.style.background=\'#eaf1fb\'';
        const trOut = 'this.style.background=\'#fff\'';
        const headers = [
            'name','type','active','country','city','address'
        ];
        let html = `<div style=\"${wrapperStyle}\"><table id=\"company-table\" class=\"company-table\" style=\"${tableStyle}\"><thead><tr>`;
        html += headers.map(h => `<th style=\"${thStyle}\">${this.t[h] || h}</th>`).join('');
        html += `</tr></thead><tbody>`;
        html += data.map(firm => {
            return `<tr class=\"selectable-row\" id=\"firm-row-${firm.id}\" data-id=\"${firm.id}\" style=\"cursor:pointer;transition:background 0.15s;\" onmouseover=\"${trHover}\" onmouseout=\"${trOut}\">\n` +
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
        // Style inspirowane modal.css, ale inline
        const formStyle = [
            'background: rgba(243,243,243,0.97)',
            'border-radius: 12px',
            'box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(25,118,210,0.08)',
            'padding: 28px 32px 24px 32px',
            'max-width: 520px',
            'margin: 32px auto',
            'font-family: \'Segoe UI Variable\', \'Segoe UI\', Arial, sans-serif',
            'color: #222',
            'border: 1px solid rgba(180,200,230,0.18)',
            'display: flex',
            'flex-direction: column',
            'align-items: stretch',
            'overflow: hidden'
        ].join(';');
        const gridStyle = [
            'display: grid',
            'grid-template-columns: 1fr 1fr',
            'gap: 14px',
            'margin-bottom: 18px'
        ].join(';');
        const labelStyle = [
            'font-size: 1.04rem',
            'font-weight: 500',
            'color: #222',
            'margin-bottom: 2px',
            'display: block'
        ].join(';');
        const inputStyle = [
            'width: 100%',
            'padding: 0.55em 0.9em',
            'border-radius: 6px',
            'border: 1px solid #b4c7e7',
            'background: #f5f7fa',
            'font-size: 1rem',
            'margin-top: 2px',
            'margin-bottom: 0',
            'box-sizing: border-box',
            'transition: border 0.15s, box-shadow 0.15s',
            'outline: none'
        ].join(';');
        const selectStyle = inputStyle;
        const buttonStyle = [
            'padding: 0.6em 2.2em',
            'border-radius: 6px',
            'background: linear-gradient(180deg, #eaf1fb 0%, #d2e3fc 100%)',
            'color: #222',
            'border: 1px solid #b4c7e7',
            'font-size: 1rem',
            'font-family: inherit',
            'cursor: pointer',
            'transition: background 0.15s, border 0.15s, color 0.15s',
            'box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08)',
            'margin-right: 12px',
            'outline: none'
        ].join(';');
        const buttonStyleNo = [
            buttonStyle,
            'background: linear-gradient(180deg, #fbeaea 0%, #fcd2d2 100%)',
            'color: #d32f2f',
            'border: 1px solid #d32f2f'
        ].join(';');
        const html = `
        <form id="formularz-dodaj-firme" style="${formStyle}">
            <div style="${gridStyle}">
                <div style="grid-column:1/3"><label style="${labelStyle}">${t.name}*<br>
                    <input type="text" name="name" maxlength="255" required placeholder="${t.name}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.type}*<br>
                    <input type="text" name="type" maxlength="100" required placeholder="${t.type}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.active}<br>
                    <select name="active" style="${selectStyle}">
                        <option value="1">✔️ ${t.active}</option>
                        <option value="0">❌</option>
                    </select></label></div>
                <div><label style="${labelStyle}">${t.tax_id}<br>
                    <input type="text" name="tax_id" maxlength="50" placeholder="${t.tax_id}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.regon}<br>
                    <input type="text" name="regon" maxlength="50" placeholder="${t.regon}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.krs}<br>
                    <input type="text" name="krs" maxlength="50" placeholder="${t.krs}" style="${inputStyle}"></label></div>
                <div style="grid-column:1/3"><label style="${labelStyle}">${t.address}<br>
                    <input type="text" name="address" maxlength="255" placeholder="${t.address}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.city}<br>
                    <input type="text" name="city" maxlength="100" placeholder="${t.city}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.postal_code}<br>
                    <input type="text" name="postal_code" maxlength="20" placeholder="${t.postal_code}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.country}<br>
                    <input type="text" name="country" maxlength="100" placeholder="${t.country}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.phone}<br>
                    <input type="text" name="phone" maxlength="50" placeholder="${t.phone}" style="${inputStyle}"></label></div>
                <div><label style="${labelStyle}">${t.email}<br>
                    <input type="email" name="email" maxlength="100" placeholder="${t.email}" style="${inputStyle}"></label></div>
                <div style="grid-column:1/3"><label style="${labelStyle}">${t.website}<br>
                    <input type="url" name="website" maxlength="100" placeholder="${t.website}" style="${inputStyle}"></label></div>
            </div> 
            <div style="margin-top:18px;text-align:right;">
                <button id="buttonAddCompany" type="button" style="${buttonStyle}">${t.zapisz}</button>
                <button id="buttonCancelAddCompany" type="button" style="${buttonStyleNo};margin-left:8px;">${t.anuluj}</button>
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
    
    /** content dla szczegolow firmy i uzytkownikow */
    async getContent_SzczegolyFirmy(firmaData, usersData) {
        const t = this.t;
        const company = firmaData && typeof firmaData === 'object' ? firmaData : {};
        if (!Array.isArray(usersData)) usersData = [];
        const formatValue = (value) => (value === null || value === undefined || value === '' ? '-' : value);
        const detailRows = [
            ['name', formatValue(company.name)],
            ['type', formatValue(company.type)],
            ['active', company.active === 1 || company.active === true ? '✔️' : '❌'],
            ['tax_id', formatValue(company.tax_id)],
            ['regon', formatValue(company.regon)],
            ['krs', formatValue(company.krs)],
            ['address', formatValue(company.address)],
            ['city', formatValue(company.city)],
            ['postal_code', formatValue(company.postal_code)],
            ['country', formatValue(company.country)],
            ['phone', formatValue(company.phone)],
            ['email', formatValue(company.email)],
            ['website', formatValue(company.website)],
            ['created_at', formatValue(company.created_at)],
            ['updated_at', formatValue(company.updated_at)]
        ];
        const wrapperStyle = [
            'background: rgba(243,243,243,0.97)',
            'border-radius: 12px',
            'box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(25,118,210,0.08)',
            'padding: 28px 32px 24px 32px',
            'max-width: 900px',
            'margin: 32px auto',
            'font-family: \'Segoe UI Variable\', \'Segoe UI\', Arial, sans-serif',
            'color: #222',
            'border: 1px solid rgba(180,200,230,0.18)',
            'overflow-x: auto',
            'width: 100%'
        ].join(';');
        const sectionTitleStyle = [
            'font-size: 1.08rem',
            'font-weight: 700',
            'margin-bottom: 14px',
            'color: #1769aa'
        ].join(';');
        const tableStyle = [
            'width: 100%',
            'border-collapse: collapse',
            'margin-bottom: 22px',
            'font-size: 0.98rem'
        ].join(';');
        const thStyle = [
            'text-align: left',
            'padding: 10px 12px',
            'font-weight: 700',
            'background: #f5f7fa',
            'border-bottom: 2px solid #c8d5ea',
            'color: #1b4f7a'
        ].join(';');
        const tdStyle = [
            'padding: 10px 12px',
            'border-bottom: 1px solid #e4ebf3',
            'background: #fff',
            'color: #222'
        ].join(';');
        const companyRowsHtml = detailRows.map(([key, value]) => {
            return `<tr><th style="${thStyle}">${t[key] || key}</th><td style="${tdStyle}">${value}</td></tr>`;
        }).join('');
        const userTableHeader = ['name', 'email', 'role', 'active', 'lang'];
        const userRows = usersData.map(user => {
            const fullName = [user.name, user.last_name].filter(Boolean).join(' ') || '-';
            return `<tr><td style="${tdStyle}">${fullName}</td><td style="${tdStyle}">${formatValue(user.email)}</td><td style="${tdStyle}">${formatValue(user.role)}</td><td style="${tdStyle}">${user.active === 1 || user.active === true ? '✔️' : '❌'}</td><td style="${tdStyle}">${formatValue(user.lang)}</td></tr>`;
        }).join('');
        const usersSection = usersData.length > 0 ? `
            <div style="margin-top: 26px;">
                <div style="${sectionTitleStyle}">${t.users_list || 'Users'}</div>
                <table style="${tableStyle}">
                    <thead><tr>${userTableHeader.map(col => `<th style="${thStyle}">${t['user_' + col] || col}</th>`).join('')}</tr></thead>
                    <tbody>${userRows}</tbody>
                </table>
            </div>` : `
            <div style="margin-top: 26px;font-size:0.98rem;color:#444;">
                ${t.no_users || 'No users found for this company.'}
            </div>`;
        const html = `
            <div style="${wrapperStyle}">
                <input type="hidden" name="company_id" value="${company.id || ''}">
                <div style="${sectionTitleStyle}">${t.company_details || 'Company details'}</div>
                <table style="${tableStyle}">
                    <tbody>${companyRowsHtml}</tbody>
                </table>
                ${usersSection}
            </div>
        `;
        return {
            id: this.idWindow,
            cardId: 'szczegoly-firmy',
            title: `${t.company_details || 'Company details'}${company.name ? ': ' + company.name : ''}`,
            text: html
        };
    }
  //==========================    



     
}

export default CONFIG;