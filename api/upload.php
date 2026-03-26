<?php
/**
 * upload.php — Accept an image upload and return its served URL.
 *
 * POST /api/upload.php
 * Body: multipart/form-data, field name "image"
 * Response (success): { "success": true,  "url": "uploads/YYYY-MM/img_xxx.jpg" }
 * Response (error):   { "success": false, "error": "reason" }
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function fail(string $msg, int $status = 400): never {
    http_response_code($status);
    echo json_encode(['success' => false, 'error' => $msg]);
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

// 10 MB limit
if ($file['size'] > 10 * 1024 * 1024) {
    fail('File must be under 10 MB');
}

// Validate actual MIME type from file contents — do not trust $_FILES['type']
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($file['tmp_name']);

$allowed = [
    'image/jpeg'      => 'jpg',
    'image/png'       => 'png',
    'image/gif'       => 'gif',
    'image/webp'      => 'webp',
    'application/pdf' => 'pdf',
];

if (!isset($allowed[$mime])) {
    fail('Only JPG, PNG, GIF, WEBP, and PDF files are allowed');
}

$ext       = $allowed[$mime];
$folder    = date('Y-m');
$uploadDir = __DIR__ . '/../uploads/' . $folder . '/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$prefix   = $ext === 'pdf' ? 'pdf_' : 'img_';
$filename = uniqid($prefix, true) . '.' . $ext;
$dest     = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    fail('Could not save the uploaded file', 500);
}

http_response_code(200);
echo json_encode(['success' => true, 'url' => 'uploads/' . $folder . '/' . $filename]);
