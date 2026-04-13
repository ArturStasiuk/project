import CONFIG from './config.js';
import FUNCTION from './function.js';

class BROWSER {
    constructor() {
        this.conf = new CONFIG(this);
        this.func = new FUNCTION(this);

        this.init();
    }

    async init() {
        console.log('BROWSER: init() called');
        await this.func.addStartMenuItem({ id: 'sm-browser' });
    }
}

const browser = new BROWSER();
export default browser;
