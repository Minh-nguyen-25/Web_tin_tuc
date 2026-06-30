<?php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '123456');
define('DB_NAME', 'web_tintuc');

$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
define('BASE_URL', 'http://' . $host . '/webtintuc247/');

define('APPROOT', dirname(dirname(__FILE__)) . '/app');
define('URLROOT', BASE_URL);
define('SITENAME', 'WebTinTuc247');
