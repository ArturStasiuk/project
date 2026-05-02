import LAUNGE from "./launge.js";
class CONFIG {
    constructor(parent) {
        this.user = parent;
        this.lang = "English"; // domyślny język
        this.lang = LAUNGE[this.lang]; // tłumaczenia
        this.method = this.user.method; // metody i funkcje
        this.data = this.user.data; // dane i logika biznesowa
    }
   // pobranie konfiguracji językowej
    async configLang() {
        // Pobiera język użytkownika przez API i ustawia tłumaczenia
        const odp = await this.data.getLang();
        this.lang = (odp && odp.lang) ? odp.lang : 'English';
        this.lang = LAUNGE[this.lang] || {};
    }

   // konfiguracja okna glownego 
  async configWindow () {
         const odp = await this.data.getCompanyDataById(this.user.idCompany);
         const companyName = odp ? odp.name : 'Unknown Company';
        return {
            id: this.user.name,// unikalne id okna z nazwy instancji USERS
            icon: this.lang.iconWindow, // ikona okna
            title: `${this.lang.nameWindow}${companyName ? ': ' + companyName : ''}`, // tytuł okna z tłumaczeniem i nazwą firmy
            size: { width: 600, height: 500 }, // rozmiar okna

        };

    }
    // konfiguracja na pasku nawigacji     
   async configNavBar () {
        return {
            
            id:"nav-users-" + this.user.name,// unikalne id elementu nawigacji 
            icon: this.lang.iconWindow,
            label: this.lang.nameTaskBar,
            disabled: false, // na początku wyłączony, będzie włączony po załadowaniu okna
            onClick: async () => { this.users = await users(this.user.name, null, null);} // otwarcie pustego okna po kliknięciu        
        };  
    }
    // konfiguracja menu w oknie zarządzaj użytkownikami
    async configMenu() {
        const accessMenu = await this.data.getAccessMenu();
        return {

            id: this.user.name, // unikalne id okna USERS
            menuId: "menu-users-" + this.user.name, // unikalne id menu
            label: this.lang.menuLabelUsers, // etykieta menu z tłumaczeniem
            items: [
                {
                    icon: this.lang.meniuIconUsers1,
                    label: this.lang.menuItemsUsers1,
                    onClick: async () => { await this.user.showActiveUsers(); } // pokazanie aktywnych użytkowników po kliknięciu
                },
                {
                    icon: this.lang.meniuIconUsers2,
                    label: this.lang.menuItemsUsers2,
                    onClick: async () => {await this.method.showInactiveUsers(); } // pokazanie nieaktywnych użytkowników po kliknięciu
                }
            ]
        }

    }

    // tabela uzutkownikow aktywnych i nieaktywnych
   async getConfigTableUsers(users) {
        const t = this.lang || {};
        if (!Array.isArray(users)) users = [];
        const formatValue = (value) => (value === null || value === undefined || value === '' ? '-' : value);
        const tableStyle = [
            'width: 100%',
            'border-collapse: collapse',
            'margin: 18px 0',
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
        const usersSection = users.length > 0 ? `
            <div>
                <table style="${tableStyle}">
                    <thead>
                        <tr>
                            <th style="${thStyle}">${t.user_name || 'Name'}</th>
                            <th style="${thStyle}">${t.user_last_name || 'Last name'}</th>
                            <th style="${thStyle}">${t.user_email || 'Email'}</th>
                            <th style="${thStyle}">${t.user_role || 'Role'}</th>
                            <th style="${thStyle}">${t.user_active || 'Active'}</th>
                            <th style="${thStyle}">${t.user_lang || 'Lang'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => {
                            const fullName = [user.name, user.last_name].filter(Boolean).join(' ') || '-';
                            return `<tr>
                                <td style="${tdStyle}">${formatValue(user.name)}</td>
                                <td style="${tdStyle}">${formatValue(user.last_name)}</td>
                                <td style="${tdStyle}">${formatValue(user.email)}</td>
                                <td style="${tdStyle}">${formatValue(user.role)}</td>
                                <td style="${tdStyle}">${user.active === 1 || user.active === true ? '✔️' : '❌'}</td>
                                <td style="${tdStyle}">${formatValue(user.lang)}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>` : `
            <div style="margin-top: 16px;font-size:0.98rem;color:#444;">
                ${t.no_users || 'No users available.'}
            </div>`;
        const html = `
            <div style="padding: 16px; background: rgba(248,249,250,0.95); border-radius: 12px; border: 1px solid rgba(200,210,220,0.8);">
                <div style="font-size: 1.05rem; font-weight: 700; margin-bottom: 14px; color: #1769aa;">
                    ${t.users_list || 'Users'}
                </div>
                ${usersSection}
            </div>
        `;
        return {
            id: this.user.name,
            cardId: 'table-users',
            title: t.users_list || 'Users',
            text: html
        };
    }

}
export default CONFIG;