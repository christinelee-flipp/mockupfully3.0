<?php
/**
 * upload.php — Accept image, PDF, SVG, or video uploads and return a served URL.
 *
 * POST /api/upload.php
 * Body: multipart/form-data, field name "image"
 * Response (success): { "success": true,  "url": "uploads/{productType}/{campaignID}/filename.ext" }
 * Response (error):   { "success": false, "error": "reason" }
 *
 * Videos (.mov, .webm) are converted to .mp4 via ffmpeg.
 * Already-.mp4 files are saved directly without conversion.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function fail(string $msg, int $status = 400, array $extra = []): never {
    http_response_code($status);
    echo json_encode(array_merge(['success' => false, 'error' => $msg], $extra));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Method not allowed', 405);
}

if (!isset($_FILES['image'])) {
    fail('No file received — field must be named "image"');
}

$file = $_FILES['image'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    $uploadErrors = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds the server upload limit',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds the form size limit',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder on server',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION  => 'Upload blocked by server extension',
    ];
    fail($uploadErrors[$file['error']] ?? 'Unknown upload error');
}

// Validate actual MIME type from file contents — do not trust $_FILES['type']
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($file['tmp_name']);

// Get file extension as fallback for MIME detection
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// SVG files may come through as text/xml or text/plain — fix MIME by extension
if ($ext === 'svg' && !str_starts_with($mime, 'image/svg')) {
    $mime = 'image/svg+xml';
}

$allowedImages = [
    'image/jpeg'      => 'jpg',
    'image/png'       => 'png',
    'image/gif'       => 'gif',
    'image/webp'      => 'webp',
    'image/svg+xml'   => 'svg',
    'application/pdf' => 'pdf',
];

$allowedVideos = [
    'video/mp4'       => 'mp4',
    'video/webm'      => 'webm',
    'video/quicktime' => 'mov',
];

$videoExtensions = ['mp4', 'webm', 'mov', 'm4v'];

$isImage = isset($allowedImages[$mime]);
$isVideo = strstr($mime, 'video/') !== false || in_array($ext, $videoExtensions);
$alreadyMp4 = ($ext === 'mp4' || $mime === 'video/mp4');

if (!$isImage && !$isVideo) {
    fail('Only JPG, PNG, GIF, WEBP, SVG, PDF, MP4, MOV, and WEBM files are allowed');
}

// Size limits: images/SVG/PDF 5MB, videos 50MB
if ($isImage && $file['size'] > 5 * 1024 * 1024) {
    fail('Image files must be under 5 MB');
}
if ($isVideo && $file['size'] > 50 * 1024 * 1024) {
    fail('Video files must be under 50 MB');
}

// Determine extension for saving
if ($isImage) {
    $ext = $allowedImages[$mime];
} elseif (isset($allowedVideos[$mime])) {
    $ext = $allowedVideos[$mime];
}
// else $ext already set from filename

// Read product/campaign context from POST fields
$productType = strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['productType'] ?? 'general'));
$campaignID  = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['campaignID'] ?? 'unknown');

$uploadDir = __DIR__ . '/../uploads/' . $productType . '/' . $campaignID . '/';
$urlPrefix = 'uploads/' . $productType . '/' . $campaignID . '/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Debug log
$debugLog = sys_get_temp_dir() . '/upload_debug.log';
file_put_contents($debugLog,
    date('Y-m-d H:i:s') . "\n"
    . "MIME: $mime\n"
    . "EXT: $ext\n"
    . "SIZE: " . $file['size'] . "\n"
    . "isVideo: " . ($isVideo ? 'true' : 'false') . "\n"
    . "isImage: " . ($isImage ? 'true' : 'false') . "\n"
    . "---\n",
    FILE_APPEND
);

// ── IMAGE / PDF / SVG UPLOAD ────────────────────────────────────────
if ($isImage) {
    $prefix   = match($ext) {
        'pdf' => 'pdf_',
        'svg' => 'svg_',
        default => 'img_',
    };
    $filename = uniqid($prefix, true) . '.' . $ext;
    $dest     = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        fail('Could not save the uploaded file', 500);
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'url' => $urlPrefix . $filename]);
    exit;
}

// ── VIDEO UPLOAD ────────────────────────────────────────────────────

// If already MP4, save directly without conversion
if ($alreadyMp4) {
    $filename = uniqid('video_', true) . '.mp4';
    $dest     = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        fail('Could not save the uploaded file', 500);
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'url' => $urlPrefix . $filename]);
    exit;
}

// Non-MP4 video — convert with ffmpeg
$tempPath = $uploadDir . uniqid('tmp_', true) . '.' . $ext;
if (!move_uploaded_file($file['tmp_name'], $tempPath)) {
    fail('Could not save the uploaded file', 500);
}

$ffmpeg = '/usr/local/bin/ffmpeg';

/* Check available encoders */
$encoders = shell_exec($ffmpeg . ' -encoders 2>&1');
$hasVP8  = strpos($encoders, 'libvpx ') !== false;
$hasVP9  = strpos($encoders, 'libvpx-vp9') !== false;

