# Iron Vault Security — Platform Upgrade TODO

## Phase 1: PWA Foundation
- [x] Create `manifest.json`
- [x] Create `sw.js` (service worker)
- [x] Update `index.html` with manifest link and SW registration
- [x] Add theme-color meta to all pages

## Phase 2: Audit Logging API
- [x] Create `api/audit.js`
- [x] Create `data/audit.json`
- [x] Integrate audit logging into `api/dashboard.js`

## Phase 3: Enhanced Admin Dashboard
- [x] Create `js/admin-dashboard.js`
- [x] Rewrite `admin-dashboard.html` with modals, audit log, reports

## Phase 4: Enhanced Client Portal
- [x] Create `js/client-portal.js`
- [x] Rewrite `client-portal.html` with fixed JS, premium display

## Phase 5: Service Transparency & Gold Service
- [x] Update `services.html` with transparent descriptions + Gold Service tier
- [x] Update `about.html` with company credentials

## Phase 6: Security & Validation
- [x] Enhance `api/dashboard.js` with input validation
- [x] Enhance `api/users.js` with password/email validation
- [x] Add session timeout to `js/nav.js`

## Phase 7: Responsive Polish
- [x] Update `css/responsive.css` for modals and tables on mobile

