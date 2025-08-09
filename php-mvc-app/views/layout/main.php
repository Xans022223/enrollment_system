<?php
// Layout template. It includes the specific view in $contentViewPath
$title = isset($title) ? $title . ' | ' . APP_NAME : APP_NAME;
$baseUrl = rtrim(BASE_PATH, '/');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= htmlspecialchars($title) ?></title>
  <link rel="stylesheet" href="<?= $baseUrl ?>/public/css/style.css" />
</head>
<body>
  <header class="site-header">
    <div class="container">
      <h1><?= htmlspecialchars(APP_NAME) ?></h1>
      <nav>
        <a href="index.php?page=dashboard">Dashboard</a>
        <a href="index.php?page=tasks">Tasks</a>
        <?php if (!empty($_SESSION['user'])): ?>
          <span class="user">👤 <?= htmlspecialchars($_SESSION['user']['username']) ?></span>
          <a href="index.php?page=logout">Logout</a>
        <?php else: ?>
          <a href="index.php?page=login">Login</a>
        <?php endif; ?>
      </nav>
    </div>
  </header>

  <main class="container">
    <?php include $contentViewPath; ?>
  </main>

  <script src="<?= $baseUrl ?>/public/js/app.js"></script>
</body>
</html>