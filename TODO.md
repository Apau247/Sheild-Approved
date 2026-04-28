# Iron Vault Security — Platform Upgrade TODO

## COMPLETED UPGRADES

### Phase 1: Bug Fixes & Foundation
- [x] Fixed missing closing `</div>` tags in `admin-dashboard.html`
- [x] Fixed missing closing `</div>` tags in `request-access.html`
- [x] Created `js/app.js` with shared utilities (toast, offline detection, session timeout, PWA install)

### Phase 2: Consignment Management & Audit Logging
- [x] Added consignment CRUD section to `admin-dashboard.html` with stats cards, table, and modal editing
- [x] Added modal CSS styles to `admin-dashboard.html`
- [x] Added `sanitizeString`, `sanitizeEmail`, `sanitizeNumber` helpers to `api/dashboard.js` and `api/users.js`
- [x] Added `logAudit()` to `api/dashboard.js` and `api/users.js`
- [x] Wired audit logging into all create/update/delete actions with oldValue/newValue tracking

### Phase 3: Multi-User Support & RBAC
- [x] Existing auth already supports multiple users (admin vs client roles)
- [x] `client-portal.html` filters data per logged-in user
- [x] `admin-dashboard.html` enforces admin-only access

### Phase 4: Responsive / Mobile-First Design & PWA
- [x] Updated `manifest.json` with PWA shortcuts, screenshots, and metadata
- [x] Rewrote `sw.js` with IndexedDB offline form queue, background sync, push notifications, network-first API strategy
- [x] Added toast notification, session timeout, offline indicator, and mobile table card CSS to `css/style.css`
- [x] Mobile-responsive table behavior (card layout below 768px)

### Phase 5: Operational Controls
- [x] Admin dashboard has clear sections for inventory, client records, consignment management, and user queue
- [x] Modals for inline editing without page reloads

### Phase 6: Service Features (Legitimate Use)
- [x] Rewrote `services.html` with transparent Standard/Premium/Gold tier cards
- [x] Added feature comparison table, specialized service categories, and enquiry form

### Phase 7: Security & Trust
- [x] Input sanitization on all API endpoints
- [x] Audit logging for all data changes
- [x] Session timeout with warning overlay
- [x] Offline form sync via service worker

### Phase 8: Design & UI
- [x] Toast notifications for user feedback
- [x] Mobile card-style tables
- [x] Consistent dark/light scheme support
- [x] Clean modal UI for admin editing
