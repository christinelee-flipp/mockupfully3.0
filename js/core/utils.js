/* ══════════════════════════════════════════════════════════════════════
   js/core/utils.js — Shared utility functions for Mockupfully 3.0
   Loaded by all HTML pages via <script src="js/core/utils.js">
   ══════════════════════════════════════════════════════════════════════ */

// ── URL Resolution ──────────────────────────────────────────────────
// Normalises asset URLs from campaign data.
// Passes absolute URLs through unchanged; strips accidental leading slashes
// from relative paths so they resolve correctly from any page depth.
function resolveURL(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) url = url.replace(/^\/+/, '');
  return url;
}

// ── Colour Utilities ────────────────────────────────────────────────
// Returns true if the given hex colour is perceptually dark (luminance < 128).
// Handles 3-digit and 6-digit hex. Returns false for gradients or invalid input.
function isDark(hex) {
  if (!hex || hex.startsWith('linear') || !hex.startsWith('#')) return false;
  var c = hex.replace('#', '');
  var r = parseInt(c.length === 3 ? c[0]+c[0] : c.slice(0,2), 16);
  var g = parseInt(c.length === 3 ? c[1]+c[1] : c.slice(2,4), 16);
  var b = parseInt(c.length === 3 ? c[2]+c[2] : c.slice(4,6), 16);
  return (r*0.299 + g*0.587 + b*0.114) < 128;
}

// Builds a CSS background value from campaign data.
// Supports solid colour and top-to-bottom gradient.
function buildBg(d) {
  if (d.globalBkgType === 'gradient' && d.globalBkgTop && d.globalBkgBottom) {
    return 'linear-gradient(to bottom, ' + d.globalBkgTop + ', ' + d.globalBkgBottom + ')';
  }
  return d.globalBkgColor || '#EBEBF5';
}

// ── Date Formatting ─────────────────────────────────────────────────
// Formats an ISO date string as "25 Mar 2026". Returns '-' for empty/invalid.
function fmtDate(str) {
  if (!str) return '-';
  var d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

// ── HTML Escaping ───────────────────────────────────────────────────
// Escapes &, <, >, " for safe insertion into HTML strings.
function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Localised CTA Labels ───────────────────────────────────────────
var CTA_LABELS = {
  IT: 'Trova lo store',
  ES: 'Encuentra la tienda',
  FR: 'Trouver le magasin',
  DE: 'Store finden',
  PT: 'Encontrar a loja'
};

// ── Country Flags ───────────────────────────────────────────────────
var FLAGS = {
  AT:'\u{1F1E6}\u{1F1F9}', AU:'\u{1F1E6}\u{1F1FA}', BG:'\u{1F1E7}\u{1F1EC}', BR:'\u{1F1E7}\u{1F1F7}',
  CA:'\u{1F1E8}\u{1F1E6}', DE:'\u{1F1E9}\u{1F1EA}', ES:'\u{1F1EA}\u{1F1F8}', FR:'\u{1F1EB}\u{1F1F7}',
  HU:'\u{1F1ED}\u{1F1FA}', IT:'\u{1F1EE}\u{1F1F9}', NL:'\u{1F1F3}\u{1F1F1}', PL:'\u{1F1F5}\u{1F1F1}',
  PT:'\u{1F1F5}\u{1F1F9}', RO:'\u{1F1F7}\u{1F1F4}', SE:'\u{1F1F8}\u{1F1EA}', US:'\u{1F1FA}\u{1F1F8}'
};
