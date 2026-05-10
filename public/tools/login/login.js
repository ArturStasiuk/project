
import view from '../../view/app.js';
import api from '../../../private/api/api.js';
class Login{
    constructor(){
        this.widok = view;
        this.api = api;
        
        this.init();
    }

    async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        console.log("ladowanie loginu");


    }








}
const login = new Login();
export default login;