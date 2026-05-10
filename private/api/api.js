
class Api{
    constructor(){
        this.init();

    }

    async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        console.log("ladowanie api");
    }
    async getSessionData() {
        return await this.responseApi({ procedurePhp: 'getSessionData', arguments: {} });
    }
   






    async  responseApi(data) {
       
        console.log('Wysłano->', data);
        const res = await fetch('../src/api.php', {
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