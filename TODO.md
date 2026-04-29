# Price Update System - Implementation TODO

## Status: [x] 33% Complete (Deps + Scraper ✅)

### Step 1: Setup Dependencies [x]
- [ ] `npm install puppeteer axios cheerio node-cron`
- [ ] Test: `npm run scrape-test`

### Step 2: Create Price Scraper [x]
- [x] `scripts/update-prices.js` - Node scraper for 4 sites
- [x] `data/prices-history.json` - Init empty history
- [x] Test scraper locally

### Step 3: Update Data Structure [ ]
- [ ] `data/dashboard.json` - Add `prices` object (gold/platinum/silver/diamonds)
- [ ] Extract spot prices to assets/shipments

### Step 4: API Endpoints [ ]
- [ ] `api/update-prices.js` - Vercel endpoint to trigger scrape
- [ ] Update `api/dashboard.js` to include prices

### Step 5: UI Updates [ ]
- [ ] `admin-dashboard.html` - Charts section + price tables + update button
- [ ] `client-portal.html` - Add price charts + indicators
- [ ] `js/admin.js` - Update button handler + rise/fall display

### Step 6: CSS & Polish [ ]
- [ ] `css/__custom.css` - Price rise/fall styles + chart responsive

### Step 7: Test & Deploy [ ]
- [ ] Local test full flow
- [ ] Deploy Vercel
- [ ] Setup cron for auto-updates

**Next Action**: Add client portal charts + final testing.

**Progress Tracking**: Update this file after each step completion.

