class FUNCTION {
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * Dodaje pozycję notatnika do menu startowego paska zadań.
     * Wywołuje getStartMenuItem() z konfiguracji, a następnie rejestruje element w pasku.
     */
    async addStartMenuItem() {
        await this.parent.view.addStartMenuItem(await this.parent.conf.getStartMenuItem());
    }

    /**
     * Otwiera okno notatnika: tworzy okno, ustawia menu i dodaje kartę z edytorem tekstu.
     * Jeśli okno już istnieje, WindowManager przywróci je zamiast tworzyć duplikat.
     */
    async openWindow() {
        await this.parent.view.addWindow(await this.parent.conf.getWindowItem());
        await this.parent.view.refreshWindowMenubar(await this.parent.conf.getWindowMenu());
        await this.parent.view.addWindowCard(await this.parent.conf.getWindowContent());
    }
    
 



}

export default FUNCTION;
