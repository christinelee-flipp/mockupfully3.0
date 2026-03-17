<?php
/**
 * list.php — Return all campaigns as a JSON array.
 * Replaces the Make.com `getAll` webhook.
 *
 * GET /api/list.php
 * Response: Campaign[]  (sorted newest → oldest by submittedAt)
 */

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error('Method not allowed', 405);
}

if (!is_dir(DATA_DIR)) {
    respond([]);
}

$campaigns = [];

foreach (glob(DATA_DIR . 'domination-*.json') as $file) {
    $json = file_get_contents($file);
    $data = json_decode($json, true);
    if (is_array($data)) {
        $campaigns[] = $data;
    }
}

// Sort newest first
usort($campaigns, fn($a, $b) =>
    strcmp($b['submittedAt'] ?? '', $a['submittedAt'] ?? '')
);

respond($campaigns);
