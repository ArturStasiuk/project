

<!DOCTYPE html>

<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Moja Aplikacja - Windows 11</title>
    <link rel="stylesheet" href="css/style.css">


</head>
<body>
    <div class="desktop-bg"></div>
    <div class="desktop-icons" id="desktopIcons"></div>
    <div class="taskbar" id="taskbar"></div>
    <div class="window-container" id="windowContainer"></div>

<script type="module">
    import view from './view/app.js';
    window.view = view;

</script>
<script type="module">
    import sys from '../public/sys/sys.js';

</script>

</body>
</html>