<?php
/**
 * server-info.php — Diagnostics for the Mockupfully PHP backend.
 * !! DELETE THIS FILE BEFORE GOING LIVE !!
 */

$uploadsDir = __DIR__ . '/../uploads/';
$uploadsExists  = is_dir($uploadsDir);
$uploadsWritable = $uploadsExists && is_writable($uploadsDir);

$extensions = ['json', 'fileinfo', 'gd'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Server Info — Mockupfully</title>
</head>
<body>

<h1>Mockupfully — Server Info</h1>
<p><strong style="color:red">⚠ DELETE THIS FILE BEFORE GOING LIVE</strong></p>
<hr>

<h2>PHP</h2>
<table border="1" cellpadding="6" cellspacing="0">
  <tr><td>PHP Version</td><td><?= htmlspecialchars(PHP_VERSION) ?></td></tr>
  <tr><td>upload_max_filesize</td><td><?= htmlspecialchars(ini_get('upload_max_filesize')) ?></td></tr>
  <tr><td>post_max_size</td><td><?= htmlspecialchars(ini_get('post_max_size')) ?></td></tr>
  <tr><td>max_execution_time</td><td><?= htmlspecialchars(ini_get('max_execution_time')) ?>s</td></tr>
  <tr><td>memory_limit</td><td><?= htmlspecialchars(ini_get('memory_limit')) ?></td></tr>
</table>

<h2>Uploads Folder</h2>
<table border="1" cellpadding="6" cellspacing="0">
  <tr>
    <td>Path</td>
    <td><?= htmlspecialchars(realpath($uploadsDir) ?: $uploadsDir) ?></td>
  </tr>
  <tr>
    <td>Exists</td>
    <td><?= $uploadsExists ? '✓ Yes' : '✗ No' ?></td>
  </tr>
  <tr>
    <td>Writable</td>
    <td><?= $uploadsWritable ? '✓ Yes' : '✗ No — check folder permissions' ?></td>
  </tr>
  <tr>
    <td>Free disk space</td>
    <td>
      <?php
      $free = $uploadsExists ? disk_free_space($uploadsDir) : disk_free_space(__DIR__);
      if ($free !== false) {
          $gb = round($free / (1024 ** 3), 2);
          echo htmlspecialchars($gb . ' GB (' . number_format($free) . ' bytes)');
      } else {
          echo 'Unavailable';
      }
      ?>
    </td>
  </tr>
</table>

<h2>Required Extensions</h2>
<table border="1" cellpadding="6" cellspacing="0">
  <?php foreach ($extensions as $ext): ?>
  <tr>
    <td><?= htmlspecialchars($ext) ?></td>
    <td><?= extension_loaded($ext) ? '✓ Loaded' : '✗ NOT loaded — required for upload.php' ?></td>
  </tr>
  <?php endforeach; ?>
</table>

</body>
</html>
