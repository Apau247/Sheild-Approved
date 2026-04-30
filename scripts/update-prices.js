import puppeteer from 'puppeteer';
import axios from 'axios';
// import cheerio from 'cheerio'; // Disabled for now - generic puppeteer scraping
import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = path.resolve();
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const DASHBOARD_PATH = path.join(DATA_DIR, 'dashboard.json');
const PRICES_HISTORY_PATH = path.join(DATA_DIR, 'prices-history.json');

// Minerals to track: based on existing data (gold, platinum, silver, diamonds)
const MINERALS = {
  gold: { symbol: 'XAU', unit: 'oz', sites: ['gold', 'silver', 'platinum'] },
  platinum: { symbol: 'XPT', unit: 'oz', sites: ['platinum'] },
  silver: { symbol: 'XAG', unit: 'oz', sites: ['silver'] },
  diamonds: { symbol: 'DIA', unit: 'ct', sites: ['diamonds'] }
};

async function loadDashboard() {
  try {
    const data = await fs.readFile(DASHBOARD_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return { prices: {}, assets: [], shipments: [] };
  }
}

async function saveDashboard(data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DASHBOARD_PATH, JSON.stringify(data, null, 2));
}

async function loadHistory() {
  try {
    const data = await fs.readFile(PRICES_HISTORY_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveHistory(history) {
  await fs.writeFile(PRICES_HISTORY_PATH, JSON.stringify(history, null, 2));
}

function parsePrice(text) {
  const clean = text.replace(/[,$%]/g, '').replace(/per|\/|spot/gi, '');
  const match = clean.match(/(\\d+(?:\\.\\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

async function scrapeSite(browser, url, mineral) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    const prices = {};

    // Generic selectors for tables/prices
    const selectors = [
      'table td',
      '.price',
      '[data-price]',
      '.value',
      'span:contains("$")',
      '.spot-price'
    ];

    for (const sel of selectors) {
      const elements = await page.$$eval(sel, els => els.map(el => el.innerText));
      for (const text of elements) {
        const price = parsePrice(text);
        if (price && price > 0) {
          if (!prices[mineral]) prices[mineral] = [];
          prices[mineral].push(price);
        }
      }
    }

    // Site-specific for known sites
    if (url.includes('mineralprices.com')) {
      // Assume table with mineral names
      const specific = await page.$$eval('table tr', rows => 
        rows.map(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const name = cells[0].innerText.toLowerCase();
            const price = parsePrice(cells[1].innerText);
            return { name, price };
          }
        }).filter(Boolean)
      );
      specific.forEach(({name, price}) => {
        if (name.includes('gold') || name.includes('xau')) prices.gold = [price];
        if (name.includes('platinum') || name.includes('xpt')) prices.platinum = [price];
        // etc.
      });
    } else if (url.includes('tradingeconomics.com')) {
      // Chart data or table
      const chartData = await page.evaluate(() => {
        // Try to extract from charts/tables
        return [];
      });
    }

    await page.close();
    return prices;
  } catch (err) {
    console.error(`Scrape failed for ${url}:`, err.message);
    await page?.close();
    return {};
  }
}

async function scrapeAll() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const sites = [
    'https://mineralprices.com/',
    'https://www.miningideas.com/index-price_en.html',
    'https://www.mincom.gov.gh/',
    'https://tradingeconomics.com/commodities'
  ];

  const allPrices = {};
  for (const mineral in MINERALS) {
    allPrices[mineral] = [];
  }

  for (const site of sites) {
    const prices = await scrapeSite(browser, site, Object.keys(MINERALS));
    Object.entries(prices).forEach(([min, vals]) => {
      if (vals.length) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        allPrices[min].push(avg);
      }
    });
  }

  await browser.close();

  // Average across sites
  const currentPrices = {};
  for (const mineral in allPrices) {
    if (allPrices[mineral].length) {
      currentPrices[mineral] = {
        oz: parseFloat(allPrices[mineral].reduce((a, b) => a + b, 0) / allPrices[mineral].length).toFixed(2),
        unit: MINERALS[mineral].unit,
        timestamp: new Date().toISOString()
      };
    }
  }

  console.log('Scraped prices:', currentPrices);
  return currentPrices;
}

function calculateChange(current, previous) {
  if (!previous) return { change: 0, percent: 0 };
  const change = current - previous;
  const percent = (change / previous) * 100;
  return { change: Math.round(change * 100) / 100, percent: Math.round(percent * 100) / 100 };
}

function updateAssetsWithPrices(assets, prices) {
  return assets.map(asset => {
    let spot = prices.gold?.oz || 2700;
    if (asset.assetType.toLowerCase().includes('platinum')) spot = prices.platinum?.oz || 1050;
    if (asset.assetType.toLowerCase().includes('silver')) spot = prices.silver?.oz || 32;
    if (asset.assetType.toLowerCase().includes('diamond')) spot = prices.diamonds?.oz || 4200;

    const qtyNum = parseFloat(asset.quantity) || 1;
    const newValue = qtyNum * spot * 1.05; // 5% premium

    return {
      ...asset,
      spotPrice: spot,
      consignmentValue: Math.round(newValue),
      storagePrice: Math.round(newValue * 0.01), // 1% monthly est.
      updatedAt: new Date().toISOString()
    };
  });
}

async function main(isTest = false) {
  const dashboard = await loadDashboard();
  const history = await loadHistory();

  const previousPrices = dashboard.prices || {};
  const currentPrices = isTest ? { gold: {oz: 2750}, platinum: {oz: 1060} } : await scrapeAll();

  // Calculate changes
  const pricesWithChange = {};
  for (const [mineral, curr] of Object.entries(currentPrices)) {
    const prev = previousPrices[mineral];
    pricesWithChange[mineral] = {
      ...curr,
      ...calculateChange(parseFloat(curr.oz), parseFloat(prev?.oz))
    };
  }

  // Update history
  const now = new Date().toISOString();
  history[now] = pricesWithChange;
  await saveHistory(history);

  // Update dashboard
  dashboard.prices = pricesWithChange;
  dashboard.assets = updateAssetsWithPrices(dashboard.assets, pricesWithChange);
  // Update shipments contents with new spots
  dashboard.shipments = dashboard.shipments.map(s => ({
    ...s,
    contents: s.contents.replace(/\\$\\d+,\\d+/g, `$${parseFloat(pricesWithChange.gold?.oz || 2700).toLocaleString()}/oz spot`)
  }));

  await saveDashboard(dashboard);
  console.log('Dashboard updated with new prices.');
}

const [,, mode] = process.argv;
main(mode === 'test').catch(console.error);

export { scrapeAll, calculateChange, updateAssetsWithPrices };

