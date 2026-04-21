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

    /** zaznaczanie wiersza tabeli o id company_table  */
    async zaznaczanieWierszaTabeli() {
        const table = document.getElementById('company-table');
        if (!table) return;
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // Usuwamy poprzedni handler, jeśli istnieje
        if (tbody._rowClickHandler) tbody.removeEventListener('click', tbody._rowClickHandler);

        // Delegacja zdarzenia na tbody (działa zawsze)
        tbody._rowClickHandler = function(e) {
            let tr = e.target;
            while (tr && tr.tagName !== 'TR') tr = tr.parentElement;
            if (tr && tr.classList && tr.classList.contains('selectable-row')) {
                // Pobierz dane z wiersza
                const id = tr.dataset.id;
                const tds = tr.querySelectorAll('td');
                const data = {
                    id,
                    name: tds[0]?.textContent.trim(),
                    type: tds[1]?.textContent.trim(),
                    active: tds[2]?.textContent.trim(),
                    country: tds[3]?.textContent.trim(),
                    city: tds[4]?.textContent.trim(),
                    address: tds[5]?.textContent.trim()
                };
                console.log('Dane firmy:', data);
            }
        };
        tbody.addEventListener('click', tbody._rowClickHandler);
    }

}
export default METHOD;