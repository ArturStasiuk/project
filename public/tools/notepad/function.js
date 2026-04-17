class FUNCTION {
    constructor(parent) {
        this.parent = parent;
        this.config = parent.config;
    }

    /**
     * Dodaje pozycję notatnika do menu startowego paska zadań.
     * Wywołuje getStartMenuItem() z konfiguracji, a następnie rejestruje element w pasku.
     */
    async addStartMenuItem() {
        await this.parent.view.addStartMenuItem(await this.config.getStartMenuItem());
    }

    /**
     * Otwiera okno notatnika: tworzy okno, ustawia menu i dodaje kartę z edytorem tekstu.
     * Jeśli okno już istnieje, WindowManager przywróci je zamiast tworzyć duplikat.
     */
    async openWindow() {
        await this.parent.view.addWindow(await this.config.getWindowItem());
        await this.parent.view.refreshWindowMenubar(await this.config.getWindowMenu());
        await this.parent.view.addWindowCard(await this.config.getWindowContent());
    }
    
 



}

export default FUNCTION;
