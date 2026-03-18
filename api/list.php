<?php
/**
 * list.php — Return all campaigns as a JSON array.
 *
 * GET /api/list.php
 * Response: Campaign[]  (sorted newest → oldest by submittedAt)
 */

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

$data_dir = DATA_DIRS['domination'];

if (!is_dir($data_dir)) {
    error_log('[list.php] Data folder not found: ' . $data_dir);
    error('Data folder not found. Expected: ' . $data_dir, 500);
}

$pattern   = $data_dir . 'domination-*.json';
$files     = glob($pattern) ?: [];   // glob() returns false (not []) when no matches on some systems
$campaigns = [];
$skipped   = [];

foreach ($files as $file) {
    $json = file_get_contents($file);
    if ($json === false) {
        $skipped[] = basename($file) . ' (unreadable)';
        error_log('[list.php] Could not read file: ' . $file);
        continue;
    }
    $data = json_decode($json, true);
    if (!is_array($data)) {
        $skipped[] = basename($file) . ' (invalid JSON)';
        error_log('[list.php] Invalid JSON in file: ' . $file);
        continue;
    }
    $campaigns[] = $data;
}

// Sort newest first
usort($campaigns, fn($a, $b) =>
    strcmp($b['submittedAt'] ?? '', $a['submittedAt'] ?? '')
);

if (!empty($skipped)) {
    error('Some campaign files could not be loaded: ' . implode(', ', $skipped), 500);
}

respond($campaigns);
