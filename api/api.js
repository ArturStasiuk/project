/**
 * Klasa API – centralna warstwa komunikacji z backendem PHP.
 *
 * Wszystkie żądania do serwera przechodzą przez tę klasę.
 * Przed każdym żądaniem sprawdzane jest istnienie pliku docelowego (HEAD),
 * a podczas przesyłania wyświetlane jest okno ładowania (modal).
 *
 * Użycie:
 *   import api from '../api/api.js';
 *   const result = await api.send({ method: 'checkLoggedIn' });
 *   const result = await api.send({ modules: 'user', method: 'loginUsers', param: { email, password } });
 */
class API {

    /**
     * Ustawia instancję modalu (wymaganą do wyświetlania loadera i alertów).
     * @param {object} modalInstance – obiekt z metodami alert() i loading()
     */
    setModal(modalInstance) {
        this.modal = modalInstance;
    }

    constructor() {
        this.modal = null;
        this.infoModules = { name: 'API', version: '0.1', author: 'Artur', description: 'API for data base connection' };
        this.response = null;
        /** Ścieżka do głównego entry-pointu PHP (vendor.php bez rozszerzenia). */
        this.vendorPath = '../api/vendor/vendor';
    }

    /**
     * Wysyła dane do głównego routera (vendor.php).
     * @param {object} data – obiekt z kluczami: method, modules (opcjonalnie), param (opcjonalnie)
     * @returns {Promise<any>} Odpowiedź z serwera (sparsowany JSON lub tekst).
     */
    async send(data) {
        this.response = await this.sendRequest(this.vendorPath, data);
        return this.response;
    }

    /**
     * Pobiera uprawnienia zalogowanego użytkownika do podanych tabel.
     * @param {string[]|null} tables – lista nazw tabel lub null (wszystkie)
     * @returns {Promise<any>}
     */
    async getAccessTables(tables = null) {
        return await this.sendRequest(this.vendorPath, { method: 'getAccessTables', param: { tables: tables } });
    }

    // ================================================
    /**
     * Uniwersalna metoda POST do backendu.
     * Przed wysłaniem sprawdza istnienie pliku (HEAD request).
     * Wyświetla loader podczas oczekiwania na odpowiedź.
     * @param {string} fileName – ścieżka do pliku PHP (bez rozszerzenia)
     * @param {object} data     – dane do wysłania jako JSON
     * @returns {Promise<any>} Odpowiedź serwera lub obiekt błędu { status: 'error', error: string }
     */
    async sendRequest(fileName, data) {
        const url = `${fileName}.php`;
        // Sprawdzenie czy plik istnieje przed wysłaniem żądania
        try {
            const fileExists = await fetch(url, { method: 'HEAD' });
            if (!fileExists.ok) {
                return { status: 'error', error: `Nie znaleziono modułu: ${url}` };
            }
        } catch (err) {
            return { status: 'error', error: `Błąd sprawdzania istnienia modułu: ${url}` };
        }
        try {
            console.log("wysyłam dane do:", url, "z danymi:", data);
            await this.modal.loading();
            this.response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            const text = await this.response.text();
            let result;
            try {
                result = JSON.parse(text);
                console.log("Odpowiedź z serwera:", result);
            } catch {
                result = text;
                
            }
            if (result === undefined || result === null || result === '') {
                await this.modal.loading();
                await this.modal.alert(`Błąd: brak odpowiedzi z serwera (${fileName})`);
            }
            await this.modal.loading();
            return result;
        } catch (error) {
            if (error && error.stack) {
                console.error('Stack trace:', error.stack);
            }
            await this.modal.loading();
            await this.modal.alert(`Błąd: ${error.message || error}`);
            this.response = null;
            return { status: 'error', error: error.message || error };
        }
    }

}
const api = new API();
export default api;