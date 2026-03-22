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

 await viewInstance.addWindow();

















</script>
<script>








</script>





</body>
</html>