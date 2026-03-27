/* ══════════════════════════════════════════════════════════════════════
   js/core/upload.js — File upload handler for Mockupfully 3.0 forms
   Loaded by form HTML pages via <script src="js/core/upload.js">

   Usage:
     UploadHandler.validate(file, 'image');  // throws if too large
     UploadHandler.upload(file, 'domination', 'domination-20260327...')
       .then(function(url) { ... })
       .catch(function(err) { ... });
   ══════════════════════════════════════════════════════════════════════ */

window.UploadHandler = {

  /**
   * Upload a file to api/upload.php.
   * @param {File}   file        — the File object from an <input>
   * @param {string} productType — 'domination', 'click2go', 'shoppernetwork'
   * @param {string} campaignID  — e.g. 'domination-20260327120000'
   * @returns {Promise<string>}  — resolves with the relative URL of the saved file
   */
  upload: function (file, productType, campaignID) {
    return new Promise(function (resolve, reject) {
      var formData = new FormData();
      formData.append('image', file);
      formData.append('productType', productType || 'general');
      formData.append('campaignID', campaignID || 'unknown');

      fetch('api/upload.php', {
        method: 'POST',
        body: formData
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            resolve(data.url);
          } else {
            reject(new Error(data.error || 'Upload failed'));
          }
        })
        .catch(reject);
    });
  },

  /**
   * Validate a file before uploading.
   * @param {File}   file — the File object
   * @param {string} type — 'image', 'video', or 'pdf'
   * @throws {Error} if the file exceeds the size limit
   * @returns {boolean} true if valid
   */
  validate: function (file, type) {
    var maxSize = type === 'video'
      ? 50 * 1024 * 1024   // 50 MB
      : 5  * 1024 * 1024;  // 5 MB
    var label  = type === 'video' ? 'Video' : 'Image';
    var limit  = type === 'video' ? '50MB'  : '5MB';

    if (file.size > maxSize) {
      throw new Error(label + ' too large. Maximum size is ' + limit + '.');
    }
    return true;
  }
};
