class EndPoint {
    constructor() {
        console.log('EndPoint initialized');
        this.loginUrl = '/PROJECT/login.php';



    }




    // uniwersalna funkcja do wysyłania danych do dowolnego endpointa w katalogu data
    async data(plikPHP, data) {
        const adres = this.dataUrl + plikPHP;
        const response = await this.sendRequest(adres, data);
        return response;
    }

























    //================================================
    async sendRequest(fileName, data, options = {}) {
       // await window.systemWindows.loadingWindow();
        const url = `${fileName}.php`;

        try {
            console.log(`wyslano >> ${fileName}:`, data);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                credentials: 'include',
                ...options
            });

            const text = await response.text();

            let result;
            try {
                result = JSON.parse(text);
            } catch {
                result = text;
            }
            await window.systemWindows.loadingWindow();
            console.log(`${fileName}: << odebrano`, result);
            // Sprawdzanie czy odpowiedź ma status success, pomijając wybrane pliki
            const skipStatusCheck = ["getSession", "getUser", "wyloguj"].includes(fileName);

            if (!skipStatusCheck && (!result || result.status !== "success")) {
                let msg = (result && result.message) ? result.message : 'Nieznany błąd';
                let szczegoly = '';
                if (result && result.file) szczegoly += `\nPlik: ${result.file}`;
                if (result && result.line) szczegoly += `\nLinia: ${result.line}`;
                if (result && result.trace) szczegoly += `\nStack trace: ${result.trace}`;
                //   alert(`Błąd: ${msg}\nOdpowiedź: ` + JSON.stringify(result) + szczegoly);
                //    console.error(`API error:`, result);
                if (result && result.file) console.error('Plik:', result.file);
                if (result && result.line) console.error('Linia:', result.line);
                if (result && result.trace) console.error('Stack trace:', result.trace);
            }

            // ZAWSZE pokazuj pełną ścieżkę błędu jeśli status error (niezależnie od skipStatusCheck)
            if (result && result.status === 'error') {
                let szczegoly = '';
                if (result.file) szczegoly += `\nPlik: ${result.file}`;
                if (result.line) szczegoly += `\nLinia: ${result.line}`;
                if (result.trace) szczegoly += `\nStack trace: ${result.trace}`;
                //            alert(`Błąd krytyczny: ${result.error || result.message || 'Nieznany błąd'}${szczegoly}`);
                //          console.error('Błąd krytyczny:', result);
            }
            await window.systemWindows.loadingWindow();
            return result;
        }
        catch (error) {
            // Wyświetl pełne szczegóły błędu w konsoli
            //  console.log(`Error in sendRequest to ${fileName}:`, error);
            try {
                // Spróbuj wypisać cały obiekt błędu jako JSON (jeśli możliwe)
                //      console.log('Error details (JSON):', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            } catch (e) {
                // Jeśli nie można zserializować, wypisz błąd serializacji
                console.log('Nie można zserializować obiektu błędu:', e);
            }
            if (error && error.stack) {
                console.log('Stack trace:', error.stack);
            }
            // alert(`Błąd: ${error.message || error}`);
            await window.systemWindows.loadingWindow();
            return { status: 'error', error: error.message || error };
        }
        finally {
           // await window.systemWindows.loadingWindow();
        }
    }


}
export const endPoint = new EndPoint();
window.endPoint = endPoint;