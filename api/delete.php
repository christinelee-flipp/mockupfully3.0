<?php
/**
 * delete.php — Delete a campaign by ID.
 * Replaces the Make.com `delete` webhook.
 *
 * POST /api/delete.php
 * Body: { "campaignID": "domination-..." }
 * Response: { "ok": true, "campaignID": "..." }
 */

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error('Method not allowed', 405);
}

$body = get_json_body();

// Accept both casings for safety
$id = $body['campaignID'] ?? $body['campaignid'] ?? '';

if (!$id) {
    error('campaignID is required');
}

if (!validate_campaign_id($id)) {
    error('Invalid campaignID format', 400);
}

$path = campaign_path($id);

if (!file_exists($path)) {
    error('Campaign not found', 404);
}

if (!unlink($path)) {
    error('Failed to delete campaign', 500);
}

respond(['ok' => true, 'campaignID' => $id]);
