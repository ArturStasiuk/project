class FUNCTION {
    constructor(parent) {
        this.nameFunction = 'FUNCTION';
        this.parent = parent;
    }

    async addStartMenuItem() {
        await window._view.addStartMenuItem(await this.parent.conf.getStartMenuItem());
    }







}
export default FUNCTION;