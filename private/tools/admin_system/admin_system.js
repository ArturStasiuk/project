import view from '../../../public/view/app.js';
import api from '../../api/api.js';


import Data from './data.js';
import config from './config.js';


class AdminSystem{
    constructor(){
        this.data = new Data();
        this.api = api;
        this.config = config;
        this.view = view;
  
        this.init();
    }
    async init(){
    // dodanie ikony na pasku zadan
      await this.view.addTaskbarItem(await this.config.getTasbarItem());
    // dodanie ikony na pasku menu start
      await this.view.addStartMenuItem(await this.config.getStartMenuIcon());
    // dodanie ikony na pulpicie
    //  await this.view.addIcon(await this.config.getDesktopIcon());
       const data = {
         url: './admin_system.php',
         method: 'getAdminSystem',
         args: {
         // columns:'role',
         // where: 'admin system',
  


           

         }
       };

     
      const responseData = await this.data.fetchData(data);

      console.log(responseData);
    
      await this.api.responseApi({procedureSql: 'get_records_by_value', arguments: {tables: 'users', columns: 'role', value: 'admin system'}});
     
      

    }
   


}
const adminSystem = new AdminSystem();
export default adminSystem;
