import LAUNGE_LOGIN from './laungue_login.js';

class config{
    constructor(parent){
        this.login = parent;// login do logowania
        this.id_window = 'login_window';
    }

    /** @returns {Record<string, string>} */
    _t() {
        return this.login.launge && Object.keys(this.login.launge).length
            ? this.login.launge
            : LAUNGE_LOGIN.English;
    }

    // wyglada okna do logowanie 
   async getLoginWindow(){
      const t = this._t();
      return {
        id: this.id_window,// id okna
        title: t.login_window_title,
        statusText:t.login_window_title,
        size: {
          width: 380,
          height: 500,
        },
        controls: {
          minimize: true,
          maximize: true,
          close: false,
        },


      }
        
    }
    // content okna logowania 
    async getLoginContent(){
       const t = this._t();
       const formHtml = `
      <form id="login_form">
      <div class="login-form">
        <div class="login-form-brand" aria-hidden="true"></div>
        <h2 class="login-form-heading">${t.login_heading}</h2>
        <p class="login-form-lead">${t.login_lead}</p>
        <div class="login-form-field">
          <label for="login_email">${t.login_email_label}</label>
          <input type="email" id="login_email" name="email" autocomplete="username" placeholder="${t.login_email_placeholder}" />
        </div>
        <div class="login-form-field">
          <label for="login_password">${t.login_password_label}</label>
          <input type="password" id="login_password" name="password" autocomplete="current-password" placeholder="${t.login_password_placeholder}" />
        </div>
        <div class="login-form-actions">
          <button type="button" id="button_zaloguj" class="login-btn login-btn--primary">${t.login_button_submit}</button>
          <button type="button" id="button_anuluj" class="login-btn login-btn--secondary">${t.login_button_cancel}</button>
        </div>
      </div>
      </form>`;
       return {
        id: this.id_window,
        cardId: 'login-card',
        title: '',
        text: formHtml,
       };
    }

    // okno modalne do wyswietlania komunikatow
    async getAlert_Please_sign(){
        const t = this._t();
        return {
            title: t.alert_please_sign,
            message: t.alert_please_sign_message,
        };
    }
    // okno modalne do wyswietlania komunikatow o bledzie logowania
    async getAlert_Login_Error(){
        const t = this._t();
        return {
            title: t.alert_login_error,
            message: t.alert_login_error_message,
        };
    }
    // okno modalne do wyswietlenia komunikatu o zalogowaniu
    async getAlert_Logged_In(user_info){
        const t = this._t();
        return {
            title: t.alert_logged_in,
            message: t.alert_logged_in_message + ' ' + user_info,
        };
    }


    
}
export default config;