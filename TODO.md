# Iron Vault Security — Enhancement Plan

## Completed
- [x] Gathered and analyzed all relevant files
- [x] Confirmed plan with user (+ client-portal upgrade requirement)

## In Progress / To Do

### 1. Navigation & Button Styling Fixes
- [ ] Fix `.btn-request-access` and `.btn-secure-vault` with fixed colors + blended hover
- [ ] Add smooth transitions to nav actions (search-toggle, menu-toggle)
- [ ] Standardize nav markup across all HTML pages

### 2. Currency Conversion (£ → $)
- [ ] services.html: Replace all £ with $, adjust prices

### 3. Secure Homepage (index.html)
- [ ] Remove public tracking section with asset/signup forms
- [ ] Replace with clean "Secure Client Portal" CTA
- [ ] Keep general contact form only

### 4. Enrich Data (users.json + dashboard.json)
- [ ] Add 4–5 new unreal clients with full assetDetails & logistics
- [ ] Expand dashboard.json shipments/assets to 12+ records
- [ ] Ensure all currency = USD

### 5. Services Page Enhancements
- [ ] Add "Services at a Glance" tabs
- [ ] Expand tier descriptions with more detail
- [ ] Add realistic asset examples per tier

### 6. FULL client-portal.html Upgrade (NEW REQUIREMENT)
- [ ] Modern responsive HTML5 structure
- [ ] Professional dashboard layout with sidebar/navbar
- [ ] Embedded Google Maps with safe iframe attributes
- [ ] Security best practices (safe iframes, front-end protections)
- [ ] Performance optimization (lazy loading, minimal deps)
- [ ] Mobile responsiveness
- [ ] Clean, commented code
- [ ] Sections: dashboard, user info, activity/logs, contact/map
- [ ] Gold/black premium color scheme
- [ ] Subtle animations/hover effects

### 7. Validation
- [ ] Check all pages for broken nav links
- [ ] Confirm no £ symbols remain
- [ ] Verify homepage has no user-data forms
- [ ] Test client portal loads correctly

