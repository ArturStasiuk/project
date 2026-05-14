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
        name: './test.php',
        action: 'test',
        args: [
          'test',
          123,
        ]
      };

     
      const responseData = await this.fetchData(data);

      console.log(responseData);


    }
   
    async fetchData(data){
        if (!data || typeof data !== 'object' || !('name' in data) || !('action' in data) || !('args' in data)) {
            return {
                status: false,
                message: 'invalid data',
            };
        }

        if (data.args !== null && !Array.isArray(data.args)) {
            return {
                status: false,
                message: 'invalid args',
            };
        }

        const url = new URL(data.name, import.meta.url);
        const requestArgs = data.args === null ? [] : data.args;

        url.searchParams.set('action', data.action);
        url.searchParams.set('args', JSON.stringify(requestArgs));

        const response = await fetch(url);

        const responseText = await response.text();

        try {
            return JSON.parse(responseText);
        } catch (error) {
            return {
                status: false,
                message: 'invalid json response',
                response: responseText,
            };
        }
    }


}
const adminSystem = new AdminSystem();
export default adminSystem;
