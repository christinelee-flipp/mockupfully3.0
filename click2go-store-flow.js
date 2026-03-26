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
      modalTitle:     'Allow \u201CSafari\u201D to use your location?',
      modalBody:      'Your precise location is used to show your location on the map, get directions, estimate travel times and improve search results',
      preciseOn:      'Precise: On',
      nearbyStores:   'Nearby stores',
      directions:     'Directions',
      moreStores:     'More stores'
    },
    it: {
      allowOnce:      'Consenti una volta',
      allowWhileUsing:'Consenti mentre usi l\u2019app',
      dontAllow:      'Non permettere',
      modalTitle:     'Consenti a \u201CSafari\u201D di usare la tua posizione?',
      modalBody:      'La tua posizione precisa viene utilizzata per mostrare la tua posizione sulla mappa, ottenere indicazioni stradali, stimare i tempi di percorrenza e migliorare i risultati della ricerca',
      preciseOn:      'Preciso: On',
      nearbyStores:   'Negozi vicini',
      directions:     'Indicazioni',
      moreStores:     'Altri negozi'
    },
    es: {
      allowOnce:      'Permitir una vez',
      allowWhileUsing:'Permitir mientras se usa la app',
      dontAllow:      'No permitir',
      modalTitle:     '\u00bfPermitir a \u201CSafari\u201D usar tu ubicaci\u00f3n?',
      modalBody:      'Tu ubicaci\u00f3n precisa se utiliza para mostrar tu posici\u00f3n en el mapa, obtener indicaciones, estimar tiempos de viaje y mejorar los resultados de b\u00fasqueda',
      preciseOn:      'Preciso: On',
      nearbyStores:   'Tiendas cercanas',
      directions:     'C\u00f3mo llegar',
      moreStores:     'M\u00e1s tiendas'
    },
    fr: {
      allowOnce:      'Autoriser une fois',
      allowWhileUsing:'Autoriser lorsque l\u2019app est active',
      dontAllow:      'Ne pas autoriser',
      modalTitle:     'Autoriser \u201CSafari\u201D \u00e0 utiliser votre position\u00a0?',
      modalBody:      'Votre position pr\u00e9cise est utilis\u00e9e pour afficher votre position sur la carte, obtenir des itin\u00e9raires, estimer les temps de trajet et am\u00e9liorer les r\u00e9sultats de recherche',
      preciseOn:      'Pr\u00e9cis\u00a0: activ\u00e9',
      nearbyStores:   'Magasins \u00e0 proximit\u00e9',
      directions:     'Itin\u00e9raire',
      moreStores:     'Plus de magasins'
    },
    de: {
      allowOnce:      'Einmal erlauben',
      allowWhileUsing:'Beim Verwenden der App erlauben',
      dontAllow:      'Nicht erlauben',
      modalTitle:     '\u201ESafari\u201C m\u00f6chte deinen Standort verwenden',
      modalBody:      'Dein genauer Standort wird verwendet, um deine Position auf der Karte anzuzeigen, Wegbeschreibungen zu erhalten, Reisezeiten zu sch\u00e4tzen und Suchergebnisse zu verbessern',
      preciseOn:      'Genau: Ein',
      nearbyStores:   'Gesch\u00e4fte in der N\u00e4he',
      directions:     'Wegbeschreibung',
      moreStores:     'Mehr Gesch\u00e4fte'
    },
    pt: {
      allowOnce:      'Permitir uma vez',
      allowWhileUsing:'Permitir ao usar o app',
      dontAllow:      'N\u00e3o permitir',
      modalTitle:     'Permitir que o \u201CSafari\u201D utilize a sua localiza\u00e7\u00e3o?',
      modalBody:      'A sua localiza\u00e7\u00e3o precisa \u00e9 utilizada para mostrar a sua posi\u00e7\u00e3o no mapa, obter dire\u00e7\u00f5es, estimar tempos de viagem e melhorar os resultados da pesquisa',
      preciseOn:      'Preciso: On',
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
      /* ── STEP 2: Permission modal overlay on Step 3 ────── */
      .pass2-overlay {
        position: absolute;
        inset: 0;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pass2FadeIn 0.25s ease-out;
      }
      @keyframes pass2FadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .pass2-scrim {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.4);
      }

      /* iOS permission modal */
      .pass2-modal {
        position: relative;
        width: min(310px, 88%);
        background: rgba(255,255,255,0.9);
        border-radius: 18px;
        overflow: hidden;
        text-align: center;
        backdrop-filter: blur(2.3px);
        -webkit-backdrop-filter: blur(2.3px);
      }
      .pass2-modal-question {
        padding: 18px;
        overflow: hidden;
      }
      .pass2-modal-title {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 19.5px;
        font-weight: 600;
        color: #000;
        line-height: 25px;
        letter-spacing: -0.47px;
        margin-bottom: 2px;
      }
      .pass2-modal-body {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 15px;
        font-weight: 400;
        color: #000;
        line-height: 18px;
        letter-spacing: -0.09px;
      }

      /* Map preview inside modal */
      .pass2-modal-map {
        position: relative;
        width: 100%;
        height: 199px;
        overflow: hidden;
      }
      .pass2-modal-map img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .pass2-precise-pill {
        position: absolute;
        top: 10px;
        left: 9px;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 3px 11px;
        background: #fff;
        border-radius: 1147px;
        box-shadow: 0 3.4px 9.2px rgba(0,0,0,0.12);
      }
      .pass2-precise-text {
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 15px;
        font-weight: 600;
        color: #007AFF;
        letter-spacing: -0.09px;
        line-height: 21px;
        white-space: nowrap;
      }
      .pass2-blue-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 14px;
        height: 14px;
        background: #4285F4;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(66,133,244,0.5);
        transform: translate(-50%, -50%);
      }

      /* Button stack */
      .pass2-btn-stack {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .pass2-btn-divider {
        width: 100%;
        height: 0.57px;
        background: rgba(60,60,67,0.29);
      }
      .pass2-btn {
        display: block;
        width: 100%;
        padding: 11.5px 16px;
        border: none;
        background: transparent;
        font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        font-size: 19.5px;
        color: #007AFF;
        cursor: pointer;
        text-align: center;
        line-height: 25px;
        letter-spacing: -0.47px;
        font-weight: 400;
        -webkit-tap-highlight-color: transparent;
      }
      .pass2-btn:active {
        background: rgba(0,0,0,0.06);
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
        width: 100%;
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
        width: 100%;
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
        width: 100%;
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
      .step4-statusbar {
        width: 100%;
        height: 54px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px 0;
        background: #fff;
      }
      .step4-maps-area {
        flex: 1;
        min-height: 0;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .step4-maps-area img {
        width: 100%;
        display: block;
        flex-shrink: 0;
      }
      .step4-maps-content {
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }
      .step4-maps-content img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .step4-back {
        position: absolute;
        top: 8px;
        left: 6px;
        width: 44px;
        height: 44px;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        -webkit-tap-highlight-color: transparent;
      }
      .step4-footer {
        height: 32px;
        flex-shrink: 0;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 8px;
      }
      .step4-home-indicator {
        width: 154px;
        height: 5px;
        border-radius: 4px;
        background: #949494;
      }

      /* ── STEP 5: Retailer list ───────────────────────────── */
      .pass2-step5 {
        position: absolute;
        inset: 0;
        z-index: 160;
        display: flex;
        flex-direction: column;
        animation: pass2FadeIn 0.25s ease-out;
        overflow: hidden;
      }
      .step5-list-area {
        flex: 1;
        min-height: 0;
        background: #fff;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px 0 8px;
      }
      .step5-list-heading {
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #474643;
        letter-spacing: 0.1px;
        line-height: 24px;
        padding: 0 12px;
      }
      .step5-retailers {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 0 auto;
      }
    `;
    document.head.appendChild(style);
  }

  // ── Build & show Step 2: permission modal on top of Step 3 ───────
  window.initPass2 = function (campaignData) {
    if (!campaignData) return;
    injectCSS();

    // First, show Step 3 behind the modal
    showStep3(campaignData);

    var lang = getLang(campaignData.location);
    var s = STRINGS[lang];

    // Overlay container — sits on top of Step 3
    var overlay = document.createElement('div');
    overlay.className = 'pass2-overlay';
    overlay.id = 'pass2-step2';

    // Dark scrim
    var scrim = document.createElement('div');
    scrim.className = 'pass2-scrim';
    overlay.appendChild(scrim);

    // Modal card
    var modal = document.createElement('div');
    modal.className = 'pass2-modal';

    // Question section (title + body)
    var question = document.createElement('div');
    question.className = 'pass2-modal-question';

    var title = document.createElement('div');
    title.className = 'pass2-modal-title';
    title.textContent = s.modalTitle;
    question.appendChild(title);

    var body = document.createElement('div');
    body.className = 'pass2-modal-body';
    body.textContent = s.modalBody;
    question.appendChild(body);

    modal.appendChild(question);

    // Map preview
    var mapWrap = document.createElement('div');
    mapWrap.className = 'pass2-modal-map';

    var mapImg = document.createElement('img');
    mapImg.src = getMapUrl(campaignData.location);
    mapImg.alt = '';
    mapWrap.appendChild(mapImg);

    // "Preciso: On" pill
    var pill = document.createElement('div');
    pill.className = 'pass2-precise-pill';
    pill.innerHTML = '<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 0L7 4H11L7.5 6.5L9 11L5.5 8L2 11L3.5 6.5L0 4H4L5.5 0Z" fill="#007AFF"/></svg>';
    var pillText = document.createElement('span');
    pillText.className = 'pass2-precise-text';
    pillText.textContent = s.preciseOn;
    pill.appendChild(pillText);
    mapWrap.appendChild(pill);

    // Blue location dot
    var dot = document.createElement('div');
    dot.className = 'pass2-blue-dot';
    mapWrap.appendChild(dot);

    modal.appendChild(mapWrap);

    // Button stack with dividers
    var btnStack = document.createElement('div');
    btnStack.className = 'pass2-btn-stack';

    function addBtn(label) {
      var divider = document.createElement('div');
      divider.className = 'pass2-btn-divider';
      btnStack.appendChild(divider);

      var btn = document.createElement('button');
      btn.className = 'pass2-btn';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        overlay.remove();
      });
      btnStack.appendChild(btn);
    }

    addBtn(s.allowOnce);
    addBtn(s.allowWhileUsing);
    addBtn(s.dontAllow);

    modal.appendChild(btnStack);
    overlay.appendChild(modal);

    // Insert into .phone element (on top of Step 3)
    var phone = document.getElementById('phone');
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
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;border-radius:50%;background:#fff;';
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
    for (var i = 1; i <= 10; i++) {
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
        logoImg.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;border-radius:50%;background:#fff;';
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
    if (campaignData.clientURL) {
      ctaBtn.addEventListener('click', function () {
        window.open(campaignData.clientURL.startsWith('http') ? campaignData.clientURL : 'https://' + campaignData.clientURL, '_blank');
      });
    }
    footer.appendChild(ctaBtn);
    screen.appendChild(footer);

    // Insert into .phone element
    var phone = document.getElementById('phone');
    phone.appendChild(screen);
  }

  // ── Step 4: Google Maps directions screenshot ───────────────────
  var GMAPS_COUNTRIES = ['IT','ES','FR','AU','PT','BR','AT','DE'];

  function getGMapsPath(location) {
    var cc = (location || '').toUpperCase();
    if (GMAPS_COUNTRIES.indexOf(cc) !== -1) return 'assets/click2go-assets/googleMaps/' + cc + '/';
    return 'assets/click2go-assets/googleMaps/IT/';
  }

  function showStep4(campaignData) {
    injectCSS();

    var basePath = getGMapsPath(campaignData.location);

    var screen = document.createElement('div');
    screen.className = 'pass2-step4';
    screen.id = 'pass2-step4';

    // Google Maps area (header + content + footer images)
    var mapsArea = document.createElement('div');
    mapsArea.className = 'step4-maps-area';

    // Header image (directions bar)
    var headerImg = document.createElement('img');
    headerImg.src = basePath + 'header.png';
    headerImg.alt = '';
    mapsArea.appendChild(headerImg);

    // Content image (map with route) — fills remaining space
    var contentWrap = document.createElement('div');
    contentWrap.className = 'step4-maps-content';
    var contentImg = document.createElement('img');
    contentImg.src = basePath + 'content.png';
    contentImg.alt = '';
    contentWrap.appendChild(contentImg);
    mapsArea.appendChild(contentWrap);

    // Footer image (duration bar + buttons)
    var footerImg = document.createElement('img');
    footerImg.src = basePath + 'footer.png';
    footerImg.alt = '';
    mapsArea.appendChild(footerImg);

    // Back button (overlaid on the header area)
    var backBtn = document.createElement('button');
    backBtn.className = 'step4-back';
    backBtn.innerHTML = '';
    backBtn.addEventListener('click', function () { screen.remove(); });
    mapsArea.appendChild(backBtn);

    screen.appendChild(mapsArea);

    // Home indicator footer
    var footer = document.createElement('div');
    footer.className = 'step4-footer';
    var indicator = document.createElement('div');
    indicator.className = 'step4-home-indicator';
    footer.appendChild(indicator);
    screen.appendChild(footer);

    // Insert into .phone element
    var phone = document.getElementById('phone');
    phone.appendChild(screen);
  }

  // ── Step 5: Retailer list ──────────────────────────────────────
  function showStep5(campaignData) {
    injectCSS();

    var lang = getLang(campaignData.location);
    var s = STRINGS[lang];
    var cc = (campaignData.location || '').toUpperCase();
    var fullAddress = PLACEHOLDER_ADDRESSES[cc] || PLACEHOLDER_ADDRESSES['IT'];
    var addressParts = fullAddress.split(' - ');
    var chipData = LOCATION_CHIP[cc] || LOCATION_CHIP['IT'];

    // Background — match Step 1
    var bkg;
    if (campaignData.globalBkgType === 'gradient' && campaignData.globalBkgTop && campaignData.globalBkgBottom) {
      bkg = 'linear-gradient(to bottom, ' + campaignData.globalBkgTop + ', ' + campaignData.globalBkgBottom + ')';
    } else {
      bkg = campaignData.globalBkgColor || '#EBEBF5';
    }
    var topHex = campaignData.globalBkgType === 'gradient' ? (campaignData.globalBkgTop || '#000') : (campaignData.globalBkgColor || '#fff');
    var chipColor = '#666';
    var iconStroke = '#000';
    var _c5 = topHex.replace('#', '');
    if (_c5.length >= 6) {
      var _r5 = parseInt(_c5.slice(0,2),16), _g5 = parseInt(_c5.slice(2,4),16), _b5 = parseInt(_c5.slice(4,6),16);
      if ((_r5*0.299 + _g5*0.587 + _b5*0.114) < 128) { chipColor = 'rgba(255,255,255,0.7)'; iconStroke = '#fff'; }
    }

    // Collect stores
    var stores = [];
    for (var i = 1; i <= 10; i++) {
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
    screen.style.setProperty('--chip-color', chipColor);

    // ── Header (same as Step 3) ──
    var header = document.createElement('div');
    header.className = 'step3-header';
    header.style.background = bkg;
    header.style.flexShrink = '0';

    // Top app bar: [back] [DTS_Logo] [close X]
    var topbar = document.createElement('div');
    topbar.className = 'step3-topbar';

    // Leading icon: back arrow
    var backBtn = document.createElement('button');
    backBtn.className = 'step3-topbar-icon';
    backBtn.innerHTML = '<svg width="37" height="37" viewBox="0 0 37 37" fill="none"><path d="M22 11L14 18.5L22 26" stroke="' + iconStroke + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    backBtn.addEventListener('click', function () { screen.remove(); });
    topbar.appendChild(backBtn);

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

    // Trailing icon: close (X)
    var closeBtn = document.createElement('button');
    closeBtn.className = 'step3-topbar-icon';
    closeBtn.innerHTML = '<svg width="37" height="37" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="18" stroke="' + iconStroke + '" stroke-width="1.5"/><path d="M13 13l12 12M25 13L13 25" stroke="' + iconStroke + '" stroke-width="1.8" stroke-linecap="round"/></svg>';
    closeBtn.addEventListener('click', function () {
      screen.remove();
      // Also remove Step 3 underneath
      var s3 = document.getElementById('pass2-step3');
      if (s3) s3.remove();
    });
    topbar.appendChild(closeBtn);
    header.appendChild(topbar);

    // Location chip
    var chipRow = document.createElement('div');
    chipRow.className = 'step3-chip-row';
    var chip = document.createElement('div');
    chip.className = 'step3-chip';
    chip.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75c0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75c0-2.9-2.35-5.25-5.25-5.25z" stroke="' + chipColor + '" stroke-width="1.2"/><circle cx="9" cy="6.75" r="1.5" stroke="' + chipColor + '" stroke-width="1"/></svg>';
    var chipText = document.createElement('span');
    chipText.className = 'step3-chip-text';
    chipText.textContent = chipData.zip + ' ' + chipData.city + ' [' + cc + ']';
    chip.appendChild(chipText);
    var chipClose = document.createElement('span');
    chipClose.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 6L6 12M6 6l6 6" stroke="' + chipColor + '" stroke-width="1.2" stroke-linecap="round"/></svg>';
    chip.appendChild(chipClose);
    chipRow.appendChild(chip);
    header.appendChild(chipRow);
    screen.appendChild(header);

    // ── Scrollable retailer list ──
    var listArea = document.createElement('div');
    listArea.className = 'step5-list-area';

    // "Store intorno a te" / localised heading
    var heading = document.createElement('div');
    heading.className = 'step5-list-heading';
    heading.textContent = s.nearbyStores;
    listArea.appendChild(heading);

    var retailers = document.createElement('div');
    retailers.className = 'step5-retailers';

    stores.forEach(function (store, idx) {
      var row = document.createElement('div');
      row.className = 'step3-retailer-row';

      var inner = document.createElement('div');
      inner.className = 'step3-retailer-inner';

      var left = document.createElement('div');
      left.className = 'step3-retailer-left';

      // Retailer logo
      var logoWrap = document.createElement('div');
      logoWrap.className = 'step3-retailer-logo';
      var retailerLogoSrc = campaignData.clientLogoURL || store.logoURL;
      if (retailerLogoSrc) {
        var logoImg = document.createElement('img');
        logoImg.src = retailerLogoSrc;
        logoImg.alt = '';
        logoImg.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;border-radius:50%;background:#fff;';
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

      // Info
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

      // Divider
      var divider = document.createElement('div');
      divider.className = 'step3-retailer-divider';
      row.appendChild(divider);

      retailers.appendChild(row);
    });

    listArea.appendChild(retailers);
    screen.appendChild(listArea);

    // ── Footer with DTS_CTA ──
    var loc = cc;
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
    if (campaignData.clientURL) {
      ctaBtn.addEventListener('click', function () {
        window.open(campaignData.clientURL.startsWith('http') ? campaignData.clientURL : 'https://' + campaignData.clientURL, '_blank');
      });
    }
    footer.appendChild(ctaBtn);
    screen.appendChild(footer);

    // Insert into .phone element
    var phone = document.getElementById('phone');
    phone.appendChild(screen);
  }
})();
