<?php
/**
 * migrate.php — One-time data migration from Google Sheets export
 *
 * ⚠ DELETE THIS FILE AFTER USE — it provides unauthenticated write access.
 *
 * POST /api/migrate.php
 * Body: JSON array of campaign objects
 * Returns: { imported: N, skipped: N, errors: [...] }
 *
 * Routes each campaign to data/{productType}/{campaignID}.json
 * Supported productTypes: domination, click2go
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error('POST request required', 405);
}

$raw = file_get_contents('php://input');
if (!$raw) {
    error('Empty request body');
}

$campaigns = json_decode($raw, true);
if (!is_array($campaigns)) {
    error('Body must be a JSON array of campaign objects');
}

// Allowed productTypes and their data directories
$PRODUCT_DIRS = [
    'domination' => __DIR__ . '/../data/domination/',
    'click2go'   => __DIR__ . '/../data/click2go/',
];

// Valid campaignID patterns per product type
$ID_PATTERNS = [
    'domination' => '/^domination-[\d]{14}$|^domination-\d{8}-\d{6}$/',
    'click2go'   => '/^click2go-\d{14}$/',
];

$imported = 0;
$skipped  = 0;
$errors   = [];

// Normalise key casing — Sheets may export lowercase keys
$keyMap = [
    'campaignid'            => 'campaignID',
    'campaignname'          => 'campaignName',
    'producttype'           => 'productType',
    'submittedat'           => 'submittedAt',
    'clientlogourl'         => 'clientLogoURL',
    'claimtext'             => 'claimText',
    'templatetype'          => 'templateType',
    'buttontext'            => 'buttonText',
    'globalbkgcolor'        => 'globalBkgColor',
    'globaltextcolor'       => 'globalTextColor',
    'buttonbkgcolor'        => 'buttonBkgColor',
    'buttontextcolor'       => 'buttonTextColor',
    'paginationbkgcolor'    => 'paginationBkgColor',
    'paginationactivecolor' => 'paginationActiveColor',
    'img01url'              => 'Img01URL',
    'img02url'              => 'Img02URL',
    'img03url'              => 'Img03URL',
    'img04url'              => 'Img04URL',
    'img05url'              => 'Img05URL',
    'img06url'              => 'Img06URL',
    'ghostoverurl'          => 'ghostoverURL',
];

foreach ($campaigns as $index => $campaign) {
    if (!is_array($campaign)) {
        $errors[] = "Item $index is not an object — skipped";
        continue;
    }

    // Normalise keys
    $normalised = [];
    foreach ($campaign as $key => $value) {
        $canonical = $keyMap[strtolower($key)] ?? $key;
        $normalised[$canonical] = $value;
    }

    $id          = $normalised['campaignID'] ?? '';
    $productType = strtolower($normalised['productType'] ?? '');
    $name        = $normalised['campaignName'] ?? "(item $index)";

    if (!$id) {
        $errors[] = "\"$name\" has no campaignID — skipped";
        continue;
    }

    if (!isset($PRODUCT_DIRS[$productType])) {
        $errors[] = "\"$id\" has unknown productType \"$productType\" — skipped";
        continue;
    }

    if (!preg_match($ID_PATTERNS[$productType], $id)) {
        $errors[] = "\"$id\" does not match expected ID format for $productType — skipped";
        continue;
    }

    $dir  = $PRODUCT_DIRS[$productType];
    $path = $dir . $id . '.json';

    // Ensure data directory exists
    if (!is_dir($dir)) {
        if (!mkdir($dir, 0755, true)) {
            $errors[] = "\"$id\" — could not create directory $dir";
            continue;
        }
    }

    // Skip if file already exists
    if (file_exists($path)) {
        $skipped++;
        continue;
    }

    $written = file_put_contents(
        $path,
        json_encode($normalised, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );

    if ($written !== false) {
        $imported++;
    } else {
        $errors[] = "\"$id\" could not be written to disk";
    }
}

respond([
    'imported' => $imported,
    'skipped'  => $skipped,
    'errors'   => $errors,
]);
