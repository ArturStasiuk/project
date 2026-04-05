import view from '../../public/view/app.js';
//import api from '../../api/api.js';
class TEST {
    nameModule;

    constructor() {
        this.view = view;
       // this.api = api;
        this.nameModule = 'TEST';
        this.init();
    }
    // tu nalezy dodac np ikone i nazwe do menu startowego, a po kliknieciu w ikone ma sie otwierac okno z zawartoscia tego modulu
    async init() {
        console.log(`Inicjalizacja modułu ${this.nameModule}...`);
        // Dodanie pozycji do menu startowego

        await this.view.addStartMenuItem({
            
            id: 'sm-off',
            icon: '⏻',
            label: 'Wyłącz',
            disabled: false
        });
     
    }
    
    




}
const test = new TEST();
export default test;