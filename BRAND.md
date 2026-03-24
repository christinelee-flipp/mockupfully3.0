# Mockupfully 3.0 — Brand Reference

This file defines the visual identity for all Mockupfully 3.0
interfaces. Always follow these rules when building or restyling
any HTML/CSS in this project.

## Brand Origin
Flipp x Shopfully integrated branding.
Figma source: https://www.figma.com/design/s6vSjNU69AoZXFgpavF5MN

---

## Stylesheet
All brand styles are defined in `brand.css` at the project root.
Always link brand.css before any page-specific styles:
  <link rel="stylesheet" href="brand.css">

Never duplicate styles already in brand.css.
Use brand.css CSS variables (--color-navy, --color-sky, etc.)
for all colour values. Do not hardcode hex values in HTML or
page-specific CSS files.

---

## Colours

| Token              | Hex       | Use                                      |
|--------------------|-----------|------------------------------------------|
| --color-navy       | #000C52   | Primary — nav bar, headings, buttons     |
| --color-cream      | #FBF5E6   | Page background                          |
| --color-sky        | #43C4F4   | Accent — focus rings, section borders    |
| --color-purple     | #760FCA   | Secondary accent                         |
| --color-pink       | #FF658F   | Danger states, secondary accent          |
| --color-yellow     | #FFD500   | Secondary accent                         |
| --color-white      | #FFFFFF   | Card backgrounds, text on dark           |
| --color-b2b-navy   | #002551   | Hover state for navy buttons             |
| --color-grey-100   | #F5F5F5   | Inactive toggle backgrounds              |
| --color-grey-200   | #E5E7EB   | Dividers                                 |
| --color-grey-300   | #D1D5DB   | Input borders                            |
| --color-grey-500   | #6B7280   | Placeholder text, hints                  |
| --color-grey-700   | #374151   | Form labels                              |

---

## Typography

Font: **Plus Jakarta Sans**
Google Fonts import (already in brand.css):
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap')

| Weight    | Value | Use                          |
|-----------|-------|------------------------------|
| Regular   | 400   | Body text, hints             |
| Medium    | 500   | Nav links, secondary labels  |
| SemiBold  | 600   | Form labels, toggle buttons  |
| Bold      | 700   | Headings, nav title, buttons |
| ExtraBold | 800   | Page titles                  |

---

## Logo

The combined Flipp x Shopfully logo is used as the primary
brand mark across all Mockupfully 3.0 interfaces.

File location: assets/flipp-sf-logo.svg

Usage in navigation bar:
  <img src="assets/flipp-sf-logo.svg"
       alt="Flipp x Shopfully"
       style="height: 28px; width: auto; display: block;">

Rules:
- Always use the SVG file — never recreate the logo in HTML/CSS
- Height should be 28px in the nav bar, width auto
- Never place the logo on a coloured background other than
  navy (#000C52) or white (#FFFFFF)
- Never add a red dot, circle, or any other shape next to it
- The word "MOCKUPFULLY" may appear next to the logo as a
  product name label in uppercase, font-weight 700,
  color white, letter-spacing 1.5px
- Any page that uses .brand-nav must include the logo

Pages that must show the logo:
- form.html (Domination form)
- click2go-form.html (Click2Go form — to be built)
- index.html (Dashboard — to be updated)

---

## Tone
Joyful · Positive · Fun · Unification

---

## Component Classes (from brand.css)

### Navigation
- `.brand-nav` — sticky navy top bar
- `.brand-nav-title` — logo/title link
- `.brand-nav-link` — nav links

### Page layout
- `.brand-page` — max-width 900px centred page wrapper
- `.brand-page-title` — page heading (ExtraBold, navy)
- `.brand-card` — white card with shadow and rounded corners
- `.brand-divider` — horizontal rule

### Form structure
- `.form-section` — section group wrapper
- `.form-section-label` — uppercase section heading with sky underline
- `.form-group` — individual field wrapper
- `.form-label` — field label (SemiBold, grey-700)
- `.form-input` — text input
- `.form-select` — select dropdown
- `.form-textarea` — textarea
- `.form-hint` — helper text below a field

### Interactive
- `.toggle-group` — wrapper for toggle button set
- `.toggle-btn` — individual toggle button
- `.toggle-btn.active` — selected toggle state
- `.color-input` — colour picker input
- `.img-preview` — image thumbnail container
- `.img-preview.has-image` — state when image is loaded

### Buttons
- `.btn` — base button class (always combine with a variant)
- `.btn-primary` — navy filled (main actions: Save, Create)
- `.btn-secondary` — navy outlined (Cancel, Back)
- `.btn-danger` — pink outlined (Delete)
- `.btn-sm` — small size modifier

### Feedback
- `.alert` — base alert (always combine with a type)
- `.alert-success` — green success message
- `.alert-error` — red/pink error message
- `.alert-info` — sky blue info message

### Badges
- `.badge` — base badge (always combine with a colour)
- `.badge-navy` — dark navy pill
- `.badge-sky` — sky blue pill
- `.badge-cream` — cream pill with border

---

## Rules

1. Always use CSS variables — never hardcode hex values
2. Always link brand.css — never duplicate its rules in page CSS
3. Section labels must be uppercase with sky blue underline
4. Buttons must use the .btn system — no custom button styles
5. Focus states must use the sky blue ring (defined in brand.css)
6. Page background is always cream (#FBF5E6)
7. Cards are always white with the brand shadow
8. Font is always Plus Jakarta Sans — no other fonts in the UI

---

## Files that use brand.css
- form.html (Domination campaign form)
- click2go-form.html (Click2Go campaign form — to be built)
- index.html (Dashboard — to be updated)
