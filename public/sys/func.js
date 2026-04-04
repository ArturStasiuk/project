
class FUN {
    constructor(parent) {
      //  this.parent = parent;
        this.view = parent.view;
        this.con = parent.con;
        this.init();
    }
    init() {
        console.log('Inicjalizacja funkcji...');
    }
    async showMenuStart() {
     
         await this.view.refreshStartMenu(await this.con.getMenuStart() );
    
    }
   async showWinLogin() {
       await this.view.create(await this.con.getWinLogin());
       await this.view.addCard(await this.con.getContentWinLogin());
    }

    async showWinLogout() {
        await this.view.create(await this.con.getWinLogout());
        await this.view.addCard(await this.con.getContentWinLogout());
        setTimeout(() => {
            const btn = document.getElementById('cancel-logout');
            if (btn) {
                btn.onclick = null;
                btn.onclick = async () => { await this.view.close({ id: 'win-logout' }); };
            }
        }, 10);
    }

    

}
export default FUN;