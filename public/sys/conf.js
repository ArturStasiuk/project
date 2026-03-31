class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.init();
    }
    init() {
        console.log('Inicjalizacja konfiguracji...');
    }
}
export default CONFIG;