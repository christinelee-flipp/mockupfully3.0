# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mockupfully is a static HTML campaign management tool for creating and previewing mobile app mockup prototypes. It consists of three standalone HTML files with no build pipeline — open them directly in a browser or serve them with any static file server.

## Running the Project

No installation or build step required. To serve locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

Three HTML files form the complete application:

- **index.html** — Campaign list dashboard (search, filter, CRUD actions)
- **domination-form.html** — Campaign create/edit form (detects `?edit=campaignID` param to switch modes)
- **domination-prototype.html** — Interactive iPhone-frame mockup that reads all campaign data from URL query params

### Backend: Make.com Webhooks

All persistence is handled by Make.com webhooks hardcoded in `index.html` and `domination-form.html` under a `WEBHOOKS` constant. The app is otherwise stateless — there is no database, session storage, or authentication layer.

### State Transfer via URL Params

The prototype URL is the data contract between `domination-form.html` and `domination-prototype.html`. When a campaign is saved, `domination-form.html` builds a querystring URL containing all campaign fields. The prototype reads these params at init time to render colors, images, and text. This URL is also what gets shared/copied by users.

### Edit Mode Detection

`domination-form.html` serves both create and edit flows. On load, `init()` checks for `?edit=campaignID` in the URL — if present, it fetches the campaign via the `getOne` webhook, normalizes the response (Make.com returns inconsistent key casing), and prefills the form.

## Campaign Data Model

```javascript
{
  campaignID: "domination-YYYYMMDDHHMMSS",
  campaignName: string,
  location: string,           // 2-letter country code: IT, AU, CA, US, FR, DE, ES, AT, NL, PL, PT, RO, BG, HU
  templateType: "Carousel" | "Single",
  clientLogoURL: string,
  ghostoverURL: string,       // optional interstitial overlay image
  Img01URL: string,
  Img02URL: string,           // Carousel only
  Img03URL: string,           // Carousel only
  globalBkgColor: string,     // hex e.g. "#FF7300"
  globalTextColor: string,
  buttonBkgColor: string,
  buttonTextColor: string,
  paginationBkgColor: string,
  paginationActiveColor: string,
  claimText: string,
  buttonText: string,
  submittedAt: string         // ISO timestamp
}
```

## Key Patterns

- **Client-side filtering:** `index.html` loads all campaigns once and filters in-memory — no server pagination.
- **Dynamic image fields:** `domination-form.html` renders 1 image field for Single or 3 for Carousel based on `templateType` selection.
- **Color picker sync:** Each color field has a paired `<input type="color">` and hex text input kept in bidirectional sync.
- **Internationalization:** The prototype hardcodes a `COUNTRIES` object with localized UI strings and brand lists for 14 countries. Add new countries there.
- **Carousel:** Touch/mouse drag with 50px snap threshold, CSS transition disabled during drag for smooth feel.
- **Ghostover:** Optional interstitial modal triggered 800ms after prototype load.

## Deployment

### Staging (automatic)
Push to the staging branch → GitHub Actions
automatically deploys to Staging-Mockupfully3.0

  git add .
  git commit -m "your message"
  git push origin staging

GitHub Actions workflow:
  .github/workflows/deploy-staging.yml

Staging URL:
  https://designlab.shopfully.com/Staging-Mockupfully3.0/

### Production (manual — intentional)
Production deploys are done manually by merging
staging into main and pushing:

  git checkout main
  git merge staging
  git push origin main

Production URL:
  https://designlab.shopfully.com/Mockupfully3.0/

Note: Production auto-deploy via GitHub Actions
can be added later by creating
.github/workflows/deploy-production.yml

### GitHub Secrets required
These must be set in the GitHub repository
Settings → Secrets → Actions:

  FTP_SERVER      = it31.siteground.eu
  FTP_USERNAME    = c.lee@designlab.shopfully.com
  FTP_PASSWORD    = [FTP password]
  FTP_STAGING_PATH = /designlab.shopfully.com/public_html/Staging-Mockupfully3.0/

### Files excluded from deploy
  .git/, .vscode/, node_modules/
  .DS_Store, *.log
  Any temporary PHP debug files
  .gitkeep files

## Architecture Rules

These rules apply to ALL new code in this project.
Claude Code must follow these patterns on every session.