$converted = false;
$output    = '';
$outName   = '';
$outPath   = '';
$codec     = '';

/* Try VP8 → .webm first (best Chrome support) */
if ($hasVP8) {
    $outName = uniqid('video_') . '.webm';
    $outPath = $uploadDir . $outName;
    $codec   = 'vp8';

    $cmd = $ffmpeg
        . ' -y'
        . ' -i ' . escapeshellarg($tempPath)
        . ' -c:v libvpx'
        . ' -crf 10'
        . ' -b:v 1M'
        . ' -c:a libvorbis'
        . ' ' . escapeshellarg($outPath)
        . ' 2>&1';

    $output = shell_exec($cmd);

    if (file_exists($outPath) && filesize($outPath) > 0) {
        $converted = true;
    } else {
        if (file_exists($outPath)) unlink($outPath);
    }
}

/* Try VP9 → .webm if VP8 failed or unavailable */
if (!$converted && $hasVP9) {
    $outName = uniqid('video_') . '.webm';
    $outPath = $uploadDir . $outName;
    $codec   = 'vp9';

    $cmd = $ffmpeg
        . ' -y'
        . ' -i ' . escapeshellarg($tempPath)
        . ' -c:v libvpx-vp9'
        . ' -crf 30'
        . ' -b:v 1M'
        . ' -c:a libvorbis'
        . ' ' . escapeshellarg($outPath)
        . ' 2>&1';

    $output = shell_exec($cmd);

    if (file_exists($outPath) && filesize($outPath) > 0) {
        $converted = true;
    } else {
        if (file_exists($outPath)) unlink($outPath);
    }
}

/* Fall back to mpeg4 → .mp4 */
if (!$converted) {
    $outName = uniqid('video_', true) . '.mp4';
    $outPath = $uploadDir . $outName;
    $codec   = 'mpeg4';

    $cmd = $ffmpeg
        . ' -y'
        . ' -i ' . escapeshellarg($tempPath)
        . ' -c:v mpeg4'
        . ' -q:v 5'
        . ' -c:a aac'
        . ' -b:a 128k'
        . ' -movflags +faststart'
        . ' ' . escapeshellarg($outPath)
        . ' 2>&1';

    $output = shell_exec($cmd);

    if (file_exists($outPath) && filesize($outPath) > 0) {
        $converted = true;
    }
}

// Log ffmpeg output for debugging
file_put_contents($debugLog,
    date('Y-m-d H:i:s') . " FFMPEG\n"
    . "CODEC: $codec\n"
    . "CMD: $cmd\n"
    . "OUTPUT: $output\n"
    . "HAS_VP8: " . ($hasVP8 ? 'true' : 'false') . "\n"
    . "HAS_VP9: " . ($hasVP9 ? 'true' : 'false') . "\n"
    . "---\n",
    FILE_APPEND
);

if ($converted) {
    unlink($tempPath);
    echo json_encode([
        'success'   => true,
        'url'       => $urlPrefix . $outName,
        'converted' => true,
        'codec'     => $codec
    ]);
} else {
    /* Conversion failed — return detailed error info */
    if (file_exists($outPath)) unlink($outPath);
    if (file_exists($tempPath)) unlink($tempPath);
    echo json_encode([
        'success'        => false,
        'error'          => 'Video conversion failed',
        'ffmpeg_cmd'     => $cmd,
        'ffmpeg_output'  => $output,
        'input_exists'   => file_exists($tempPath),
        'output_exists'  => file_exists($outPath),
        'php_user'       => get_current_user(),
        'upload_dir'     => $uploadDir,
        'has_vp8'        => $hasVP8,
        'has_vp9'        => $hasVP9
    ]);
}
exit;
