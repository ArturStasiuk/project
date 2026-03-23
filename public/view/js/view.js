import { panel } from "../panel/panel.js";
import { AppWindow } from "../panel/window.js";

class view {
    constructor() {
        this.appWindow = new AppWindow(this);
        this.panel = new panel(this);
    }

    async showPanel()              { await this.panel.showPanel(); }
    async hidePanel()              { await this.panel.hidePanel(); }
    async showTascBar()            { await this.panel.showTascBar(); }
    async hideTascBar()            { await this.panel.hideTascBar(); }
    async addIconTascBar(data)     { await this.panel.addIconTascBar(data); }
    async refreshIconTascBar(data) { await this.panel.refreshIconTascBar(data); }
    async removeIconTascBar(id)    { await this.panel.removeIconTascBar(id); }
    async addWindow(data)          { await this.panel.addWindow(data); }
}

export { view };
