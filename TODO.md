# Admin Dashboard Enhancement TODO

## Task
- Created date and view of admin should also be updated
- Make further adjustment to the data — every data can be modified by admin
- Create fields for the admin
- Admin should be able to add data which automatically adds to user data without database

## Plan & Progress

### 1. API Changes
- [ ] `api/dashboard.js` — Add `createdAt`/`updatedAt` to assets, add delete/update actions for assets, shipments, contacts, signups, stats
- [ ] `api/users.js` — Add `addUser` action, `deleteUser` action, `updatedAt` on updates

### 2. Admin Dashboard UI
- [ ] `admin-dashboard.html` — Add created/updated columns, delete/edit buttons, new user creation form, shipment management, contacts/signups queue with delete, stats editor

### 3. Data Files
- [ ] `data/dashboard.json` — Inject timestamps into existing assets
- [ ] `data/users.json` — Ensure consistent schema

### 4. Client Portal & Scripts
- [ ] `client-portal.html` — Display timestamps for assets
- [ ] `js/__scripts.js` — Update normalizeState and fallback functions

### 5. Testing
- [ ] Verify admin can add/edit/delete all data types
- [ ] Verify client portal reflects changes
- [ ] Ensure JSON writes correctly in local dev mode

