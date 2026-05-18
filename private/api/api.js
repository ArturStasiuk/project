
class Api{
    constructor(){
        this.init();
        this.urlProcedurePhp = '../src/api.php';

    }

    async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        console.log("ladowanie api");
    }
    /** pobiera wszystkie dane sesji uzytkownika */
    async getSessionData() {
        return await this.responseApi(this.urlProcedurePhp, { tool: 'Auth', method: 'getSessionData', arguments: {} });
    }
    /** pobranie  jezyka dla zalogowanego uzytkownka */
    async getLanguageUser() {
        return await this.responseApi(this.urlProcedurePhp, { tool: 'Auth', method: 'getLanguageUser', arguments: {} });
    }
    /** logowanie uzytkownika */
    async login(data) {
        return await this.responseApi(this.urlProcedurePhp, { tool: 'Auth', method: 'loginUser', arguments: data });
    }
    /** wylogowanie uzytkownika */
    async logout() {
        return await this.responseApi(this.urlProcedurePhp, { tool: 'Auth', method: 'logout', arguments: {} });
    }
    /** ladowanie prywatnych modulow systemu */
    async loadPrivateModules() {
        return await this.responseApi(this.urlProcedurePhp, { tool: 'Modules', method: 'loadPrivateModules', arguments: {} });
    }

    /** pobranie listy administratorów systemu */
    async AdminSystem(tool, method, args) {
        return await this.responseApi(this.urlProcedurePhp, { tool: tool, method: method, args: args });
    }





    async responseApi(url, data) {
       
        console.log('Wysłano->', data);
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const odp = await res.json();
        console.log('Odebrano<-', odp);

        return odp;
      }



}
const api = new Api();
export default api;