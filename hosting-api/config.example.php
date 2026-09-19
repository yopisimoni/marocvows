<?php
// Copy this file OUTSIDE public_html and rename it, for example:
// /home/YOUR_CPANEL_USER/marocvows-config.php
return [
    'db_dsn' => 'mysql:host=localhost;dbname=YOUR_DATABASE;charset=utf8mb4',
    'db_user' => 'YOUR_DATABASE_USER',
    'db_pass' => 'YOUR_STRONG_DATABASE_PASSWORD',
    'allowed_origins' => [
        'https://www.marocvows.com',
        'https://marocvows.com'
    ]
];
