<?php
// Front controller for the PHP MVC App

declare(strict_types=1);

session_start();

require __DIR__ . '/config/config.php';

// Very small PSR-4-like autoloader for core, controllers, models
spl_autoload_register(function (string $class) {
    $paths = [
        __DIR__ . '/core/' . $class . '.php',
        __DIR__ . '/controllers/' . $class . '.php',
        __DIR__ . '/models/' . $class . '.php',
    ];
    foreach ($paths as $path) {
        if (is_file($path)) {
            require $path;
            return;
        }
    }
});

// Make BASE_PATH available to views
$basePath = defined('BASE_PATH') ? BASE_PATH : '';

$router = new Router();
$router->dispatch();
?>