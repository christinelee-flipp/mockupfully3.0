<?php
/**
 * get.php — Return a single campaign by ID.
 * Replaces the Make.com `getOne` webhook.
 *
 * POST /api/get.php
 * Body: { "campaignid": "domination-..." }   (matches domination-form.html's lowercase key)
 *    or { "campaignID": "domination-..." }
 * Response: Campaign object
 */

require __DIR__ . '/config.php';

// Accept GET (?id=) for prototype viewers, POST (JSON body) for domination-form.html
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? '';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = get_json_body();
    // Accept both casings — domination-form.html sends lowercase 'campaignid'
    $id = $body['campaignid'] ?? $body['campaignID'] ?? '';
} else {
    error('Method not allowed', 405);
}

if (!$id) {
    error('campaignid is required');
}

if (!validate_campaign_id($id)) {
    error('Invalid campaignID format', 400);
}

$campaign = read_campaign($id);

if ($campaign === null) {
    respond(['error' => 'Campaign not found', 'id' => $id], 404);
}

respond($campaign);