### File Structure
```
Mockupfully3.0/
├── index.html              <- Dashboard shell only
├── brand.css               <- All shared CSS
├── CLAUDE.md               <- Project context + rules
├── BRAND.md                <- Brand design rules
├── js/
│   ├── core/
│   │   ├── utils.js        <- Shared utilities
│   │   ├── zoom.js         <- Prototype scaling
│   │   └── upload.js       <- File upload handler
│   ├── products/
│   │   ├── domination.js
│   │   ├── click2go.js
│   │   ├── click2go-store-flow.js
│   │   └── shoppernetwork.js
│   ├── forms/
│   │   ├── form-core.js    <- Shared form logic
│   │   ├── domination-form.js
│   │   ├── click2go-form.js
│   │   └── shoppernetwork-form.js
│   └── dashboard/
│       └── index.js
├── api/                    <- PHP backend
├── assets/                 <- Static assets
├── data/
│   ├── domination/         <- Campaign JSONs
│   ├── click2go/
│   └── shoppernetwork/
└── uploads/
    ├── domination/
    │   └── {campaignID}/   <- Files per campaign
    ├── click2go/
    └── shoppernetwork/
```

### Rules

**JavaScript:**
- No inline JS in HTML files except a single one-line init call
- Shared logic goes in js/core/
- Product rendering goes in js/products/
- Form logic goes in js/forms/
- Dashboard logic goes in js/dashboard/index.js
- New ad unit = new file in js/products/ and js/forms/ -- never add to an existing product file
- Files should not exceed ~300 lines -- split by responsibility if longer

**HTML files:**
- Shell only: head, body structure, script tags
- No inline `<script>` blocks except one-line inits
- Always link brand.css and js/core/utils.js

**Uploads:**
- Always save to: uploads/{productType}/{campaignID}/{filename}
- Pass productType and campaignID to upload.php
- Return root-relative paths from upload.php: uploads/domination/domination-xxx/file.ext
- Never use absolute paths or /Mockupfully3.0/ prefixes in stored URLs

**Adding a new ad unit:**
1. Create js/products/{unit}.js
2. Create js/forms/{unit}-form.js
3. Create {unit}-prototype.html (shell only)
4. Create {unit}-form.html (shell only)
5. Add productType to api/ endpoints
6. Add tab + rendering to js/dashboard/index.js
7. Add to the +Campaign modal in index.html
8. Create uploads/{unit}/ directory
9. Create data/{unit}/ directory

**CSS:**
- All shared styles in brand.css
- No `<style>` blocks in HTML except for prototype-specific layout rules that don't belong in brand.css
- Always use CSS variables from brand.css (--color-navy, --color-sky etc)
- Never hardcode hex values in HTML

**PHP (api/):**
- save.php, list.php, get.php, delete.php must all support every productType
- When adding a new productType, update all four files
- upload.php handles all file types for all products -- use productType + campaignID params

## Field Name Standards

These are the canonical field names for all campaign JSON files. Never use aliases or variants -- use exactly these names.

### Domination
```
campaignID        — "domination-YYYYMMDDHHMMSS"
productType       — "Domination"
campaignName      — string
location          — country code e.g. "IT"
clientName        — string
clientLogoURL     — string (path or URL)
claimText         — string (optional)
templateType      — "Single" or "Carousel"
buttonText        — string
globalBkgType     — "color" or "gradient"
globalBkgColor    — hex string
globalBkgTop      — hex string (gradient only)
globalBkgBottom   — hex string (gradient only)
globalTextColor   — hex string
buttonBkgColor    — hex string
buttonTextColor   — hex string
paginationBkgColor    — hex string
paginationActiveColor — hex string
ghostoverURL      — string (optional)
Img01URL–Img10URL — string (image paths)
submittedAt       — ISO 8601 timestamp
```

### Click2Go
```
campaignID        — "click2go-YYYYMMDDHHMMSS"
productType       — "Click2Go"
campaignName, location, clientName,
clientLogoURL, clientURL, clientType,
websiteURL, viewer, marketplace, website,
templateType, claimText,
globalBkgType, globalBkgColor,
globalBkgTop, globalBkgBottom,
globalTextColor, buttonBkgColor,
buttonTextColor, locationBkgColor,
locationTextColor, productBkgType,
productBkgColor, productBkgTop,
productBkgBottom, productTextColor,
productCardBtnBkgColor,
productCardBtnTextColor, bannerURL,
Prod01Name, Prod01ImageURL, Prod01LinkURL,
Prod02Name, Prod02ImageURL, Prod02LinkURL,
Prod03Name, Prod03ImageURL, Prod03LinkURL,
Store01Name, Store01LogoURL,
Store02Name–Store05Name,
Store02LogoURL–Store05LogoURL,
submittedAt
```

### ShopperNetwork
```
campaignID        — "shoppernetwork-YYYYMMDDHHMMSS"
productType       — "ShopperNetwork"
campaignName, location, clientName,
publisher,
image1–image9,
submittedAt
```

### Rules
- Never create new field name variants
- camelCase only -- no underscores, no hyphens
- Boolean fields: true/false not "yes"/"no"
- Hex colours always include # prefix
- Paths are always root-relative (no leading /) e.g. "uploads/domination/campaign-id/file.png"
- Timestamps always ISO 8601: new Date().toISOString()
