
let config = {
    
    /** postawowa konfiguracja okna */
    _window: {
        visible: true, // czy okno jest widoczne
        onTop: true, // czy okno ma być pokazanenad innymi oknami po kliknieciu w nie
        idWindow: 'configWindow', // id okna , czyli gownego elementu div okna 
        classWindow: 'config-window', // klasa okna , jezeli nie podano to domyslnie jest 'window'
       // Pozycja okna: 'onCenter' (wyśrodkowane) lub {top: liczba, left: liczba}
        position: 'onCenter',
        // Rozmiar okna: {width: liczba, height: liczba} lub 'auto' (dopasowanie do zawartości)
        size: { width: 400, height: 300 },
    },

    /** Funkcje wywoływane w różnych momentach życia okna */
    _function: {
        /** idFunction : potrzebne do identyfikacji elementu z funkcjami okna jezeli chcemy je dynamicznie modyfikować */
        idFunction: idWindow + '_function', // id dla elementu z funkcjami, domyslnie id okna + '_function'
        onCreate : null, // funkcja wywoływana po utworzeniu okna
        onOpen: async (win) => { // funkcja wywoływana po otwarciu okna
            // Twój przykładowy kod asynchroniczny
            await new Promise(r => setTimeout(r, 1000));
            win.style.background = '#e0f7fa';
            console.log('Okno otwarte i tło zmienione po 1s');
        },
        onClose: null, // funkcja wywoływana po zamknięciu okna
        onMinimize: null, // funkcja wywoływana po minimalizacji okna
        onMaximize: null, // funkcja wywoływana po maksymalizacji okna
    },

    /** Konfiguracja paska tytułowego */
    _titleBar: {
        visible: true, // czy pasek tytułowy jest widoczny
        // jezeli czego nie podano to domyslnie jest: fasse i nie wyswietlaj
        idTitleBar: idWindow + '_titleBar', // id dla elementu paska tytułowego, domyślnie id okna + '_titleBar  , potrzebne do identyfikacji elementu paska tytułowego jezeli chcemy go dynamicznie modyfikować
        classTitleBar: idWindow + ' config-title-bar', // klasa dla elementu paska tytułowego, domyślnie 'title-bar'

        name: 'nazwa okna', // tytul okna
        icon: '📁', // ikona okna 
        controls: { minimize: '➖', maximize: '🗖', close: '❌' }, // kontrolki okna: minimalizuj, maksymalizuj, zamknij
         onClose: null, // funkcja wywoływana po kliknięciu przycisku zamknij
         onMinimize: null, // funkcja wywoływana po kliknięciu przycisku minimalizuj
         onMaximize: null, // funkcja wywoływana po kliknięciu przycisku maksymalizuj    
    },
    /** Konfiguracja menu okna */
    _meniu: {
        visible: true, // czy menu jest widoczne
        idMeniu: idWindow + '_menu', // id dla elementu menu, domyślnie id okna + '_menu', potrzebne do identyfikacji elementu menu jezeli chcemy go dynamicznie modyfikować
        classMeniu: idWindow + ' config-menu', // klasa dla elementu menu, domyślnie 'menu'
        items: [ // elementy menu moga byc grupami (z podmenu) lub pojedynczymi pozycjami
            {
                name: 'Plik',
                icon: '📂',
                onClick: async (itemEl, win, e) => { 
                    await new Promise(r => setTimeout(r, 100));
                    console.log('Kliknięto Plik'); 
                },
                submenu: [
                    { name: 'Nowy',icon: '🆕', onClick: async (itemEl, win, e) => { 
                        await new Promise(r => setTimeout(r, 100));
                        console.log('Kliknięto Nowy'); 
                    } },
                    { name: 'Otwórz', icon: '📂', onClick: async (itemEl, win, e) => { 
                        await new Promise(r => setTimeout(r, 100));
                        console.log('Kliknięto Otwórz'); 
                    } },
                    { name: 'Zapisz', icon: '💾', onClick: async (itemEl, win, e) => { 
                        await new Promise(r => setTimeout(r, 100));
                        console.log('Kliknięto Zapisz'); 
                    } },
                ]
            },
            {
                name: 'Edycja',
                icon: '✏️',
                onClick: async (itemEl, win, e) => { 
                    await new Promise(r => setTimeout(r, 100));
                    console.log('Kliknięto Edycja'); 
                },
                submenu: [
                    { name: 'Cofnij', icon: '↩️', onClick: async (itemEl, win, e) => { 
                        await new Promise(r => setTimeout(r, 100));
                        console.log('Kliknięto Cofnij'); 
                    } },
                    { name: 'Ponów', icon: '↪️', onClick: async (itemEl, win, e) => { 
                        await new Promise(r => setTimeout(r, 100));
                        console.log('Kliknięto Ponów'); 
                    } },
                ]
            }
        ]       

    },
    /** Konfiguracja zawartości okna */
    _content: {
        /**
         * Opcje i możliwości pola content:
         *
         * - html: (string | HTMLElement) — dowolny kod HTML, tekst, obraz, tabela, formularz itp. (domyślnie pusty)
         * - visible: (boolean) — czy zawartość jest widoczna
         * - script: (function | string | null) — kod JS do wykonania po załadowaniu zawartości (np. podpinanie eventów)
         * - style: (string | null) — dodatkowy CSS do zastosowania do zawartości
         * - scrollable: (boolean) — czy wymuszać przewijanie, gdy zawartość jest za duża (domyślnie true)
         * - autoResize: (boolean) — czy dynamicznie dopasowywać rozmiar zawartości do okna (domyślnie true)
         * - onContentReady: (function | null) — callback po wyrenderowaniu zawartości (np. do obsługi dynamicznych elementów)
         *
         * Możesz umieszczać dowolne elementy HTML, formularze, tabele, obrazy, linki, skrypty, style itp.
         * Obsługuj interakcje (np. kliknięcia, submit) przez podpinanie eventów w script lub onContentReady.
         *
         * Przykład:
         * content: {
         *   html: '<form>...</form>',
         *   script: (el) => { el.querySelector('form').onsubmit = ... },
         *   style: '.my-form { color: red; }',
         *   scrollable: true,
         *   autoResize: true,
         *   onContentReady: (el) => { ... }
         * }
         *  wazne jezeli ustawiona ktoras z opcji np
         * html: null // uswanie wczesniejszej zawartosci jezeli byla ustawiona
         * script: null // uswanie wczesniejszego skryptu jezeli byl ustawiony
         * style: null // uswanie wczesniejszego stylu jezeli byl ustawiony
         */
        idContent: idWindow + '_content', // id dla elementu zawartości, domyślnie id okna + '_content', potrzebne do identyfikacji elementu zawartości jezeli chcemy go dynamicznie modyfikować
        visible: true, // czy zawartość jest widoczna
        classContent: 'config-content', // klasa dla elementu zawartości, domyślnie 'content'
        html: '<p>To jest zawartość okna</p>', // jeżeli nie podano to domyślnie jest pusty string
        script: null, // dowolny kod JavaScript do wykonania po załadowaniu zawartości content , np. do podpinania eventów itp jezeli
        style: null, // dowolny kod CSS do zastosowania do zawartości content
    }
   




    }

