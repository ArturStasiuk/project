class FUNCTION {
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * Dodaje pozycję notatnika do menu startowego paska zadań.
     * Wywołuje getStartMenuItem() z konfiguracji, a następnie rejestruje element w pasku.
     */
    async addStartMenuItem() {
        await this.parent.view.addStartMenuItem(await this.parent.conf.getStartMenuItem());
    }

    /**
     * Otwiera okno notatnika: tworzy okno, ustawia menu i dodaje kartę z edytorem tekstu.
     * Jeśli okno już istnieje, WindowManager przywróci je zamiast tworzyć duplikat.
     */
    async openWindow() {
        await this.parent.view.addWindow(await this.parent.conf.getWindowItem());
        await this.parent.view.refreshWindowMenubar(await this.parent.conf.getWindowMenu());
        await this.parent.view.addWindowCard(await this.parent.conf.getWindowContent());
    }
    
    /** sprawdzenie czy istnieje katalog w localStorage */
    async checkDirectoryLocalStorage() {
        const dirExists = localStorage.getItem(this.parent.dirFilesLocalStorage) !== null;
        if (!dirExists) {
          return false;
        }
        return true;
    }
    
    /** pobranie pliku z localStorage listy plikow .txt jezeli istnieja i zwrocenie wyniku */
    async loadLocalStorageFile() { 
        // Pobierz katalog plików z localStorage
        const dirKey = this.parent.dirFilesLocalStorage;
        const filesJson = localStorage.getItem(dirKey);
        if (!filesJson) {
            return [];
        }
        let files;
        try {
            files = JSON.parse(filesJson);
        } catch (e) {
            console.error('Błąd parsowania plików z localStorage:', e);
            return [];
        }
        // Zwróć tylko pliki .txt
        return Array.isArray(files) ? files.filter(f => typeof f === 'string' && f.endsWith('.txt')) : [];
    }

    


}

export default FUNCTION;
