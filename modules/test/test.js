
class TEST {
    nameModule;

    constructor() {
        this.nameModule = 'TEST';
        this.init();
    }

    async init() {
        console.log(`Inicjalizacja modułu ${this.nameModule}...`);
    }




}
const test = new TEST();
export default test;