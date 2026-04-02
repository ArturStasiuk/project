
class FUN {
    constructor(parent) {
        this.parent = parent;
        this.view = parent.view;
        this.con = parent.con;
        this.init();
    }
    init() {
        console.log('Inicjalizacja funkcji...');
    }
    async showMenuStart() {
        await this.view.refreshStartMenu({ items: await this.con.getMenuStart() });
    }
   async showWinLogin() {
       await this.view.create(await this.con.getWinLogin());
       await this.view.addCard(await this.con.getContentWinLogin());
    }

    async showWinLogout() {
        await this.view.create(await this.con.getWinLogut());
        await this.view.addCard(await this.con.getContentWinLogout());
    }
    

}
export default FUN;