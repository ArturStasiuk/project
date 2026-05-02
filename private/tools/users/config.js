import LAUNGE from "./launge.js";
class CONFIG {
    constructor(parent) {
        this.user = parent;
        this.lang = "English"; // domyślny język
        this.lang = LAUNGE[this.lang]; // tłumaczenia
        this.method = this.user.method; // metody i funkcje
        this.data = this.user.data; // dane i logika biznesowa
        this.modal = this.user.modal; // okna modalne
    }
   // pobranie konfiguracji językowej
    async configLang() {
        // Pobiera język użytkownika przez API i ustawia tłumaczenia
        const odp = await this.data.getLang();
        this.lang = (odp && odp.lang) ? odp.lang : 'English';
        this.lang = LAUNGE[this.lang] || LAUNGE['English'];
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
                    icon: this.lang.menuIconUsers1,
                    label: this.lang.menuItemsUsers1,
                    disabled: !accessMenu.read, // dostęp do odczytu decyduje o aktywności tej opcji
                    onClick: async () => { await this.user.showActiveUsers(); } // pokazanie aktywnych użytkowników po kliknięciu
                },
                {
                    icon: this.lang.menuIconUsers2,
                    label: this.lang.menuItemsUsers2,
                    disabled: !accessMenu.read, // dostęp do odczytu decyduje o aktywności tej opcji
                    onClick: async () => {await this.user.showInactiveUsers(); } // pokazanie nieaktywnych użytkowników po kliknięciu
                },
                {
                    icon: this.lang.menuIconUsers3,
                    label: this.lang.menuItemsUsers3,
                    disabled: !accessMenu.create, // dostęp do tworzenia decyduje o aktywności tej opcji
                    onClick: async () => { /* tutaj można dodać funkcję do dodawania użytkownika */ } // otwarcie formularza dodawania użytkownika po kliknięciu
                }
            ]
        }

    }
   // funkcja do wyświetlania komunikatu o braku dostępu 
    async modalAlertNoAccess() {
        await this.modal.alert(
            this.lang.access_tools || "Access Tools",
            this.lang.noAccess || "You do not have access."
        );
    }

    /** lista użytkowników jako kafelki
     * @param {Array} users - lista użytkowników do wyświetlenia
     * @returns {Object} - konfiguracja karty z listą użytkowników
     */
    getConfigTableUsers(users) {
        const t = this.lang || {};
        if (!Array.isArray(users)) users = [];
        const formatValue = (value) => (value === null || value === undefined || value === '' ? '-' : value);
        const usersSection = users.length > 0 ? `
            <div style="display:grid;gap:16px;">
                ${users.map(user => {
                    const fullName = [user.name, user.last_name].filter(Boolean).join(' ') || '-';
                    return `
                    <div class="user-card" data-user-card="true" data-id-company="${formatValue(user.id_company || this.user.idCompany)}" data-id-users="${formatValue(user.id || user.idUsers)}" style="padding:18px;border:1px solid rgba(177,190,217,0.9);border-radius:14px;background:#fff;box-shadow:0 4px 16px rgba(15,23,42,0.06);cursor:pointer;transition:transform 0.15s ease,box-shadow 0.15s ease;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(15,23,42,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(15,23,42,0.06)'">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
                            <div>
                                <div style="font-size:1rem;font-weight:700;color:#1b4f7a;">${formatValue(fullName)}</div>
                                <div style="font-size:0.92rem;color:#52607a;margin-top:4px;">${formatValue(user.email)}</div>
                            </div>
                            <div style="font-size:0.88rem;font-weight:700;color:${user.active === 1 || user.active === true ? '#2e7d32' : '#b71c1c'};">
                                ${user.active === 1 || user.active === true ? '✔️ ' + (t.user_active || 'Active') : '❌ ' + (t.user_active || 'Active')}
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px;font-size:0.92rem;color:#344054;">
                            <div><strong>${t.user_role || 'Role'}:</strong> ${formatValue(user.role)}</div>
                            <div><strong>${t.user_lang || 'Lang'}:</strong> ${formatValue(user.lang)}</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>` : `
            <div style="margin-top: 16px;font-size:0.98rem;color:#444;">
                ${t.no_users || 'No users available.'}
            </div>`;
        const html = `${usersSection}`;
        return {
            id: this.user.name,
            cardId: 'user-cards',
            title: t.users_list || 'Users',
            text: html
        };
    }

}
export default CONFIG;