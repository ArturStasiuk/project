<?php
session_start();

require_once __DIR__ . '/../src/modules/newAdmin.php';
$bootstrap = bootstrap_first_system_admin();
if ($bootstrap['action'] === 'error') {
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8"><title>Błąd</title></head><body><p>'
        . htmlspecialchars($bootstrap['message'] ?? 'Błąd', ENT_QUOTES, 'UTF-8')
        . '</p></body></html>';
    exit;
}

?>
<!DOCTYPE html>

<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>myAppProject</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/modal.css">
  


</head>
<body>
<?php if ($bootstrap['action'] === 'first_user_created' && !empty($bootstrap['message'])): ?>
<script>alert(<?= json_encode($bootstrap['message'], JSON_UNESCAPED_UNICODE) ?>);</script>
<?php endif; ?>
    <div class="desktop-bg"></div>
    <div class="desktop-icons" id="desktopIcons"></div>
    <div class="taskbar" id="taskbar"></div>
    <div class="window-container" id="windowContainer"></div>


<script>
const dataSystem = {
    language: null,
    launge: null,
    privateModules: [],
}
window.dataSystem = dataSystem;
</script>


<script type="module">
    import system from './system/system.js';
    // inicjalizacja systemu
    await system.init();
</script>


</body>
</html>