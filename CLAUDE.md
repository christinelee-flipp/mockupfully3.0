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
- **form.html** — Campaign create/edit form (detects `?edit=campaignID` param to switch modes)
- **domination-prototype.html** — Interactive iPhone-frame mockup that reads all campaign data from URL query params

### Backend: Make.com Webhooks

All persistence is handled by Make.com webhooks hardcoded in `index.html` and `form.html` under a `WEBHOOKS` constant. The app is otherwise stateless — there is no database, session storage, or authentication layer.

### State Transfer via URL Params

The prototype URL is the data contract between `form.html` and `domination-prototype.html`. When a campaign is saved, `form.html` builds a querystring URL containing all campaign fields. The prototype reads these params at init time to render colors, images, and text. This URL is also what gets shared/copied by users.

### Edit Mode Detection

`form.html` serves both create and edit flows. On load, `init()` checks for `?edit=campaignID` in the URL — if present, it fetches the campaign via the `getOne` webhook, normalizes the response (Make.com returns inconsistent key casing), and prefills the form.

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
- **Dynamic image fields:** `form.html` renders 1 image field for Single or 3 for Carousel based on `templateType` selection.
- **Color picker sync:** Each color field has a paired `<input type="color">` and hex text input kept in bidirectional sync.
- **Internationalization:** The prototype hardcodes a `COUNTRIES` object with localized UI strings and brand lists for 14 countries. Add new countries there.
- **Carousel:** Touch/mouse drag with 50px snap threshold, CSS transition disabled during drag for smooth feel.
- **Ghostover:** Optional interstitial modal triggered 800ms after prototype load.
