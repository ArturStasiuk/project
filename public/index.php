

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
     window.view.create('win-notes', { title: 'Notatnik', icon: '📝', statusText: 'Nowy dokument' });
     window.view.refreshStartMenu([
      { id: 'sm-notes',    icon: '📝', label: 'Notatnik',    onClick: () => view.restore('win-notes') },
      { id: 'sm-calc',     icon: '🧮', label: 'Kalkulator',  onClick: () => view.restore('win-calc')  },
      'separator',
      { id: 'sm-settings', icon: '⚙️', label: 'Ustawienia',  onClick: () => alert('Ustawienia') },
      { id: 'sm-off',      icon: '⏻',  label: 'Wyłącz',      disabled: true }
  ]);
</script>
<script type="module">
    import api from '../api/api.js';
    const info = await api.getInfoModules();
    console.log(info);
</script>

</body>
</html>