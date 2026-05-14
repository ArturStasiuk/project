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
      const data = {
        name: 'Admin System',
        version: '1.0.0',
        description: 'System zarządzania dla administratorów',
      };

      const responseData = await this.fetchData('./test.php', 'test', data);

      console.log(responseData);


    }
   
    async fetchData(plik, action, args = []){
        const url = new URL(plik, import.meta.url);
        const requestArgs = Array.isArray(args) ? args : [args];

        url.searchParams.set('action', action);
        url.searchParams.set('args', JSON.stringify(requestArgs));

        const response = await fetch(url);

        return response.json();
    }


}
const adminSystem = new AdminSystem();
export default adminSystem;
