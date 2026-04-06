//import CONFIG from './config.js';
//import FUNCTION from './function.js';
class USERCONTROLPANEL {
    constructor() {

       // this.config = new CONFIG(this);
       // this.function = new FUNCTION(this);
        this.init();
    }

    async init() {
   //     await this.function.addStartMenuItem();
    }

    async deinit() {
        try {
            await window._view.removeStartMenuItem({ id: 'userControlPanel' });
        } catch (e) { console.warn('Nie można usunąć pozycji menu modułu USERCONTROLPANEL:', e); }

        try {
            await window._view.removeIcon({ id: 'di-usercontolpanel' });
        } catch (e) { console.warn('Nie można usunąć ikony modułu USERCONTROLPANEL:', e); }

        console.log('Moduł USERCONTROLPANEL został zdezaktywowany i wyczyszczony.');
    }

}

const UserControlPanel = new USERCONTROLPANEL();
// Zarejestruj instancję modułu w globalnym rejestrze, aby sys mógł wywołać init()/deinit()
window._moduleRegistry = window._moduleRegistry || {};
window._moduleRegistry['usercontolpanel'] = UserControlPanel;
export default UserControlPanel;