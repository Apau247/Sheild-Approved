import { put, list } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localSettingsPath = path.join(__dirname, '..', 'data', 'site-settings.json');
const blobPrefix = 'site-settings/';

const defaultSettings = {
  siteName: 'Iron Vault Security',
  heroTitle: 'Secure Vault Storage in London',
  heroSubtitle: 'High-security vault storage, secure cargo handling, and discreet asset protection.',
  contactPhone: '+44 20 7946 0958',
  contactEmail: 'secure@ironvaultsecurity.co.uk',
  contactAddress: '45 Bankside Lane, London EC2V 7NQ, UK',
  portalHeadline: 'Client Access, Delivery Oversight, and Live Asset Control',
  portalCopy: 'Give clients a fast way to log in, create a profile, register new assets, and monitor secure cargo movements from one operations view.',
  footerNote: 'Iron Vault Security delivers protected storage, transport oversight, and premium client servicing.'
};

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const data = await readSettings();
    return response.status(200).json({ ok: true, data });
  }

  if (request.method === 'POST') {
    const payload = request.body?.payload || {};
    const current = await readSettings();
    const next = { ...current, ...payload };
    await writeSettings(next);
    return response.status(200).json({ ok: true, data: next });
  }

  response.setHeader('Allow', 'GET, POST');
  return response.status(405).json({ ok: false, error: 'Method not allowed.' });
}

async function readSettings() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: blobPrefix, limit: 1000 });
      const latestBlob = [...blobs].sort((left, right) => left.pathname.localeCompare(right.pathname)).pop();
      if (latestBlob?.url) {
        const blobResponse = await fetch(latestBlob.url);
        if (blobResponse.ok) {
          return { ...defaultSettings, ...(await blobResponse.json()) };
        }
      }
    } catch (error) {}
  }

  try {
    const file = await readFile(localSettingsPath, 'utf8');
    return { ...defaultSettings, ...JSON.parse(file) };
  } catch (error) {
    return defaultSettings;
  }
}

async function writeSettings(data) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const pathname = `${blobPrefix}${new Date().toISOString()}.json`;
    await put(pathname, JSON.stringify(data, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });
    return;
  }

  await mkdir(path.dirname(localSettingsPath), { recursive: true });
  await writeFile(localSettingsPath, JSON.stringify(data, null, 2));
}
