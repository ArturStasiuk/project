class FUNCTION {
    constructor(parent) {
        this.parent = parent;
    }

    async addStartMenuItem() {
        await window._view.addStartMenuItem(await this.parent.conf.getStartMenuItem());
    }

    async openWindow() {
        await window._view.create(await this.parent.conf.getWindowItem());
        await window._view.addMenu(await this.parent.conf.getWindowMenu());
        await window._view.addCard(await this.parent.conf.getWindowContent());
    }
}

export default FUNCTION;
