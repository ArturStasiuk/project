import view from '../../../public/view/app.js';

import config from './config.js';


class AdminSystem{
    constructor(){
        this.config = config;
        this.view = view;
        this.desktopIcons = desktopIcons;
        this.init();
    }
    async init(){
        
      await this.view.addTaskbarItem(await this.config.getTasbarItem());
      await this.view.addStartMenuItem(await this.config.getStartMenuIcon());
      await this.desktopIcons.addIcon(await this.config.getDesktopIcon());



    }
}
const adminSystem = new AdminSystem();
export default adminSystem;