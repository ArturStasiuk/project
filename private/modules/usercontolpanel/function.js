
class FUNCTION {
    constructor(parent) {
        this.parent = parent;
    }


    async addStartMenuItem() {
        await window._view.addStartMenuItem(await this.parent.config.getStartMenuItem());
    } 
}
export default FUNCTION;