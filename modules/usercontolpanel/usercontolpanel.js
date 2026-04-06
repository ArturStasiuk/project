import CONFIG from './config.js';
import FUNCTION from './function.js';
class USERCONTROLPANEL {
    constructor() {

        this.config = new CONFIG(this);
        this.function = new FUNCTION(this);
        this.init();
    }

    async init() {
        await this.function.addStartMenuItem();
    }




}

const UserControlPanel = new USERCONTROLPANEL();
// Zarejestruj instancję modułu w globalnym rejestrze, aby sys mógł wywołać init()/deinit()
window._moduleRegistry = window._moduleRegistry || {};
window._moduleRegistry['userControlPanel'] = UserControlPanel;
export default UserControlPanel;