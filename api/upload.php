<?php
/**
 * upload.php — Accept image or video uploads and return a served URL.
 *
 * POST /api/upload.php
 * Body: multipart/form-data, field name "image"
 * Response (success): { "success": true,  "url": "uploads/YYYY-MM/img_xxx.jpg" }
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

$allowedImages = [
    'image/jpeg'      => 'jpg',
    'image/png'       => 'png',
    'image/gif'       => 'gif',
    'image/webp'      => 'webp',
    'application/pdf' => 'pdf',
];

$allowedVideos = [
    'video/mp4'       => 'mp4',
    'video/webm'      => 'webm',
    'video/quicktime' => 'mov',
];

$isVideo = strstr($mime, 'video/') !== false;
$isImage = isset($allowedImages[$mime]);

if (!$isImage && !$isVideo) {
    fail('Only JPG, PNG, GIF, WEBP, PDF, MP4, MOV, and WEBM files are allowed');
}

// Size limits: images 5MB, videos 50MB
if ($isImage && $file['size'] > 5 * 1024 * 1024) {
    fail('Image files must be under 5 MB');
}
if ($isVideo && $file['size'] > 50 * 1024 * 1024) {
    fail('Video files must be under 50 MB');
}

$ext       = $isImage ? $allowedImages[$mime] : $allowedVideos[$mime];
$folder    = date('Y-m');
$uploadDir = __DIR__ . '/../uploads/' . $folder . '/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// ── IMAGE / PDF UPLOAD ──────────────────────────────────────────────
if ($isImage) {
    $prefix   = $ext === 'pdf' ? 'pdf_' : 'img_';
    $filename = uniqid($prefix, true) . '.' . $ext;
    $dest     = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        fail('Could not save the uploaded file', 500);
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'url' => 'uploads/' . $folder . '/' . $filename]);
    exit;
}

// ── VIDEO UPLOAD ────────────────────────────────────────────────────

// If already MP4, save directly without conversion
if ($mime === 'video/mp4') {
    $filename = uniqid('video_', true) . '.mp4';
    $dest     = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        fail('Could not save the uploaded file', 500);
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'url' => 'uploads/' . $folder . '/' . $filename]);
    exit;
}

// Non-MP4 video — convert with ffmpeg
$tempPath = $uploadDir . uniqid('tmp_', true) . '.' . $ext;
if (!move_uploaded_file($file['tmp_name'], $tempPath)) {
    fail('Could not save the uploaded file', 500);
}

$mp4Name = uniqid('video_', true) . '.mp4';
$mp4Path = $uploadDir . $mp4Name;

$ffmpeg = '/usr/local/bin/ffmpeg';
$cmd = escapeshellcmd($ffmpeg)
    . ' -i ' . escapeshellarg($tempPath)
    . ' -vcodec h264'
    . ' -acodec aac'
    . ' -movflags +faststart'
    . ' ' . escapeshellarg($mp4Path)
    . ' 2>&1';
$output = shell_exec($cmd);

// Clean up temp file
if (file_exists($tempPath)) {
    unlink($tempPath);
}

// Check conversion result
if (file_exists($mp4Path) && filesize($mp4Path) > 0) {
    http_response_code(200);
    echo json_encode(['success' => true, 'url' => 'uploads/' . $folder . '/' . $mp4Name, 'converted' => true]);
} else {
    fail('Video conversion failed', 500, ['ffmpeg_output' => $output]);
}
