// clasa twozaca obsluge okna , aktualnie jest to tylko konstruktor , ale w przyszlosci beda tu metody do zarzadzania oknem (np. minimalizowanie, maksymalizowanie, zamykanie, itp.)
class window {
    constructor(parent) {
        this.parent = parent;
    }

    /** twozy glowny obiekt okna i zwraca go do puzniejszego uzycia
     * @param {Object} config konfiguracja okna
     * @returns {HTMLElement} element okna
     */
    createWindow(config) {
        let _window = config._window;
        let _function = config._function;
        let _titleBar = config._titleBar;
        let _meniu = config._meniu;
        let _content = config._content;

        let objWindow;
        return objWindow;
    }

    /** tworzy badadz odswieza glowne okno windows
    */
    window(_window) {
        let _window;

        return _window;
    }
    /** function*/
    function(_function) {
        let _function;

        return _function;
    }
    /** titleBar*/
    titleBar(_titleBar) {
        let _titleBar;

        return _titleBar;
    }
    /** meniu*/
    meniu(_meniu) {
        let _meniu;

        return _meniu;
    }
    /** content*/
    content(_content) {
        let _content;

        return _content;
    }


}
export { window };