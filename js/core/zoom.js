/* ══════════════════════════════════════════════════════════════════════
   js/core/zoom.js — Responsive phone-frame scaling for all prototypes
   Loaded by prototype HTML pages via <script src="js/core/zoom.js">

   Usage:
     applyZoom();                          // defaults: 390×844
     applyZoom({ designW: 375 });          // custom width
     applyZoom({ scrollable: true });      // allow mobile scroll
   ══════════════════════════════════════════════════════════════════════ */

(function () {
  var DEFAULT_W = 390;
  var DEFAULT_H = 844;
  var MOBILE_BREAKPOINT = 768;

  // Store last-used options so resize/orientation reuses them
  var _lastOpts = {};

  window.applyZoom = function (opts) {
    opts = opts || _lastOpts;
    _lastOpts = opts;

    var w = opts.designW || DEFAULT_W;
    var h = opts.designH || DEFAULT_H;
    var scrollable = opts.scrollable || false;

    var el = opts.el
      || document.getElementById('phone')
      || document.getElementById('viewer-container')
      || document.querySelector('.phone');
    if (!el) return;

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var isMobile = vw < MOBILE_BREAKPOINT;

    if (isMobile) {
      var z = vw / w;
      el.style.zoom = z;
      document.body.style.background = 'white';
      document.body.style.minHeight = '100vh';
      document.body.style.alignItems = 'flex-start';
      if (scrollable) {
        document.body.style.overflow = 'visible';
        document.documentElement.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'visible';
      }
    } else {
      var zx = vw / w;
      var zy = vh / h;
      var z = Math.min(zx, zy) * 0.92;
      el.style.zoom = z;
      document.body.style.background = '#e5e5e5';
      document.body.style.minHeight = '100vh';
      document.body.style.alignItems = zy < zx ? 'flex-start' : 'center';
      document.body.style.overflow = 'hidden';
    }
  };

  window.addEventListener('resize', function () {
    window.applyZoom();
  });
  window.addEventListener('orientationchange', function () {
    setTimeout(function () { window.applyZoom(); }, 300);
  });
})();
