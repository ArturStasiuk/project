import view from '../view/app.js';
import api from '../../api/api.js';
import CONFIG from './conf.js';
import FUN from './func.js';
class SYS {
    constructor() {
        this.api = api;
        this.view = view;
        
        this.con = new CONFIG(this);
        this.fun = new FUN(this);
        this.init();

    }

    //================================================
    async init() {
        console.log('Inicjalizacja systemu...');
        await api.send({ method: 'checkLoggedIn' });

       

        await this.fun.showMenuStart();



    }
    
    // logowanie uzytkownika
    async logIn(email, password) {
        await this.fun.closeWinLogin();

        
        await this.init(); // Odświeżenie systemu po zalogowaniu


    }
    // wylogowanie użytkownika
    async logOut() {
       // window.location.href = 'index.php';
        await this.fun.closeWinLogout();
        await this.fun.deinitModules(); // Dezaktywacja modułów (usuwa ikony i skrypty) przed odświeżeniem menu
        //
        await this.api.crud({ function: 'logoutUsers' });
        //  await this.init(); // Odświeżenie systemu i menu po wylogowaniu
        // zaladowanie index.html ponownie, aby wyczyścić wszystkie dane i skrypty związane z zalogowanym użytkownikiem
        window.location.href = 'index.php';
    }



}
const sys = new SYS();
//window.sys = sys; // Umożliwia dostęp do obiektu SYS z konsoli przeglądarki
export default sys;
