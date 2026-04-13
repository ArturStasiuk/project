class API {

    constructor() {
        this.infoModules = { name: 'API', version: '0.1', author: 'Artur', description: 'API for data base connection' };
        // 
        this.response = null;
        this.vendorPath = '/new/api/vendor/init'; // katalog z modułami do obsługi danych, np. users.php, products.php itp.



    }

    async send(data) {

        this.response = await this.sendRequest(this.vendorPath, data);
        return this.response;
    }


    //================================================
    /**  uniwersalna funkcja POST do wysyłania danych do katalogu z modułami, np. users.php, products.php itp , sprawdza czy plik istnieje przed wysłaniem żądania, jeśli nie istnieje zwraca błąd, jeśli istnieje wysyła dane i zwraca odpowiedź z serwera*/
    async sendRequest(fileName, data) {
        const url = `${fileName}.php`;
        // Sprawdzenie czy plik istnieje przed wysłaniem żądania
        try {
            const fileExists = await fetch(url, { method: 'HEAD' });
            if (!fileExists.ok) {
             //   console.error(`API error: Nie znaleziono modułu (${url})`);
                return { status: 'error', error: `Nie znaleziono modułu: ${url}` };
            }
        } catch (err) {
           // console.error(`API error: Błąd sprawdzania istnienia modułu (${url})`, err);
            return { status: 'error', error: `Błąd sprawdzania istnienia modułu: ${url}` };
        }
        try {
            console.log(`wyslano >> ${fileName}:`, data);
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
            } catch {
                result = text;
            }
            console.log(`${fileName}: << odebrano`, result);
            if (result === undefined || result === null || result === '') {
                console.error(`API error: Brak odpowiedzi z serwera (${fileName})`);
            }
            // await window.systemWindows.loadingWindow();
            return result;
        } catch (error) {
            console.error(`Error in sendRequest to ${fileName}:`, error);
            if (error && error.stack) {
                console.log('Stack trace:', error.stack);
            }
            // await window.systemWindows.loadingWindow();
            this.response = null;
            return { status: 'error', error: error.message || error };
        }
    }

}
const api = new API();
export default api;