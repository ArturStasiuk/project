<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>project</title>
</head>

<body>





<script type="module">
import { view } from "./view/js/view.js";

const viewInstance = new view();
await viewInstance.showPanel();
await viewInstance.showTascBar();
await viewInstance.addIconTascBar({
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
});

 await viewInstance.addWindow({ // Unikalny identyfikator okna (przydatny do zamykania, aktualizacji)
    idWinndow: 'window-projekty',

    // Nazwa/tytuł okna wyświetlana w pasku tytułu 
    name: 'Przegląd projektów',

     icon: '📁',

    // Czy dodać ikonę do taskbara (domyślnie false) w trakcie interpletacji 
    addToTaskbar: false,





    // Pozycja okna: 'onCenter' (wyśrodkowane) lub {top: liczba, left: liczba}
    position: 'onCenter',

    // Rozmiar okna: 'auto' lub {width: liczba lub '400px', height: liczba lub '300px'}
   // size: 'auto',

    // Kontrolki okna: minimalizuj, maksymalizuj, zamknij jezeli podano to wyswietlaj jezeli
    // brak nie nalezy wyswietlac paska z kontrolkami  
     controls: { minimize: '➖', maximize: '🗖', close: '❌' },

    // Czy pokazywać menu (domyślnie true)
    menuVisible: true,

    // Menu okna (tablica grup menu)
  menu: [
        {
            title: 'Plik',
            icon:'🕒➕',
            onClick: (el) => { /* ... */ }, 
            items: [
                { label: 'Nowy', icon: '🆕', onClick: (el) => { console.log('kliknieto nowy') } },
                { label: 'Zapisz', icon: '💾', onClick: (el) => { console.log('kliknieto zapisz') } },
                '---', // separator
                { label: 'Zamknij', icon: '✖️', onClick: (el) => { console.log('kliknieto zamknij') } }
            ]
        },
        {
            title: 'Edycja',
            items: [
                { label: 'Kopiuj', icon: '📋', onClick: (el) => { console.log('kliknieto kopiuj') } },
                { label: 'Wklej', icon: '📋', onClick: (el) => { console.log('kliknieto wklej') } }
            ]
        }
    ],
 
    // Zawartość okna (HTML, może być generowany dynamicznie)
    content: `
        <div>
            <h2>Lista projektów</h2>
            <div id="tabela-projekty"></div>
        </div>
    `,

    // Callback po wyrenderowaniu zawartości (np. do podpięcia eventów)
    onContentReady: (winEl) => {
        // winEl to element DOM okna
        // np. document.getElementById('tabela-projekty').innerHTML = ...
    },

    // Callback po zamknięciu okna
    onClose: (winEl) => {
        // Sprzątanie, np. usuwanie timerów, listenerów
    }
});

















</script>
<script>








</script>





</body>
</html>