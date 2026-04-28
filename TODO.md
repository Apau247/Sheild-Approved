# Color Standardization TODO — Gold / Black / White Only

## Goal
Remove all non-palette colors (steel blue, green, red, yellow, gray) and standardize to only:
- **Gold**: `#d4af37` (`var(--color-accent-gold)`)
- **Black**: `#1a1a1a` (`var(--color-primary-dark)`)
- **White**: `#ffffff` (`var(--color-white)`)

## Steps

### Phase 1: CSS Variable Files
- [ ] `css/__colors_default.css` — Remove steel/green vars, update text/bg colors
- [ ] `css/__colors_dark.css` — Remove steel/green vars, update dark scheme colors

### Phase 2: Main Stylesheet
- [ ] `css/style.css` — Replace all steel blue, green, red, gray, cream colors

### Phase 3: HTML Files (Inline Styles)
- [ ] `admin-dashboard.html` — Fix badge colors, modal styles
- [ ] `client-portal.html` — Fix button colors, borders, backgrounds
- [ ] `services.html` — Fix tier badges, checkmarks, backgrounds
- [ ] `about.html` — Fix any inline colors
- [ ] `security-compliance.html` — Fix any inline colors

### Phase 4: JavaScript Files
- [ ] `js/app.js` — Fix validation border color
- [ ] `js/admin.js` — Verify generated HTML uses CSS vars only

### Phase 5: Verification
- [ ] Search for remaining non-palette hex codes across project
- [ ] Spot-check key pages for visual consistency

