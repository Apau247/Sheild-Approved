import { put, list } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localDataPath = path.join(__dirname, '..', 'data', 'dashboard.json');
const blobPrefix = 'dashboard-state/';

const defaultState = {
  stats: {
    assetsSecured: 2500,
    vaultsInOperation: 1200,
    deliveriesCompleted: 300
  },
  shipments: [],
  assets: [],
  signups: [],
  contacts: []
};

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const data = await readState();
    return response.status(200).json({ ok: true, data, storage: storageMode() });
  }

  if (request.method === 'POST') {
    const action = request.body?.action;
    const payload = request.body?.payload || {};

    if (!action) {
      return response.status(400).json({ ok: false, error: 'Missing action.' });
    }

    const currentState = await readState();
    const nextState = applyAction(currentState, action, payload);
    await writeState(nextState);

    return response.status(200).json({ ok: true, data: nextState, storage: storageMode() });
  }

  response.setHeader('Allow', 'GET, POST');
  return response.status(405).json({ ok: false, error: 'Method not allowed.' });
}

function storageMode() {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : 'local-json';
}

async function readState() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: blobPrefix, limit: 1000 });
      const latestBlob = [...blobs].sort((left, right) => left.pathname.localeCompare(right.pathname)).pop();

      if (latestBlob?.url) {
        const blobResponse = await fetch(latestBlob.url);
        if (blobResponse.ok) {
          const blobJson = await blobResponse.json();
          return normalizeState(blobJson);
        }
      }
    } catch (error) {
      return readLocalState();
    }
  }

  return readLocalState();
}

async function writeState(data) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const pathname = `${blobPrefix}${new Date().toISOString()}.json`;
    await put(pathname, JSON.stringify(data, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });
    return;
  }

  await mkdir(path.dirname(localDataPath), { recursive: true });
  await writeFile(localDataPath, JSON.stringify(data, null, 2));
}

async function readLocalState() {
  try {
    const file = await readFile(localDataPath, 'utf8');
    return normalizeState(JSON.parse(file));
  } catch (error) {
    return normalizeState(defaultState);
  }
}

function applyAction(state, action, payload) {
  const next = normalizeState(state);

  if (action === 'addAsset') {
    next.assets.unshift({
      owner: payload.owner || 'Client Record',
      assetName: payload.assetName || 'Unspecified Asset',
      assetType: payload.assetType || 'Asset',
      quantity: payload.quantity || '1',
      vault: payload.vault || 'Pending Vault',
      status: payload.status || 'Stored'
    });
    next.stats.assetsSecured += 1;
    return next;
  }

  if (action === 'signup') {
    next.signups.unshift({
      fullName: payload.fullName || '',
      email: payload.email || '',
      phone: payload.phone || '',
      company: payload.company || '',
      needs: payload.needs || '',
      createdAt: new Date().toISOString()
    });
    return next;
  }

  if (action === 'contactRequest') {
    next.contacts.unshift({
      name: payload.name || '',
      email: payload.email || '',
      message: payload.message || '',
      createdAt: new Date().toISOString()
    });
    return next;
  }

  if (action === 'updateShipment') {
    const trackingId = String(payload.trackingId || '').trim().toUpperCase();
    const existingShipment = next.shipments.find((shipment) => shipment.trackingId === trackingId);
    const record = {
      trackingId,
      status: payload.status || 'Processing',
      origin: payload.origin || 'London, UK',
      destination: payload.destination || 'Client Destination',
      eta: payload.eta || 'Pending schedule',
      progress: clampNumber(payload.progress, 0, 100),
      contents: payload.contents || 'High-value cargo',
      current: payload.current || payload.origin || 'London, UK',
      courier: payload.courier || 'Iron Vault Secure Transport'
    };

    const index = next.shipments.findIndex((shipment) => shipment.trackingId === trackingId);

    if (index >= 0) {
      next.shipments[index] = {
        ...next.shipments[index],
        ...record
      };
    } else {
      next.shipments.unshift(record);
    }

    if (
      record.status.toLowerCase().includes('deliver') &&
      !String(existingShipment?.status || '').toLowerCase().includes('deliver')
    ) {
      next.stats.deliveriesCompleted += 1;
    }

    return next;
  }

  return next;
}

function normalizeState(data) {
  return {
    stats: {
      assetsSecured: Number(data?.stats?.assetsSecured ?? defaultState.stats.assetsSecured),
      vaultsInOperation: Number(data?.stats?.vaultsInOperation ?? defaultState.stats.vaultsInOperation),
      deliveriesCompleted: Number(data?.stats?.deliveriesCompleted ?? defaultState.stats.deliveriesCompleted)
    },
    shipments: Array.isArray(data?.shipments) ? data.shipments : [],
    assets: Array.isArray(data?.assets) ? data.assets : [],
    signups: Array.isArray(data?.signups) ? data.signups : [],
    contacts: Array.isArray(data?.contacts) ? data.contacts : []
  };
}

function clampNumber(value, minimum, maximum) {
  const number = Number.parseInt(value ?? '0', 10);
  return Math.max(minimum, Math.min(maximum, Number.isNaN(number) ? minimum : number));
}
