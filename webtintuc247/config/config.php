<?php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'web_tintuc');

// Tự động nhận diện BASE_URL theo môi trường chạy (XAMPP hoặc Docker)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
$baseDir = str_replace('\\', '/', dirname($scriptName));
if ($baseDir !== '/') {
    $baseDir = rtrim($baseDir, '/') . '/';
}
define('BASE_URL', $protocol . $host . $baseDir);

define('APPROOT', dirname(dirname(__FILE__)) . '/app');
define('URLROOT', BASE_URL);
define('SITENAME', 'WebTinTuc247');
