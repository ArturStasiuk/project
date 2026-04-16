import LAUNGE from './launge.js';
// import api usunięty – język przekazywany z SYS

// clasa do wyswietlania okien systemowych modalnych takich jak alert, confirm, prompt itp. oraz do tworzenia własnych okien modalnych
 class MODAL { 
constructor() {
        this.lang = 'English';
        this.translations = LAUNGE;
    }

    setLang(lang) {
        this.lang = lang || 'English';
    }

    /** Zwraca obiekt tłumaczeń dla aktualnego języka. */
    _t() {
        return this.translations[this.lang] || this.translations['English'];
    }

  // prosty alert modalny
      async alert(message, title) {
            const t = this._t();
            const alertTitle = title ?? t.title_info;
            return new Promise((resolve) => {
                const modal = document.createElement('div');
                modal.classList.add('modal');
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-titlebar">${alertTitle}</div>
                        <p>${message}</p>
                        <div class="modal-actions" style="justify-content:center;">
                            <button id="ok-btn">${t.btn_ok}</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                modal.querySelector('#ok-btn').addEventListener('click', () => {
                    document.body.removeChild(modal);
                    resolve();
                });
            });
        }
   
    // prosty confirm modalny z dwoma przyciskami Yes i No, zwraca true dla Yes i false dla No

  async confirm(message, title) {
        const t = this._t();
        const confirmTitle = title ?? t.title_confirm;
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-titlebar">${confirmTitle}</div>
                    <p>${message}</p>
                    <div class="modal-actions">
                        <button id="yes-btn" class="modal-btn modal-btn--yes">${t.btn_yes}</button>
                        <button id="no-btn" class="modal-btn modal-btn--no">${t.btn_no}</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('#yes-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(true);
            });
            modal.querySelector('#no-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(false);
            });
        });
    }

   // okno oczekiwania z animacja ladowania pierwsze wywolanie okna pokazuje je a kolejne wywolanie zamyka, mozna tez przekazac tekst do wyswietlenia
   async loading(message, title) {
       const t = this._t();
       const loadingMessage = message ?? t.msg_loading;
       const loadingTitle   = title   ?? t.title_loading;
       let modal = document.querySelector('.modal--loading');
        if (modal) {
            // jeśli okno już istnieje, usuń je
            document.body.removeChild(modal);
            return;
        }
        // jeśli okno nie istnieje, stwórz je
        modal = document.createElement('div');
        modal.classList.add('modal', 'modal--loading');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-titlebar">${loadingTitle}</div>
                <p>${loadingMessage}</p>
                <div class="loader"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }   
    
    /** modal do podania danych przez użytkownika (prompt) */
    async prompt(message, defaultValue = '', title) {
        const t = this._t();
        const promptTitle = title ?? t.title_prompt;
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-titlebar">${promptTitle}</div>
                    <p>${message}</p>
                    <input type="text" id="prompt-input" value="${defaultValue}">
                    <div class="modal-actions">
                        <button id="ok-btn" class="modal-btn modal-btn--ok">${t.btn_ok}</button>
                        <button id="cancel-btn" class="modal-btn modal-btn--cancel">${t.btn_cancel}</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('#ok-btn').addEventListener('click', () => {
                const input = modal.querySelector('#prompt-input').value;
                document.body.removeChild(modal);
                resolve(input);
            });
            modal.querySelector('#cancel-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(null);
            });
        });
    }








    



}

const modal = new MODAL();
export default modal;

