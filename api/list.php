<?php
/**
 * list.php — Return all campaigns as a JSON array.
 *
 * GET /api/list.php
 * Response: Campaign[]  (sorted newest → oldest by submittedAt)
 */

require __DIR__ . '/config.php';

// Prevent browser/proxy caching of campaign list
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

$campaigns = [];
$skipped   = [];

// Read from all product data directories
foreach (DATA_DIRS as $prefix => $data_dir) {
    if (!is_dir($data_dir)) continue;
    $pattern = $data_dir . $prefix . '-*.json';
    $files   = glob($pattern) ?: [];

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
} // end foreach DATA_DIRS

// Sort newest first
usort($campaigns, fn($a, $b) =>
    strcmp($b['submittedAt'] ?? '', $a['submittedAt'] ?? '')
);

if (!empty($skipped)) {
    error('Some campaign files could not be loaded: ' . implode(', ', $skipped), 500);
}

respond($campaigns);
