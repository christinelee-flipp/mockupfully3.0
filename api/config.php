<?php
/**
 * config.php — Shared config and helpers for Mockupfully API
 */

// Data directories by product prefix
const DATA_DIRS = [
    'domination'      => __DIR__ . '/../data/domination/',
    'click2go'        => __DIR__ . '/../data/click2go/',
    'shoppernetwork'  => __DIR__ . '/../data/shoppernetwork/',
];

// ── CORS + JSON headers ────────────────────────────────────────────
function send_headers(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_headers();
    http_response_code(204);
    exit;
}

send_headers();

// ── Response helpers ───────────────────────────────────────────────
function respond(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function error(string $message, int $status = 400): never {
    respond(['error' => $message], $status);
}

// ── Input helpers ──────────────────────────────────────────────────
function get_json_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Validate and sanitise a campaignID.
 * Accepts: domination-YYYYMMDDHHMMSS  or  click2go-YYYYMMDDHHMMSS
 */
function validate_campaign_id(string $id): bool {
    return (bool) preg_match('/^(domination|click2go|shoppernetwork)-\d{14}$/', $id);
}

// ── File I/O ───────────────────────────────────────────────────────
function campaign_path(string $campaignID): string {
    $prefix = explode('-', $campaignID)[0];
    $dir    = DATA_DIRS[$prefix] ?? DATA_DIRS['domination'];
    return $dir . $campaignID . '.json';
}

function read_campaign(string $campaignID): ?array {
    $path = campaign_path($campaignID);
    if (!file_exists($path)) return null;
    $json = file_get_contents($path);
    $data = json_decode($json, true);
    return is_array($data) ? $data : null;
}

function write_campaign(array $data): bool {
    $id = $data['campaignID'] ?? '';
    if (!validate_campaign_id($id)) return false;
    $path = campaign_path($id);
    return file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX) !== false;
}
