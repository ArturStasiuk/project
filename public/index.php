

<!DOCTYPE html>

<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>myAppProject</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/modal.css">

    <!--
        Import map: mapuje krótkie nazwy modułów na ich publiczne URL-e.
        Dzięki temu prywatne narzędzia ładowane przez Blob URL mogą importować
        publiczne moduły używając krótkich nazw, np.:
            import modal from 'modal';
            import api   from 'api';
        zamiast ścieżek względnych (które nie działają w kontekście Blob URL).
    -->
    <script type="importmap">
    {
        "imports": {
            "modal": "./view/modal.js",
            "view":  "./view/app.js",
            "sys":   "./sys/sys.js",
            "api":   "../api/api.js"
        }
    }
    </script>

</head>
<body>
    <div class="desktop-bg"></div>
    <div class="desktop-icons" id="desktopIcons"></div>
    <div class="taskbar" id="taskbar"></div>
    <div class="window-container" id="windowContainer"></div>






<script type="module">
    import api from '../api/api.js';


    import sys from '../public/sys/sys.js';

</script>


</body>
</html>