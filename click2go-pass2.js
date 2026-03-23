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
        animation: pass2FadeIn 0.25s ease-out;
      }

      /* Full-bleed map */
      .step3-map {
        flex: 1;
        position: relative;
        overflow: hidden;
      }
      .step3-map-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* Close button */
      .step3-close {
        position: absolute;
        top: 56px;
        right: 16px;
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
      .step3-close:active {
        background: rgba(235,235,235,0.95);
      }

      /* Store pin */
      .step3-pin {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -80%);
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 5;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));
      }
      .step3-pin-logo {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: white;
        border: 3px solid white;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .step3-pin-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
      .step3-pin-tail {
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid white;
        margin-top: -1px;
      }
      .step3-pin-generic {
        width: 44px;
        height: 54px;
      }

      /* User location dot */
      .step3-user-dot {
        position: absolute;
        top: 58%;
        left: 42%;
        width: 20px;
        height: 20px;
        z-index: 4;
      }

      /* Bottom drawer */
      .step3-drawer {
        background: #fff;
        border-radius: 20px 20px 0 0;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.10);
        padding: 16px 20px 24px;
        flex-shrink: 0;
        position: relative;
      }
      .step3-drawer-handle {
        width: 36px;
        height: 4px;
        border-radius: 2px;
        background: #D1D1D6;
        margin: 0 auto 14px;
      }
      .step3-drawer-heading {
        font-family: -apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif;
        font-size: 20px;
        font-weight: 700;
        color: #000;
        margin-bottom: 16px;
      }

      /* Store card */
      .step3-store-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #F5F5F7;
        border-radius: 12px;
        margin-bottom: 16px;
      }
      .step3-store-logo {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: white;
        flex-shrink: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      }
      .step3-store-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
      .step3-store-info {
        flex: 1;
        min-width: 0;
      }
      .step3-store-name {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 15px;
        font-weight: 600;
        color: #000;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .step3-store-address {
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
      .step3-store-distance {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: #8E8E93;
        flex-shrink: 0;
        text-align: right;
      }

      /* Action buttons */
      .step3-actions {
        display: flex;
        gap: 10px;
      }
      .step3-action-btn {
        flex: 1;
        height: 44px;
        border-radius: 12px;
        border: none;
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        -webkit-tap-highlight-color: transparent;
      }
      .step3-action-btn:active {
        opacity: 0.85;
      }
      .step3-btn-directions {
        background: #007AFF;
        color: #fff;
      }
      .step3-btn-more {
        background: #F5F5F7;
        color: #007AFF;
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

  // ── Step 3: Map + Store pin + Bottom drawer ───────────────────────
  function showStep3(campaignData) {
    injectCSS();

    const lang = getLang(campaignData.location);
    const s = STRINGS[lang];
    const cc = (campaignData.location || '').toUpperCase();
    const storeName = campaignData.campaignName || 'Store';
    const address = PLACEHOLDER_ADDRESSES[cc] || PLACEHOLDER_ADDRESSES['IT'];

    const screen = document.createElement('div');
    screen.className = 'pass2-step3';
    screen.id = 'pass2-step3';

    // ── Map area ──
    const mapArea = document.createElement('div');
    mapArea.className = 'step3-map';

    const mapImg = document.createElement('img');
    mapImg.className = 'step3-map-img';
    mapImg.src = getMapUrl(campaignData.location);
    mapImg.alt = '';
    mapArea.appendChild(mapImg);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'step3-close';
    closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>';
    closeBtn.addEventListener('click', function () {
      screen.remove();
    });
    mapArea.appendChild(closeBtn);

    // Store pin
    const pin = document.createElement('div');
    pin.className = 'step3-pin';

    if (campaignData.Store01LogoURL) {
      const pinLogo = document.createElement('div');
      pinLogo.className = 'step3-pin-logo';
      const logoImg = document.createElement('img');
      logoImg.src = campaignData.Store01LogoURL;
      logoImg.alt = '';
      logoImg.onerror = function () {
        pinLogo.innerHTML = '';
        const fallback = document.createElement('img');
        fallback.src = 'assets/click2go-assets/map/pin.png';
        fallback.alt = '';
        fallback.className = 'step3-pin-generic';
        pin.innerHTML = '';
        pin.appendChild(fallback);
      };
      pinLogo.appendChild(logoImg);
      pin.appendChild(pinLogo);
      const tail = document.createElement('div');
      tail.className = 'step3-pin-tail';
      pin.appendChild(tail);
    } else {
      const fallback = document.createElement('img');
      fallback.src = 'assets/click2go-assets/map/pin.png';
      fallback.alt = '';
      fallback.className = 'step3-pin-generic';
      pin.appendChild(fallback);
    }
    mapArea.appendChild(pin);

    // User location dot
    const userDot = document.createElement('img');
    userDot.className = 'step3-user-dot';
    userDot.src = 'assets/click2go-assets/map/user-pin.png';
    userDot.alt = '';
    mapArea.appendChild(userDot);

    screen.appendChild(mapArea);

    // ── Bottom drawer ──
    const drawer = document.createElement('div');
    drawer.className = 'step3-drawer';

    const handle = document.createElement('div');
    handle.className = 'step3-drawer-handle';
    drawer.appendChild(handle);

    const heading = document.createElement('div');
    heading.className = 'step3-drawer-heading';
    heading.textContent = s.nearbyStores;
    drawer.appendChild(heading);

    // Store card
    const card = document.createElement('div');
    card.className = 'step3-store-card';

    const logoWrap = document.createElement('div');
    logoWrap.className = 'step3-store-logo';
    if (campaignData.clientLogoURL) {
      const cLogo = document.createElement('img');
      cLogo.src = campaignData.clientLogoURL;
      cLogo.alt = '';
      cLogo.onerror = function () { logoWrap.style.background = '#F0F0F0'; };
      logoWrap.appendChild(cLogo);
    }
    card.appendChild(logoWrap);

    const info = document.createElement('div');
    info.className = 'step3-store-info';
    const nameEl = document.createElement('div');
    nameEl.className = 'step3-store-name';
    nameEl.textContent = storeName;
    info.appendChild(nameEl);
    const addrEl = document.createElement('div');
    addrEl.className = 'step3-store-address';
    addrEl.textContent = address;
    info.appendChild(addrEl);
    card.appendChild(info);

    const dist = document.createElement('div');
    dist.className = 'step3-store-distance';
    dist.textContent = '0.5 km';
    card.appendChild(dist);

    drawer.appendChild(card);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'step3-actions';

    const dirBtn = document.createElement('button');
    dirBtn.className = 'step3-action-btn step3-btn-directions';
    dirBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13L8 3l5 10-5-3-5 3z" fill="white"/></svg>' + s.directions;
    dirBtn.addEventListener('click', function () {
      showStep4(campaignData);
    });
    actions.appendChild(dirBtn);

    const moreBtn = document.createElement('button');
    moreBtn.className = 'step3-action-btn step3-btn-more';
    moreBtn.textContent = s.moreStores;
    moreBtn.addEventListener('click', function () {
      console.log('Advancing to Step 5');
    });
    actions.appendChild(moreBtn);

    drawer.appendChild(actions);
    screen.appendChild(drawer);

    // Insert into .phone element
    const phone = document.getElementById('phone');
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
})();
