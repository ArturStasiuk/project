import LANGUAGE_LOGUT from './lang.js';


class Config{
       constructor(parent){
        this.parent = parent;
        this.launge = LANGUAGE_LOGUT.English;
       }
    
    /** Po loadLanguageUser() — wywołaj na początku logut.init() (jak login.setLanguage). */
    async syncLanguage() {
        const raw = window.dataSystem.language ?? 'English';
        const supported = Object.keys(LANGUAGE_LOGUT);
        const code = supported.includes(raw) ? raw : 'English';
        this.launge = LANGUAGE_LOGUT[code];
    }
   // konfiguracja ikona na pasku meniu do wylogowywania
   async configItemMenu(){
    return {
        id: 'logout_item_menu',
        icon: this.launge.logout_item_menu_icon,
        label: this.launge.logout_item_menu_title,
        onClick: async () => {
         await this.parent.showLogoutWindow();
        
            //
        }
    }
   } 

   // okno wylogowywania
   async configLogoutWindow(){
    return {
        id: 'logout_window',
        icon: this.launge.logout_window_icon,
        title: this.launge.logout_window_title,
        statusText: this.launge.logout_window_title,
        size: {
          width: 380,
          height: 400,
        },
        controls: {
          minimize: false,
          maximize: false,
          close: true,
        },


    }
   }







}

export default Config;
