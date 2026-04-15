// clasa do wyswietlania okien systemowych modalnych takich jak alert, confirm, prompt itp. oraz do tworzenia własnych okien modalnych
class MODAL {
    constructor() {
        
    }
  // prosty alert modalny
  async alert(message, title = 'Informacja') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-titlebar">${title}</div>
                    <p>${message}</p>
                    <div class="modal-actions" style="justify-content:center;">
                        <button id="ok-btn">OK</button>
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

  async confirm(message, title = 'Potwierdzenie') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-titlebar">${title}</div>
                    <p>${message}</p>
                    <div class="modal-actions">
                        <button id="yes-btn" class="modal-btn modal-btn--yes">Yes</button>
                        <button id="no-btn" class="modal-btn modal-btn--no">No</button>
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
   async loading(message = 'Ładowanie...', title = 'Proszę czekać') {
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
                <div class="modal-titlebar">${title}</div>
                <p>${message}</p>
                <div class="loader"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }   
    
    /** modal do podania danych przez użytkownika (prompt) */
    async prompt(message, defaultValue = '', title = 'Wprowadź dane') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-titlebar">${title}</div>
                    <p>${message}</p>
                    <input type="text" id="prompt-input" value="${defaultValue}">
                    <div class="modal-actions">
                        <button id="ok-btn" class="modal-btn modal-btn--ok">OK</button>
                        <button id="cancel-btn" class="modal-btn modal-btn--cancel">Cancel</button>
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

