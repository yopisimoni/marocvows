<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

$configPath = getenv('MAROCVOWS_CONFIG_PATH') ?: dirname(__DIR__, 3) . '/marocvows-config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server configuration missing']);
    exit;
}
$config = require $configPath;

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $config['allowed_origins'] ?? [], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}
if ($origin && !in_array($origin, $config['allowed_origins'] ?? [], true)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Origin not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    $data = $_POST;
}
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request']);
    exit;
}

try {
    $pdo = new PDO(
        $config['db_dsn'],
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database unavailable']);
    exit;
}

function clean_text(mixed $value, int $max): string {
    $value = trim((string)$value);
    if (mb_strlen($value) > $max) $value = mb_substr($value, 0, $max);
    return $value;
}
