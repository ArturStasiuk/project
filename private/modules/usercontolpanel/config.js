class CONFIG {
    constructor(parent) {
        this.parent = parent;


    }
    async getStartMenuItem() { 
        return {
            id: 'userControlPanel',
            icon: '🛠️',
            label: 'Zarządzanie użytkownikami',
            disabled: false,
            onClick: async () => {
                //await window._view.create(await this.parent.config.getWindowItem());
            }
        };
    }


}

export default CONFIG;