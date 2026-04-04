
class FUN {
    constructor(parent) {
        this.parent = parent;
      // this.view = parent.view;
      //  this.con = parent.con;
        this.init();
    }
    init() {
        console.log('Inicjalizacja funkcji...');
    }

    async showMenuStart() {
        await this.parent.view.refreshStartMenu(await this.parent.con.getMenuStart() );
    
    }

   async showWinLogin() {
       await this.parent.view.create(await this.parent.con.getWinLogin());
       await this.parent.view.addCard(await this.parent.con.getContentWinLogin());
    }

    async showWinLogout() {
        await this.parent.view.create(await this.parent.con.getWinLogout());
        await this.parent.view.addCard(await this.parent.con.getContentWinLogout());
        setTimeout(() => {
            const btn = document.getElementById('cancel-logout');
            if (btn) {
                btn.onclick = null;
                btn.onclick = async () => { await this.parent.view.close({ id: 'win-logout' }); };
            }
        }, 10);
    }

    async showIconsPulpit() {
        await this.parent.view.addIcon(await this.parent.con.getIconsPulpit());
    }

}
export default FUN;