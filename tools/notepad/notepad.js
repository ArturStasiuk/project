import CONFIG from './config.js';
import FUNCTION from './function.js';

class NOTEPAD {


    constructor() {
     this.conf = new CONFIG(this); 
       this.func = new FUNCTION(this);

        this.init(); 
    }
    // tu nalezy dodcac np ikone i nazwe do menu startowego, a po kliknieciu w ikone ma sie otwierac okno z zawartoscia tego modulu
    async init() {
        console.log(`NOTEPAD: init() called`);
        // Dodanie pozycji do menu startowego
      await this.func.addStartMenuItem();
     
    }
    
    
    


}
const notepad = new NOTEPAD();
export default notepad;