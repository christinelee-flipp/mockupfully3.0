/* ══════════════════════════════════════════════════════════════════════
   Click2Go Pass 2 — Shared interactive flow (Steps 2–5)
   Included by: click2go-banner.html, click2go-carousel-vertical.html,
                click2go-carousel-square.html
   ══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Language mapping ──────────────────────────────────────────────
  const LANG_MAP = {
    IT: 'it', ES: 'es', FR: 'fr', DE: 'de', PT: 'pt'
  };

  const STRINGS = {
    en: {
      allowOnce:      'Allow Once',
      allowWhileUsing:'Allow While Using App',
      dontAllow:      "Don\u2019t Allow",
      titleSuffix:    'Would Like to Use Your Current Location',
      nearbyStores:   'Nearby stores',
      directions:     'Directions',
      moreStores:     'More stores'
    },
    it: {
      allowOnce:      'Consenti una volta',
      allowWhileUsing:'Consenti quando usi l\u2019app',
      dontAllow:      'Non consentire',
      titleSuffix:    'desidera utilizzare la tua posizione attuale',
      nearbyStores:   'Negozi vicini',
      directions:     'Indicazioni',
      moreStores:     'Altri negozi'
    },
    es: {
      allowOnce:      'Permitir una vez',
      allowWhileUsing:'Permitir mientras se usa la app',
      dontAllow:      'No permitir',
      titleSuffix:    'quiere usar tu ubicaci\u00f3n actual',
      nearbyStores:   'Tiendas cercanas',
      directions:     'C\u00f3mo llegar',
      moreStores:     'M\u00e1s tiendas'
    },
    fr: {
      allowOnce:      'Autoriser une fois',
      allowWhileUsing:'Autoriser lorsque l\u2019app est active',
      dontAllow:      'Ne pas autoriser',
      titleSuffix:    'souhaite utiliser votre position actuelle',
      nearbyStores:   'Magasins \u00e0 proximit\u00e9',
      directions:     'Itin\u00e9raire',
      moreStores:     'Plus de magasins'
    },
    de: {
      allowOnce:      'Einmal erlauben',
      allowWhileUsing:'Beim Verwenden der App erlauben',
      dontAllow:      'Nicht erlauben',
      titleSuffix:    'm\u00f6chte deinen aktuellen Standort verwenden',
      nearbyStores:   'Gesch\u00e4fte in der N\u00e4he',
      directions:     'Wegbeschreibung',
      moreStores:     'Mehr Gesch\u00e4fte'
    },
    pt: {
      allowOnce:      'Permitir uma vez',
      allowWhileUsing:'Permitir ao usar o app',
      dontAllow:      'N\u00e3o permitir',
      titleSuffix:    'pretende utilizar a sua localiza\u00e7\u00e3o atual',
      nearbyStores:   'Lojas pr\u00f3ximas',
      directions:     'Dire\u00e7\u00f5es',
      moreStores:     'Mais lojas'
    }
  };

  // Placeholder addresses per country
  const PLACEHOLDER_ADDRESSES = {
    IT: 'Via Roma 1 - Milano',
    ES: 'Calle Mayor 1 - Madrid',
    AU: '1 George St - Sydney',
    CA: '1 King St W - Toronto',
    AT: 'Stephansplatz 1 - Wien',
    FR: '1 Rue de Rivoli - Paris',
    DE: 'Unter den Linden 1 - Berlin',
    SE: 'Drottninggatan 1 - Stockholm',
    NL: 'Damrak 1 - Amsterdam',
    PL: 'ul. Marsza\u0142kowska 1 - Warszawa',
    PT: 'Rua Augusta 1 - Lisboa',
    RO: 'Calea Victoriei 1 - Bucure\u0219ti',
    BG: 'bul. Vitosha 1 - Sofia',
    HU: 'V\u00e1ci utca 1 - Budapest',
    US: '1 Broadway - New York'
  };

  // Location chip data per country
  const LOCATION_CHIP = {
    IT: { zip: '20123', city: 'Milano' },
    ES: { zip: '28001', city: 'Madrid' },
    FR: { zip: '75001', city: 'Paris' },
    DE: { zip: '10117', city: 'Berlin' },
    AT: { zip: '1010',  city: 'Wien' },
    PT: { zip: '1100',  city: 'Lisboa' },
    AU: { zip: '2000',  city: 'Sydney' },
    CA: { zip: 'M5H',   city: 'Toronto' },
    SE: { zip: '11120', city: 'Stockholm' },
    NL: { zip: '1012',  city: 'Amsterdam' },
    PL: { zip: '00-001',city: 'Warszawa' },
    RO: { zip: '010011',city: 'Bucure\u0219ti' },
    BG: { zip: '1000',  city: 'Sofia' },
    HU: { zip: '1052',  city: 'Budapest' },
    US: { zip: '10007', city: 'New York' },
    BR: { zip: '01310', city: 'S\u00e3o Paulo' }
  };

  // Pin positions for map pins (percentage offsets)
  var PIN_POSITIONS = [
    { top: '46%', left: '52%' },
    { top: '34%', left: '20%' },
    { top: '58%', left: '80%' }
  ];

  // Map backgrounds available per country code
  const MAP_COUNTRIES = ['IT','ES','FR','AU','PT','BR','AT','DE'];

  function getMapUrl(location) {
    const cc = (location || '').toUpperCase();
    if (MAP_COUNTRIES.includes(cc)) {
      return 'assets/click2go-assets/map/' + cc + '.png';
    }
    return 'assets/click2go-assets/map/IT.png'; // fallback
  }

  function getLang(location) {
    return LANG_MAP[(location || '').toUpperCase()] || 'en';
  }

  // ── Inject CSS (once) ─────────────────────────────────────────────
  let cssInjected = false;
  function injectCSS() {
    if (cssInjected) return;
    cssInjected = true;

    // Load Nunito font
    if (!document.querySelector('link[href*="Nunito"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;800&display=swap';
      document.head.appendChild(link);
    }

    const style = document.createElement('style');
    style.textContent = `
      .pass2-overlay {
        position: absolute;
        inset: 0;
        z-index: 150;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pass2FadeIn 0.25s ease-out;
      }
      @keyframes pass2FadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      /* Blurred map background */
      .pass2-map-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        filter: blur(6px) brightness(0.85);
        transform: scale(1.05);
      }

      /* Dark scrim on top of blurred map */
      .pass2-scrim {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.35);
      }

      /* iOS-style modal card */
      .pass2-modal {
        position: relative;
        width: 270px;
        background: rgba(255,255,255,0.95);
        border-radius: 14px;
        overflow: hidden;
        text-align: center;
        box-shadow: 0 8px 40px rgba(0,0,0,0.25);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }

      /* Modal header area */
      .pass2-modal-header {
        padding: 20px 16px 16px;
      }

      /* Location icon */
      .pass2-loc-icon {
        width: 56px;
        height: 56px;
        margin: 0 auto 12px;
        background: linear-gradient(135deg, #4A90D9, #357ABD);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .pass2-modal-title {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 17px;
        font-weight: 600;
        color: #000;
        line-height: 1.3;
        letter-spacing: -0.2px;
        margin-bottom: 8px;
      }

      .pass2-modal-body {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 13px;
        font-weight: 400;
        color: #000;
        line-height: 1.4;
        letter-spacing: -0.1px;
      }

      /* Button stack */
      .pass2-btn-stack {
        border-top: 0.5px solid rgba(60,60,67,0.29);
      }
      .pass2-btn {
        display: block;
        width: 100%;
        padding: 11px 16px;
        border: none;
        background: transparent;
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 17px;
        color: #007AFF;
        cursor: pointer;
        text-align: center;
        line-height: 1.3;
        letter-spacing: -0.2px;
        -webkit-tap-highlight-color: transparent;
      }
      .pass2-btn:active {
        background: rgba(0,0,0,0.06);
      }
      .pass2-btn + .pass2-btn {
        border-top: 0.5px solid rgba(60,60,67,0.29);
      }
      .pass2-btn--bold {
        font-weight: 600;
      }
      .pass2-btn--regular {
        font-weight: 400;
      }

      /* ── STEP 3: Map + Drawer ─────────────────────────────── */
      .pass2-step3 {
        position: absolute;
        inset: 0;
        z-index: 150;
        display: flex;
        flex-direction: column;
        background: var(--global-bkg, #7b9ab9);
        animation: pass2FadeIn 0.25s ease-out;
      }

      /* Header: status bar + logo bar + chip */
      .step3-header {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /* Top app bar with logo + close */
      .step3-topbar {
        width: 430px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 16px;
        flex-shrink: 0;
      }
      .step3-topbar-icon {
        width: 37px;
        height: 37px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        background: transparent;
        -webkit-tap-highlight-color: transparent;
      }
      .step3-topbar-logo {
        width: 220px;
        height: 56px;
        object-fit: contain;
        display: block;
      }

      /* Location chip */
      .step3-chip-row {
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 16px;
        flex-shrink: 0;
      }
      .step3-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border: 1px solid var(--chip-color, #666);
        border-radius: 28px;
      }
      .step3-chip-text {
        font-family: 'Montserrat', sans-serif;
        font-size: 13px;
        font-weight: 400;
        color: var(--chip-color, #666);
        white-space: nowrap;
      }
      .step3-chip svg { flex-shrink: 0; }

      /* Map + drawer wrapper */
      .step3-map-drawer {
        flex: 1;
        position: relative;
        overflow: hidden;
        min-height: 0;
      }

      /* Full-bleed map */
      .step3-map-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* Retailer pin on map */
      .step3-pin {
        position: absolute;
        width: 40px;
        height: 40px;
        z-index: 5;
      }
      .step3-pin-bg {
        position: absolute;
        inset: 0;
        width: 40px;
        height: 40px;
      }
      .step3-pin-img {
        position: absolute;
        top: 7.5%;
        left: 7.5%;
        width: 85%;
        height: 85%;
        border-radius: 50px;
        object-fit: cover;
      }

      /* Bottom drawer */
      .step3-drawer {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 412px;
        background: #fff;
        border-radius: 24px 24px 0 0;
        box-shadow: 0 4px 4px rgba(0,0,0,0.25);
        display: flex;
        flex-direction: column;
        z-index: 10;
      }
      .step3-drawer-slider {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        flex-shrink: 0;
      }
      .step3-drawer-handle {
        width: 80px;
        height: 5px;
        border-radius: 4px;
        background: rgba(0,0,0,0.32);
      }
      .step3-drawer-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-bottom: 8px;
      }
      .step3-drawer-heading {
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #474643;
        letter-spacing: 0.1px;
        line-height: 24px;
        padding: 0 12px;
      }

      /* Retailer list in drawer */
      .step3-retailers {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /* Single retailer row */
      .step3-retailer-row {
        width: 100%;
        padding: 0 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .step3-retailer-inner {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
      }
      .step3-retailer-left {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
        padding-right: 8px;
      }
      .step3-retailer-logo {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        position: relative;
      }
      .step3-retailer-logo-bg {
        position: absolute;
        inset: 0;
        width: 40px;
        height: 40px;
      }
      .step3-retailer-logo-img {
        position: absolute;
        top: 7.5%;
        left: 7.5%;
        width: 85%;
        height: 85%;
        border-radius: 50px;
        object-fit: cover;
      }
      .step3-retailer-info {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }
      .step3-retailer-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .step3-retailer-name {
        font-family: 'Nunito', sans-serif;
        font-size: 14px;
        font-weight: 800;
        color: #474643;
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .step3-retailer-address {
        font-family: 'Nunito', sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #474643;
        white-space: nowrap;
      }
      .step3-retailer-distance {
        font-family: 'Nunito', sans-serif;
        font-size: 10px;
        font-weight: 800;
        color: #474643;
        line-height: 17px;
        flex-shrink: 0;
        white-space: nowrap;
      }
      .step3-retailer-directions {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-tap-highlight-color: transparent;
      }
      .step3-retailer-divider {
        width: 402px;
        height: 2px;
        border: 1px solid #474643;
        opacity: 0.2;
      }

      /* More stores link */
      .step3-more-stores {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 12px;
      }
      .step3-more-stores-btn {
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: #000;
        line-height: 24px;
        background: transparent;
        border: none;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      .step3-more-stores-btn:active {
        opacity: 0.6;
      }

      /* Footer with CTA */
      .step3-footer {
        height: 105px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .step3-cta {
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 1;
        border-radius: 12px;
        padding: 12px 24px;
        border: 1px solid transparent;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
      }

      /* ── STEP 4: Google Maps screenshot ──────────────────── */
      .pass2-step4 {
        position: absolute;
        inset: 0;
        z-index: 160;
        display: flex;
        flex-direction: column;
        background: #fff;
        animation: pass2FadeIn 0.25s ease-out;
      }
      .step4-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .step4-back {
        position: absolute;
        top: 56px;
        left: 16px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255,255,255,0.92);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 10;
        -webkit-tap-highlight-color: transparent;
      }
      .step4-back:active {
        background: rgba(235,235,235,0.95);
      }

      /* ── STEP 5: Retailer list ───────────────────────────── */
      .pass2-step5 {
        position: absolute;
        inset: 0;
        z-index: 160;
        display: flex;
        flex-direction: column;
        background: #fff;
        animation: pass2FadeIn 0.25s ease-out;
      }
      .step5-header {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 56px 16px 12px;
        gap: 12px;
      }
      .step5-back {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #F5F5F7;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent;
      }
      .step5-back:active {
        background: #E8E8ED;
      }
      .step5-heading {
        font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
        font-size: 20px;
        font-weight: 700;
        color: #000;
      }
      .step5-list {
        flex: 1;
        overflow-y: auto;
        padding: 0 20px 24px;
        -webkit-overflow-scrolling: touch;
      }
      .step5-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 0;
        border-bottom: 0.5px solid #E5E5EA;
      }
      .step5-row:last-child {
        border-bottom: none;
      }
      .step5-row-logo {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: #F5F5F7;
        flex-shrink: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .step5-row-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
      .step5-row-info {
        flex: 1;
        min-width: 0;
      }
      .step5-row-name {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 15px;
        font-weight: 600;
        color: #000;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .step5-row-address {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 13px;
        font-weight: 400;
        color: #8E8E93;
        line-height: 1.3;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .step5-row-distance {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #8E8E93;
        flex-shrink: 0;
        text-align: right;
      }
    `;
    document.head.appendChild(style);
  }

  // ── Build & show the Step 2 modal ─────────────────────────────────
  window.initPass2 = function (campaignData) {
    if (!campaignData) return;
    injectCSS();

    const lang = getLang(campaignData.location);
    const s = STRINGS[lang];
    const clientName = campaignData.campaignName || 'This app';

    // Container — covers the .phone frame
    const overlay = document.createElement('div');
    overlay.className = 'pass2-overlay';
    overlay.id = 'pass2-step2';

    // Blurred map background
    const mapBg = document.createElement('div');
    mapBg.className = 'pass2-map-bg';
    mapBg.style.backgroundImage = 'url(' + getMapUrl(campaignData.location) + ')';
    overlay.appendChild(mapBg);

    // Dark scrim
    const scrim = document.createElement('div');
    scrim.className = 'pass2-scrim';
    overlay.appendChild(scrim);

    // Modal card
    const modal = document.createElement('div');
    modal.className = 'pass2-modal';

    // Header
    const header = document.createElement('div');
    header.className = 'pass2-modal-header';

    // Location icon (white pin on blue rounded square)
    const iconWrap = document.createElement('div');
    iconWrap.className = 'pass2-loc-icon';
    iconWrap.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white"/><circle cx="12" cy="9" r="2.5" fill="#4A90D9"/></svg>';
    header.appendChild(iconWrap);

    // Title
    const title = document.createElement('div');
    title.className = 'pass2-modal-title';
    title.textContent = '\u201C' + clientName + '\u201D ' + s.titleSuffix;
    header.appendChild(title);

    modal.appendChild(header);

    // Buttons
    const btnStack = document.createElement('div');
    btnStack.className = 'pass2-btn-stack';

    function makeBtn(label, bold) {
      const btn = document.createElement('button');
      btn.className = 'pass2-btn ' + (bold ? 'pass2-btn--bold' : 'pass2-btn--regular');
      btn.textContent = label;
      btn.addEventListener('click', function () {
        overlay.remove();
        showStep3(campaignData);
      });
      return btn;
    }

    btnStack.appendChild(makeBtn(s.allowWhileUsing, true));
    btnStack.appendChild(makeBtn(s.allowOnce, false));
    btnStack.appendChild(makeBtn(s.dontAllow, false));
    modal.appendChild(btnStack);
    overlay.appendChild(modal);

    // Insert into .phone element
    const phone = document.getElementById('phone');
    phone.appendChild(overlay);
  };

  // ── Helper: build a retailer pin (Map/Pin with logo image inside) ──
  function buildRetailerPin(logoURL, clientLogoURL) {
    var wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.width = '40px';
    wrap.style.height = '40px';
    var pinSrc = clientLogoURL || logoURL;
    if (pinSrc) {
      // Client logo provided — show logo only, no pin.png underneath
      var img = document.createElement('img');
      img.src = pinSrc;
      img.alt = '';
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;border-radius:50%;';
      img.onerror = function () {
        // Fallback to pin.png if logo fails to load
        img.style.borderRadius = '0';
        img.src = 'assets/click2go-assets/map/pin.png';
      };
      wrap.appendChild(img);
    } else {
      var fb = document.createElement('img');
      fb.src = 'assets/click2go-assets/map/pin.png';
      fb.alt = '';
      fb.className = 'step3-pin-bg';
      wrap.appendChild(fb);
    }
    return wrap;
  }

  // ── Step 3: Map + DTS_Logo + Location chip + Bottom drawer ────────
  function showStep3(campaignData) {
    injectCSS();

    var lang = getLang(campaignData.location);
    var s = STRINGS[lang];
    var cc = (campaignData.location || '').toUpperCase();
    var fullAddress = PLACEHOLDER_ADDRESSES[cc] || PLACEHOLDER_ADDRESSES['IT'];
    var addressParts = fullAddress.split(' - ');
    var chipData = LOCATION_CHIP[cc] || LOCATION_CHIP['IT'];

    // Collect stores
    var stores = [];
    for (var i = 1; i <= 5; i++) {
      var pad = ('0' + i).slice(-2);
      var name = campaignData['Store' + pad + 'Name'];
      var logo = campaignData['Store' + pad + 'LogoURL'];
      if (name || logo) {
        stores.push({ name: name || '', logoURL: logo || '' });
      }
    }

    // Determine background — match Step 1 (supports gradient)
    var bkg;
    if (campaignData.globalBkgType === 'gradient' && campaignData.globalBkgTop && campaignData.globalBkgBottom) {
      bkg = 'linear-gradient(to bottom, ' + campaignData.globalBkgTop + ', ' + campaignData.globalBkgBottom + ')';
    } else {
      bkg = campaignData.globalBkgColor || '#EBEBF5';
    }
    var topHex = campaignData.globalBkgType === 'gradient' ? (campaignData.globalBkgTop || '#000') : (campaignData.globalBkgColor || '#fff');

    var screen = document.createElement('div');
    screen.className = 'pass2-step3';
    screen.id = 'pass2-step3';
    screen.style.setProperty('--global-bkg', topHex);

    // Determine chip/icon color based on background brightness
    var chipColor = '#666';
    var iconStroke = '#000';
    var _c = topHex.replace('#', '');
    if (_c.length >= 6) {
      var _r = parseInt(_c.slice(0,2),16), _g = parseInt(_c.slice(2,4),16), _b = parseInt(_c.slice(4,6),16);
      if ((_r*0.299 + _g*0.587 + _b*0.114) < 128) { chipColor = 'rgba(255,255,255,0.7)'; iconStroke = '#fff'; }
    }
    screen.style.setProperty('--chip-color', chipColor);

    // ── Header ──
    var header = document.createElement('div');
    header.className = 'step3-header';
    header.style.background = bkg;
    header.style.flexShrink = '0';

    // Status bar (clock + icons)
    var statusBar = document.createElement('div');
    statusBar.style.cssText = 'width:430px;height:54px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:12px 16px 0;';
    statusBar.innerHTML = '<span style="font-family:\'SF Pro Text\',Montserrat,sans-serif;font-weight:600;font-size:16px;color:' + iconStroke + '">10:10</span>'
      + '<div style="display:flex;align-items:center;gap:2px">'
      + '<div style="display:flex;align-items:flex-end;gap:1.5px;height:12px;margin-right:2px"><span style="border-radius:1px;width:3px;height:4px;background:' + iconStroke + ';display:block"></span><span style="border-radius:1px;width:3px;height:6px;background:' + iconStroke + ';display:block"></span><span style="border-radius:1px;width:3px;height:9px;background:' + iconStroke + ';display:block"></span><span style="border-radius:1px;width:3px;height:12px;background:' + iconStroke + ';display:block"></span></div>'
      + '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" style="margin-right:2px"><path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="' + iconStroke + '"/><path d="M4.1 7.1C5.1 6.1 6.5 5.5 8 5.5s2.9.6 3.9 1.6" stroke="' + iconStroke + '" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M1.3 4.3C3 2.6 5.4 1.5 8 1.5s5 1.1 6.7 2.8" stroke="' + iconStroke + '" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>'
      + '<div style="width:28px;height:14px;border:1.5px solid ' + iconStroke + ';border-radius:3px;position:relative"><div style="position:absolute;top:1px;left:1px;bottom:1px;width:70%;background:' + iconStroke + ';border-radius:1px"></div></div>'
      + '</div>';
    header.appendChild(statusBar);

    // Top app bar: [spacer]  [DTS_Logo]  [close X]
    var topbar = document.createElement('div');
    topbar.className = 'step3-topbar';

    // Leading icon (empty spacer to balance layout)
    var leadSpacer = document.createElement('div');
    leadSpacer.style.width = '37px';
    leadSpacer.style.height = '37px';
    topbar.appendChild(leadSpacer);

    // DTS_Logo
    if (campaignData.clientLogoURL) {
      var logo = document.createElement('img');
      logo.className = 'step3-topbar-logo';
      logo.src = campaignData.clientLogoURL;
      logo.alt = '';
      logo.onerror = function () { logo.style.display = 'none'; };
      topbar.appendChild(logo);
    } else {
      var logoSpacer = document.createElement('div');
      logoSpacer.style.width = '220px';
      topbar.appendChild(logoSpacer);
    }

    // Trailing icon: close (X) button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'step3-topbar-icon';
    closeBtn.innerHTML = '<svg width="37" height="37" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="18" stroke="' + iconStroke + '" stroke-width="1.5"/><path d="M13 13l12 12M25 13L13 25" stroke="' + iconStroke + '" stroke-width="1.8" stroke-linecap="round"/></svg>';
    closeBtn.addEventListener('click', function () { screen.remove(); });
    topbar.appendChild(closeBtn);

    header.appendChild(topbar);

    // Location chip
    var chipRow = document.createElement('div');
    chipRow.className = 'step3-chip-row';
    var chip = document.createElement('div');
    chip.className = 'step3-chip';

    // Leading location icon
    chip.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75c0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75c0-2.9-2.35-5.25-5.25-5.25z" stroke="' + chipColor + '" stroke-width="1.2"/><circle cx="9" cy="6.75" r="1.5" stroke="' + chipColor + '" stroke-width="1"/></svg>';

    var chipText = document.createElement('span');
    chipText.className = 'step3-chip-text';
    chipText.textContent = chipData.zip + ' ' + chipData.city + ' [' + cc + ']';
    chip.appendChild(chipText);

    // Trailing close icon
    var chipClose = document.createElement('span');
    chipClose.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 6L6 12M6 6l6 6" stroke="' + chipColor + '" stroke-width="1.2" stroke-linecap="round"/></svg>';
    chip.appendChild(chipClose);

    chipRow.appendChild(chip);
    header.appendChild(chipRow);
    screen.appendChild(header);

    // ── Map + Drawer wrapper ──
    var mapDrawer = document.createElement('div');
    mapDrawer.className = 'step3-map-drawer';

    // Map image
    var mapImg = document.createElement('img');
    mapImg.className = 'step3-map-img';
    mapImg.src = getMapUrl(campaignData.location);
    mapImg.alt = '';
    mapDrawer.appendChild(mapImg);

    // Retailer pins on map
    stores.forEach(function (store, idx) {
      if (idx >= PIN_POSITIONS.length) return;
      var pos = PIN_POSITIONS[idx];
      var pin = document.createElement('div');
      pin.className = 'step3-pin';
      pin.style.top = pos.top;
      pin.style.left = pos.left;
      var pinEl = buildRetailerPin(store.logoURL, campaignData.clientLogoURL);
      pin.appendChild(pinEl);
      mapDrawer.appendChild(pin);
    });

    // ── Drawer ──
    var drawer = document.createElement('div');
    drawer.className = 'step3-drawer';

    // Slider handle
    var slider = document.createElement('div');
    slider.className = 'step3-drawer-slider';
    var handle = document.createElement('div');
    handle.className = 'step3-drawer-handle';
    slider.appendChild(handle);
    drawer.appendChild(slider);

    // Drawer body
    var body = document.createElement('div');
    body.className = 'step3-drawer-body';

    // Heading
    var heading = document.createElement('div');
    heading.className = 'step3-drawer-heading';
    heading.textContent = s.nearbyStores;
    body.appendChild(heading);

    // Retailers list
    var list = document.createElement('div');
    list.className = 'step3-retailers';

    var drawerStores = stores.slice(0, 3);
    drawerStores.forEach(function (store, idx) {
      var row = document.createElement('div');
      row.className = 'step3-retailer-row';

      var inner = document.createElement('div');
      inner.className = 'step3-retailer-inner';

      // Left: logo + info
      var left = document.createElement('div');
      left.className = 'step3-retailer-left';

      // Retailer logo (DTS_RetailerLogo)
      var logoWrap = document.createElement('div');
      logoWrap.className = 'step3-retailer-logo';
      var retailerLogoSrc = campaignData.clientLogoURL || store.logoURL;
      if (retailerLogoSrc) {
        // Client logo provided — show logo only, no pin.png
        var logoImg = document.createElement('img');
        logoImg.src = retailerLogoSrc;
        logoImg.alt = '';
        logoImg.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;border-radius:50%;';
        logoImg.onerror = function () {
          logoImg.style.borderRadius = '0';
          logoImg.src = 'assets/click2go-assets/map/pin.png';
        };
        logoWrap.appendChild(logoImg);
      } else {
        var logoBg = document.createElement('img');
        logoBg.src = 'assets/click2go-assets/map/pin.png';
        logoBg.alt = '';
        logoBg.className = 'step3-retailer-logo-bg';
        logoWrap.appendChild(logoBg);
      }
      left.appendChild(logoWrap);

      // Info: name + address + distance
      var info = document.createElement('div');
      info.className = 'step3-retailer-info';

      var text = document.createElement('div');
      text.className = 'step3-retailer-text';
      var nameEl = document.createElement('div');
      nameEl.className = 'step3-retailer-name';
      nameEl.textContent = store.name;
      text.appendChild(nameEl);
      var addrEl = document.createElement('div');
      addrEl.className = 'step3-retailer-address';
      addrEl.textContent = (addressParts[0] || '') + ' - ' + (addressParts[1] || '');
      text.appendChild(addrEl);
      info.appendChild(text);

      var dist = document.createElement('div');
      dist.className = 'step3-retailer-distance';
      dist.textContent = '000m';
      info.appendChild(dist);

      left.appendChild(info);
      inner.appendChild(left);

      // Directions icon
      var dirBtn = document.createElement('button');
      dirBtn.className = 'step3-retailer-directions';
      dirBtn.innerHTML = '<img src="assets/click2go-assets/map/direction-icon.svg" width="32" height="32" alt="">';
      dirBtn.addEventListener('click', function () { showStep4(campaignData); });
      inner.appendChild(dirBtn);

      row.appendChild(inner);

      // Divider (except after last row)
      if (idx < drawerStores.length - 1) {
        var divider = document.createElement('div');
        divider.className = 'step3-retailer-divider';
        row.appendChild(divider);
      }

      list.appendChild(row);
    });

    body.appendChild(list);

    // "More stores" link
    var moreWrap = document.createElement('div');
    moreWrap.className = 'step3-more-stores';
    var moreBtn = document.createElement('button');
    moreBtn.className = 'step3-more-stores-btn';
    moreBtn.textContent = s.moreStores;
    moreBtn.addEventListener('click', function () { showStep5(campaignData); });
    moreWrap.appendChild(moreBtn);
    body.appendChild(moreWrap);

    drawer.appendChild(body);
    mapDrawer.appendChild(drawer);
    screen.appendChild(mapDrawer);

    // ── Footer with DTS_CTA ──
    var loc = (campaignData.location || '').toUpperCase();
    var CTA_LABELS = { IT:'Trova lo store', ES:'Encuentra la tienda', FR:'Trouver le magasin', DE:'Store finden', PT:'Encontrar a loja' };
    var ctaLabel = CTA_LABELS[loc] || 'Find the store';
    var footer = document.createElement('div');
    footer.className = 'step3-footer';
    footer.style.background = bkg;
    footer.style.flexShrink = '0';
    var ctaBtn = document.createElement('button');
    ctaBtn.className = 'step3-cta';
    ctaBtn.textContent = ctaLabel;
    ctaBtn.style.background = campaignData.buttonBkgColor || '#000';
    ctaBtn.style.color = campaignData.buttonTextColor || '#fff';
    ctaBtn.style.borderColor = campaignData.buttonBkgColor || '#000';
    footer.appendChild(ctaBtn);
    screen.appendChild(footer);

    // Insert into .phone element
    var phone = document.getElementById('phone');
    phone.appendChild(screen);
  }

  // ── Step 4: Google Maps directions screenshot ───────────────────
  function showStep4(campaignData) {
    injectCSS();

    const screen = document.createElement('div');
    screen.className = 'pass2-step4';
    screen.id = 'pass2-step4';

    // Full-bleed Google Maps placeholder image
    const img = document.createElement('img');
    img.className = 'step4-img';
    img.src = 'images/maps/google-maps-placeholder.png';
    img.alt = '';
    screen.appendChild(img);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'step4-back';
    backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    backBtn.addEventListener('click', function () {
      screen.remove();
    });
    screen.appendChild(backBtn);

    // Insert into .phone element
    const phone = document.getElementById('phone');
    phone.appendChild(screen);
  }

  // ── Step 5: Retailer list ──────────────────────────────────────
  function showStep5(campaignData) {
    injectCSS();

    const lang = getLang(campaignData.location);
    const s = STRINGS[lang];
    const cc = (campaignData.location || '').toUpperCase();
    const address = PLACEHOLDER_ADDRESSES[cc] || PLACEHOLDER_ADDRESSES['IT'];

    // Collect stores from campaign data (Store01–Store05)
    var stores = [];
    for (var i = 1; i <= 5; i++) {
      var pad = ('0' + i).slice(-2);
      var name = campaignData['Store' + pad + 'Name'];
      var logo = campaignData['Store' + pad + 'LogoURL'];
      if (name || logo) {
        stores.push({ name: name || '', logoURL: logo || '' });
      }
    }

    var screen = document.createElement('div');
    screen.className = 'pass2-step5';
    screen.id = 'pass2-step5';

    // Header with back button + heading
    var header = document.createElement('div');
    header.className = 'step5-header';

    var backBtn = document.createElement('button');
    backBtn.className = 'step5-back';
    backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    backBtn.addEventListener('click', function () {
      screen.remove();
    });
    header.appendChild(backBtn);

    var heading = document.createElement('div');
    heading.className = 'step5-heading';
    heading.textContent = s.moreStores;
    header.appendChild(heading);

    screen.appendChild(header);

    // Scrollable list
    var list = document.createElement('div');
    list.className = 'step5-list';

    stores.forEach(function (store) {
      var row = document.createElement('div');
      row.className = 'step5-row';

      var logoWrap = document.createElement('div');
      logoWrap.className = 'step5-row-logo';
      if (store.logoURL) {
        var img = document.createElement('img');
        img.src = store.logoURL;
        img.alt = '';
        img.onerror = function () { logoWrap.style.background = '#E8E8ED'; };
        logoWrap.appendChild(img);
      }
      row.appendChild(logoWrap);

      var info = document.createElement('div');
      info.className = 'step5-row-info';
      var nameEl = document.createElement('div');
      nameEl.className = 'step5-row-name';
      nameEl.textContent = store.name;
      info.appendChild(nameEl);
      var addrEl = document.createElement('div');
      addrEl.className = 'step5-row-address';
      addrEl.textContent = address;
      info.appendChild(addrEl);
      row.appendChild(info);

      var dist = document.createElement('div');
      dist.className = 'step5-row-distance';
      dist.textContent = '0.5 km';
      row.appendChild(dist);

      list.appendChild(row);
    });

    screen.appendChild(list);

    // Insert into .phone element
    var phone = document.getElementById('phone');
    phone.appendChild(screen);
  }
})();
