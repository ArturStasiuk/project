class API { 

    constructor() {
        this.infoModules = { name: 'API', version: '0.1', author: 'Artur', description: 'API for data base connection' };
        // 
        this.response = null;
        this.dataRouter = '../api/conect/router'; // poprawiona ścieżka względem public/

        

    }
    // uniwersalna funkcja POST do wysyłania danych do dowolnego endpointa w katalogu data
    async crud( data) {
      
        this.response = await this.sendRequest(this.dataRouter, data);
        return this.response;
    }
    

    //================================================
    async sendRequest(fileName, data) {
        const url = `${fileName}.php`;
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
