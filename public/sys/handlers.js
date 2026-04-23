/**
 * Uniwersalny handler do obsługi kliknięcia w wiersz tabeli.
 * Wywołuje przekazaną funkcję callback z danymi z wiersza (komórki + data-*).
 * @param {string} id_tabeli - id tabeli do obsługi
 * @param {function} callback - funkcja wywoływana z danymi wiersza
 */
function handleTableRowClick(id_tabeli, callback) {
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
            const result = { ...rowData, ...dataAttrs, tableId: id_tabeli };
            if (typeof callback === 'function') callback(result);
        }
    };
    tbody.addEventListener('click', tbody._rowClickHandler);
}
/** usuniecie handlera kliknięcia w wiersz tabeli */
function removeTableRowClickHandler(id_tabeli) {
    const table = document.getElementById(id_tabeli);
    if (!table) return;
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    if (tbody._rowClickHandler) {
        tbody.removeEventListener('click', tbody._rowClickHandler);
        delete tbody._rowClickHandler;
    }
}

/** odczytywanie danych z formularza o podanym id */
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

/** uniwersalna funkcja do nasluchiwania klikniecia przyciskow o podanym id 
 * i zwrucenie ktory przycisk zostal klikniety, callback zwraca id kliknietego przycisku
 'przyjmuje tablce z id przyciskow do nasluchiwania i callback'  --- IGNORE ---
 przykad wywolania :    
 */
 function handleButtonClicks(buttonIds, callback) {
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
                if (typeof callback === 'function') callback(id);
            });
        }
    });
 }
 /** funkcja do usuwania nasluchiwania klikniec przyciskow o podanym id */
 function removeButtonClicks(buttonIds) {
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        }
    });
 }


export default {
    handleTableRowClick,
    removeTableRowClickHandler,
    handleButtonClicks,
    removeButtonClicks,
    getFormData
};
