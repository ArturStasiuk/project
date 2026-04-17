// clasa do wyswietlania okien systemowych modalnych takich jak alert, confirm, prompt itp. oraz do tworzenia własnych okien modalnych
import LAUNGE from './launge.js';
import api from '../../api/api.js';
class MODAL {
    constructor(parent) {
        this.api = null;
        this.lang = 'English';
        this.t = LAUNGE[this.lang] || {};
    }

    async initialize() {
        // Pobiera język użytkownika przez API i ustawia tłumaczenia
        if (!this.api) throw new Error('API instance not set in MODAL');
        const odp = await this.api.send({ method: "getUserLanguage" });
        this.lang = odp.lang || 'English';
        this.t = LAUNGE[this.lang] || {};
    }



    // prosty alert modalny
    async alert(message, title) {
        const t = this.t;
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-titlebar">${title || t.alert_title || 'INFO'}</div>
                    <p>${message}</p>
                    <div class="modal-actions" style="justify-content:center;">
                        <button id="ok-btn">${t.alert_ok || 'OK'}</button>
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
        const t = this.t;
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-titlebar">${title || t.confirm_title || 'Potwierdzenie'}</div>
                    <p>${message}</p>
                    <div class="modal-actions">
                        <button id="yes-btn" class="modal-btn modal-btn--yes">${t.confirm_yes || 'Yes'}</button>
                        <button id="no-btn" class="modal-btn modal-btn--no">${t.confirm_no || 'No'}</button>
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
        const t = this.t;
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
                <div class="modal-titlebar">${title || t.loading_title || 'Proszę czekać'}</div>
                <p>${message || t.loading_message || 'Ładowanie...'}</p>
                <div class="loader"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /** modal do podania danych przez użytkownika (prompt) */
    async prompt(message, defaultValue = '', title) {
        const t = this.t;
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-titlebar">${title || t.prompt_title || 'Wprowadź dane'}</div>
                    <p>${message}</p>
                    <input type="text" id="prompt-input" value="${defaultValue}">
                    <div class="modal-actions">
                        <button id="ok-btn" class="modal-btn modal-btn--ok">${t.prompt_ok || 'OK'}</button>
                        <button id="cancel-btn" class="modal-btn modal-btn--cancel">${t.prompt_cancel || 'Cancel'}</button>
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

import apiInstance from '../../api/api.js';
const modal = new MODAL();
modal.api = apiInstance;
apiInstance.setModal(modal);
export default modal;

