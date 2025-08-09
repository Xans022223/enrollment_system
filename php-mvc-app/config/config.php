<?php
// Application configuration settings

// Database connection settings
// Adjust these values to match your local MySQL setup
const DB_HOST = '127.0.0.1';
const DB_PORT = 3306;
const DB_NAME = 'php_mvc_app';
const DB_USER = 'root';
const DB_PASS = '';

// Application settings
const APP_NAME = 'PHP MVC App';

// Base URL of the application (used for assets and links)
// If you run under a subfolder, set e.g. '/php-mvc-app'
const BASE_PATH = '/php-mvc-app';

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);

?>