
class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.nameModule = 'CONFIG';
        this.version = '1.0.0';
        this.author = 'Your Name';
        this.description = 'A simple configuration module for the system.';
    }

    async getStartMenuItem() {
        return {
            id: 'sm-notepad',
            icon: '📝',
            label: 'Notatnik',
            disabled: false,
            onClick: async () => {
                await window._view.create(await this.parent.conf.getWindowItem());
            }
        };

    }
    
    async getWindowItem() {
        return {
            id: 'win-notepad',
            title: 'Notatnik',
            icon: '📝',
            statusText: 'Nowy dokument',
        };
    }


}
//const conf = new CONFIG();
export default CONFIG;