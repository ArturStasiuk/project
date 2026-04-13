
class CONFIG {
    constructor(parent) {
        this.parent = parent;
        this.idWindow = 'win-notepad';
    }
    // konfuguracja elementu meniu w pasku startowym, czyli ikona, nazwa i funkcja po kliknieciu
    async getStartMenuItem() {
        return {
            id: 'sm-notepad',
            icon: '📝',
            label: 'Notatnik',
            disabled: false,
            onClick: async () => {
                await this.parent.func.openWindow();
            }
        };

    }
    // konfiguracja okna czyli id, tytul, ikona i tekst statusu
    async getWindowItem() {
        return {
            id: this.idWindow,
            title: 'Notatnik',
            icon: '📝',
            statusText: 'Nowy dokument',
        };
    }

    // konfiguracja meniu okna 
    async getWindowMenu() {
        return {
            id: this.idWindow,
            menuId: 'menu-notepad',
            label: 'Menu',
            items: [
                { icon: '📂', label: 'Otwórz', onClick: () => { alert('Funkcja otwierania pliku nie jest jeszcze zaimplementowana.'); } },
                { icon: '💾', label: 'Zapisz', onClick: () => { alert('Funkcja zapisu pliku nie jest jeszcze zaimplementowana.'); } },
                { icon: '❌', label: 'Zamknij', onClick: () => { } }
            ]
        };
    }




    // configuracja zawartosci okna czyli id karty, tytul i zawartosc
    async getWindowContent(cardId ,title, text) {
        if (!cardId) cardId = 'card-1';
        if (!title) title = '📄 Dokument';
        if (!text) text = `<div style="width:100%;height:calc(100vh - 120px);min-height:300px;display:flex;flex-direction:column;"><textarea style="flex:1;width:100%;height:100%;resize:none;border:none;outline:none;padding:16px;font-size:18px;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif;font-weight:bold;background:#fff;margin:0;display:block;" placeholder="Wpisz tutaj swoje notatki..."></textarea></div>`;
        return {
            id: this.idWindow,
            cardId: cardId,
            title: title,
            text: text
        };

    }


}
//const conf = new CONFIG();
export default CONFIG;
