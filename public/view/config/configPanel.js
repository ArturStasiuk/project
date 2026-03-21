
class configPanel{
    constructor(parent) {
        if (!document.getElementById('panel-css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './view/css/panel.css';
            link.id = 'panel-css';
            document.head.appendChild(link);
        }
    }

    async configPanel() {
        const panel = document.createElement('div');
        panel.className = 'panel';
        panel.id = 'panel';
        const p = document.createElement('p');
        p.textContent = 'Panel konfiguracji';
        panel.appendChild(p);
        return panel;
    }
        


}

export { configPanel };