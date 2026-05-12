import api from '../../api/api.js';

class AdminCompany{

    constructor(){

        this.api = api;
        this.init();
    }
    async init(){
      console.log('AdminCompany');
    }
}
const adminCompany = new AdminCompany();
export default adminCompany;