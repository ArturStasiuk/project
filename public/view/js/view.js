import { Panel } from "../panel/panel.js";

class Wiew { 
    constructor() {
        
        this.panel = new Panel(this);
        

     
 }

    
    /** wyswietlenie panelu */
    async showPanel() {
        await this.panel.showPanel();
    }
    /** ukrycie panelu */
    async hidePanel() {
        await this.panel.hidePanel();
    }
    /// wyswietlenie tascBar
    async showTascBar() {
        await this.panel.showTascBar();
    }
    /// ukrycie tascBar
    async hideTascBar() {
        await this.panel.hideTascBar();
    }
    // dodanie ikony/meniu do tascBar
    async addIconTascBar(data) {
       const data = {
            idIcon: `icon_21`, // id ikony w tasbar 
            title: 'Projekty', // teks jezeli podano po wyswietlany po prawej srony ikony
            icon: '🗃️', // wyglad ikony jezeli podano jezeli nie wyswietlany jest tekst 
            onClick: async (el) => { /* wywolanie jakiejs funkcji po kliknieciu w tekst badz icokne  */ },

           // jezeli podano items jest wyswietlane jako rozwijane meniu 
            items: [
                {   
                    
                    label: 'Przeglądaj',
                    icon: '🔍',
                    onClick: async (el) => {
                       console.log('Kliknięto Przeglądaj');
                }
                },
                {
                    label: 'Dodaj', icon: '➕', onClick: async (el) => {
                        console.log('Kliknięto Dodaj');
                }
                },
                {
                    label: 'Edytuj', icon: '✏️', onClick: async (el) => {
                        console.log('Kliknięto Edytuj');
                    }
                },
                {
                    label: 'Usuń', icon: '🗑️', onClick: async (el) => {
                        console.log('Kliknięto Usuń');
                    }
                }
            ]
        };
        await this.panel.addIconTascBar(data);
        const data2 = {
            idIcon: `icon_22`, // id ikony w tasbar 
            title: 'Zadania', // teks jezeli podano po wyswietlany po prawej srony ikony
            icon: '📋', // wyglad ikony jezeli podano jezeli nie wyswietlany jest tekst 
            onClick: async (el) => { /* wywolanie jakiejs funkcji po kliknieciu w tekst badz icokne  */ },
        };
        await this.panel.addIconTascBar(data2);
    }
    // refreszowanie ikony/meniu w tascBar na podstawie configuracji 
    async refreshIconTascBar(data) {
        await this.panel.refreshIconTascBar(data);
    }
    // usuwanie ikony/meniu z tascBar na podstawie idIcon
    async removeIconTascBar(idIcon) {
        await this.panel.removeIconTascBar(idIcon);
    }


    

    

}
export { Wiew };