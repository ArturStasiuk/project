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
    // dodanie ikony na pasku zadan
      await this.view.addTaskbarItem(await this.config.getTasbarItem());
    // dodanie ikony na pasku menu start
      await this.view.addStartMenuItem(await this.config.getStartMenuIcon());
    // dodanie ikony na pulpicie
      await this.view.addIcon(await this.config.getDesktopIcon());



    }
}
const adminSystem = new AdminSystem();
export default adminSystem;