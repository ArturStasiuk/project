class Config{
    constructor(){
        this.init();
    }
    async init(){
      
    }
    // ikona na pasku zadan 
    async getTasbarItem(){
         return {
            id: 'taskbar_admin_system',
            title: 'Administracja systemu',
            icon: '⚙️'	,
            onClick: async () => {
                // wywolanie okna administracji systemu

            }
        };
    }
    // ikona na pasku menu start
    async getStartMenuIcon(){
        return {
            id: 'start_menu_admin_system',
            label: 'Administracja systemu',
            icon: '⚙️'	,
            disabled: false,
        };
    }
    async getDesktopIcon(){
        return {
            id: 'desktop_admin_system',
            label: 'Administracja systemu',
            icon: '⚙️'	,
            disabled: false,
            onClick: async () => {//
            }
        };
    }







}
const config = new Config();
export default config;