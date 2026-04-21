class METHOD {
        constructor(parent) {
            this.parent = parent;
        }
    
    /** czy jest dostemp do modulu */
    async isAccessOpenWindow() {
        const odp = await this.parent.api.getAccessTables('company');
        return odp.access_table;
    }
    /** pobranie danych firm */
    async getCompanyData(data = null) {
        const odp = await this.parent.api.send({ modules: 'modules_company', method:'getAllCompanyData', param: {data} });
        return odp.data;
    }

    async accessMenu_Window_ZarzadzajFirmami() {
        const odp = await this.parent.api.getAccessTables('company');
        return {
            "read": !!odp.read_record,
            "create": !!odp.add_record,
            "update": !!odp.update_record,
            "delete": !!odp.delete_record
        };
    }

    /**
     * Uniwersalna metoda do odczytywania danych z klikniętego wiersza tabeli.
     * Pobiera wartości z komórek oraz wszystkie atrybuty data-* z wiersza.
     * Działa dla dowolnej tabeli z nagłówkami (th) i komórkami (td).
     */
    async zaznaczanieWierszaTabeli(id_tabeli = 'company-table') {
        const table = document.getElementById(id_tabeli);
        if (!table) return;
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // Usuwamy poprzedni handler, jeśli istnieje
        if (tbody._rowClickHandler) tbody.removeEventListener('click', tbody._rowClickHandler);

        // Pobierz nagłówki kolumn
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());

        // Delegacja zdarzenia na tbody
        tbody._rowClickHandler = function(e) {
            let tr = e.target;
            while (tr && tr.tagName !== 'TR') tr = tr.parentElement;
            if (tr && tr.classList && tr.classList.contains('selectable-row')) {
                // Dane z komórek
                const tds = Array.from(tr.querySelectorAll('td'));
                const rowData = {};
                headers.forEach((header, i) => {
                    rowData[header] = tds[i]?.textContent.trim();
                });
                // Dane z data-*
                const dataAttrs = {};
                for (const attr of tr.attributes) {
                    if (attr.name.startsWith('data-')) {
                        const key = attr.name.slice(5);
                        dataAttrs[key] = attr.value;
                    }
                }
                // Połącz dane
                const result = { ...rowData, ...dataAttrs };
                console.log('Dane wiersza:', result);
            }
        };
        tbody.addEventListener('click', tbody._rowClickHandler);
    }

}
export default METHOD;