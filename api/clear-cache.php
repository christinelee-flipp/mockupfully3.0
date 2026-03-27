<?php
/**
 * One-time OPcache reset. Visit this URL once, then delete this file.
 * GET /api/clear-cache.php
 */
header('Content-Type: application/json');

$result = [];

if (function_exists('opcache_reset')) {
    opcache_reset();
    $result['opcache'] = 'cleared';
} else {
    $result['opcache'] = 'not available';
}

if (function_exists('opcache_get_status')) {
    $status = opcache_get_status(false);
    $result['opcache_enabled'] = $status['opcache_enabled'] ?? false;
    $result['cached_scripts'] = $status['opcache_statistics']['num_cached_scripts'] ?? 0;
}

echo json_encode($result, JSON_PRETTY_PRINT);
