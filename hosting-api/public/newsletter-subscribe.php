<?php
require __DIR__ . '/_bootstrap.php';

$email = strtolower(trim((string)($data['email'] ?? '')));
$language = clean_text($data['language'] ?? 'fr', 8);
$source = clean_text($data['source'] ?? 'website', 100);
$consent = filter_var($data['consent'] ?? false, FILTER_VALIDATE_BOOL);

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Valid email required']);
    exit;
}
if (!$consent) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Consent required']);
    exit;
}

$stmt = $pdo->prepare(
    "INSERT INTO newsletter_subscribers (email, language, source, status, consent_at)
     VALUES (:email, :language, :source, 'subscribed', UTC_TIMESTAMP())
     ON DUPLICATE KEY UPDATE
       language = VALUES(language),
       source = VALUES(source),
       status = 'subscribed',
       consent_at = UTC_TIMESTAMP(),
       updated_at = CURRENT_TIMESTAMP"
);
$stmt->execute([
    ':email' => $email,
    ':language' => $language ?: 'fr',
    ':source' => $source ?: 'website'
]);

echo json_encode(['ok' => true]);
