class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.initialize();
    }
    /** Inicjalizacja modułu CONFIG */
    initialize() {

    }

    // Zwraca konfigurację pozycji w menu startowym dla narzędzia ADMIN_SYSTEM
   async getMenuItem() {
        return {
            id: "sm-admin_system",
            icon: '⚙️',
            label: 'Admin System',
            disabled: false,
            onClick: async () => await this.parent.func.openWindow()
        };
    }




}

export default CONFIG;