<?php
/**
 * get.php — Return a single campaign by ID.
 * Replaces the Make.com `getOne` webhook.
 *
 * POST /api/get.php
 * Body: { "campaignid": "domination-..." }   (matches form.html's lowercase key)
 *    or { "campaignID": "domination-..." }
 * Response: Campaign object
 */

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error('Method not allowed', 405);
}

$body = get_json_body();

// Accept both casings — form.html sends lowercase 'campaignid'
$id = $body['campaignid'] ?? $body['campaignID'] ?? '';

if (!$id) {
    error('campaignid is required');
}

if (!validate_campaign_id($id)) {
    error('Invalid campaignID format', 400);
}

$campaign = read_campaign($id);

if ($campaign === null) {
    error('Campaign not found', 404);
}

respond($campaign);
