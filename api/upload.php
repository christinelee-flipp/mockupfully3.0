<?php
/**
 * upload.php — Accept image, PDF, SVG, or video uploads and return a served URL.
 *
 * POST /api/upload.php
 * Body: multipart/form-data, field name "image"
 * Response (success): { "success": true,  "url": "uploads/{productType}/{campaignID}/filename.ext" }
 * Response (error):   { "success": false, "error": "reason" }
 *
 * Videos: .mp4 and .webm are stored directly without conversion.
 * .mov files are converted to .webm via libvpx (VP8).
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

if ($isVideo) {
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    /* .webm and .mp4 — store directly, no conversion needed */
    if ($ext === 'webm' || $ext === 'mp4') {
        $filename = uniqid('video_') . '.' . $ext;
        $destPath = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destPath)) {
            echo json_encode([
                'success'   => true,
                'url'       => 'uploads/' . $productType . '/' . $campaignID . '/' . $filename,
                'converted' => false,
                'format'    => $ext
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error'   => 'Failed to save video file'
            ]);
        }
        exit;
    }

    /* .mov — convert to .webm via libvpx
       libvpx (VP8) is confirmed available on this server */
    if ($ext === 'mov') {
        $tempPath = $uploadDir . uniqid('tmp_') . '.mov';
        move_uploaded_file($file['tmp_name'], $tempPath);

        $webmName = uniqid('video_') . '.webm';
        $webmPath = $uploadDir . $webmName;

        $ffmpeg = '/usr/local/bin/ffmpeg';
        $cmd = $ffmpeg
            . ' -y'
            . ' -i ' . escapeshellarg($tempPath)
            . ' -c:v libvpx'
            . ' -crf 10'
            . ' -b:v 1M'
            . ' -c:a libvorbis'
            . ' -deadline realtime'
            . ' ' . escapeshellarg($webmPath)
            . ' 2>&1';

        $output = shell_exec($cmd);
        unlink($tempPath);

        if (file_exists($webmPath) && filesize($webmPath) > 0) {
            echo json_encode([
                'success'   => true,
                'url'       => 'uploads/' . $productType . '/' . $campaignID . '/' . $webmName,
                'converted' => true,
                'format'    => 'webm',
                'original'  => 'mov'
            ]);
        } else {
            echo json_encode([
                'success'        => false,
                'error'          => 'MOV conversion failed',
                'ffmpeg_output'  => $output
            ]);
        }
        exit;
    }

    /* Any other video format — reject cleanly */
    echo json_encode([
        'success' => false,
        'error'   => 'Unsupported video format: ' . $ext . '. Please use MP4, WebM, or MOV.'
    ]);
    exit;
}
