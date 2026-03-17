<?php
/**
 * save.php — Create or update a campaign.
 * Replaces both the Make.com `submit` (new) and `edit` (update) webhooks.
 *
 * POST /api/save.php
 * Body: Campaign object (must include campaignID)
 * Response: { "ok": true, "campaignID": "..." }
 */

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error('Method not allowed', 405);
}

$data = get_json_body();

if (empty($data)) {
    error('Request body is required');
}

$id = $data['campaignID'] ?? '';

if (!$id) {
    error('campaignID is required');
}

if (!validate_campaign_id($id)) {
    error('Invalid campaignID format — expected domination-YYYYMMDDHHMMSS', 400);
}

// Ensure required fields are present
if (empty($data['campaignName'])) {
    error('campaignName is required');
}

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

if (!write_campaign($data)) {
    error('Failed to save campaign', 500);
}

respond(['ok' => true, 'campaignID' => $id]);
