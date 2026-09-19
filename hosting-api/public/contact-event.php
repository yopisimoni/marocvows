<?php
require __DIR__ . '/_bootstrap.php';

$allowedActions = ['profile_view','call','whatsapp','email','website','map'];
$providerSlug = clean_text($data['provider_slug'] ?? '', 180);
$action = clean_text($data['action'] ?? '', 30);
$city = clean_text($data['city'] ?? '', 80);
$category = clean_text($data['category'] ?? '', 80);
$pagePath = clean_text($data['page_path'] ?? '', 500);

if ($providerSlug === '' || !in_array($action, $allowedActions, true)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid event']);
    exit;
}

$stmt = $pdo->prepare(
    "INSERT INTO contact_events (provider_slug, action, city, category, page_path)
     VALUES (:provider_slug, :action, NULLIF(:city,''), NULLIF(:category,''), NULLIF(:page_path,''))"
);
$stmt->execute([
    ':provider_slug' => $providerSlug,
    ':action' => $action,
    ':city' => $city,
    ':category' => $category,
    ':page_path' => $pagePath
]);

echo json_encode(['ok' => true]);
