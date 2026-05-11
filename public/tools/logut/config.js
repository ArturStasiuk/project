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
          close: false,
        },


    }
   }
   // konfiguracja contentu okna wylogowywania
   async configLogoutContent(){
    const title = this.launge.logout_window_title;
    const actionLabel = this.launge.logout_button_submit;
    const cancelLabel = this.launge.logout_button_cancel;
    const message = this.launge.logout_content_message;

    const formHtml = `
      <form id="logout_form">
        <div class="login-form">
          <div class="login-form-brand" aria-hidden="true"></div>
          <h2 class="login-form-heading">${title}</h2>
          <p class="login-form-lead">${message}</p>
          <div class="login-form-actions">
            <button type="button" id="button_wyloguj" class="login-btn login-btn--primary">${actionLabel}</button>
            <button type="button" id="button_anuluj_wylogowanie" class="login-btn login-btn--secondary">${cancelLabel}</button>
          </div>
        </div>
      </form>`;

    return {
      id: 'logout_window',
      cardId: 'logout-card',
      title: '',
      text: formHtml,
    };
   }







}

export default Config;
