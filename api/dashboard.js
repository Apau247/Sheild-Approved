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
  assets: [
    {
      assetId: 'asset-seed-1',
      owner: 'Kenneth Johnson',
      assetName: 'Investment Gold Reserve',
      assetType: 'Bullion',
      quantity: '12 kg',
      vault: 'Vault A-12',
      storagePrice: '2500',
      status: 'Stored',
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
    },
    {
      assetId: 'asset-seed-2',
      owner: 'Benson Elio',
      assetName: 'Zurich Diamond Collection',
      assetType: 'Diamonds',
      quantity: '45 pcs',
      vault: 'Vault D-04',
      storagePrice: '4200',
      status: 'Verified',
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
    },
    {
      assetId: 'asset-seed-3',
      owner: 'Bright Archie',
      assetName: 'Estate Jewelry Set',
      assetType: 'Jewelry',
      quantity: '8 pcs',
      vault: 'Vault J-18',
      storagePrice: '1800',
      status: 'Awaiting Intake',
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
    },
    {
      assetId: 'asset-lkt-001',
      owner: 'Lui Kyle Tan',
      assetName: 'Philippine Gold Bullion Reserve',
      assetType: 'Gold',
      quantity: '8 kg',
      vault: 'Vault P-01',
      storagePrice: '3200',
      status: 'Stored',
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
    },
    {
      assetId: 'asset-lkt-002',
      owner: 'Lui Kyle Tan',
      assetName: 'Manila Gold Coins Collection',
      assetType: 'Gold',
      quantity: '150 pcs',
      vault: 'Vault P-02',
      storagePrice: '2100',
      status: 'Verified',
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
    },
    {
      assetId: 'asset-lkt-003',
      owner: 'Lui Kyle Tan',
      assetName: 'Laguna Estate Gold Bars',
      assetType: 'Gold',
      quantity: '5 kg',
      vault: 'Vault P-03',
      storagePrice: '1950',
      status: 'Stored',
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
    }
  ],
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
  const now = new Date().toISOString();

  if (action === 'addAsset') {
    next.assets.unshift({
      assetId: payload.assetId || `asset-${Date.now()}`,
      owner: payload.owner || 'Client Record',
      assetName: payload.assetName || 'Unspecified Asset',
      assetType: payload.assetType || 'Asset',
      quantity: payload.quantity || '1',
      vault: payload.vault || 'Pending Vault',
      storagePrice: payload.storagePrice || '0',
      status: payload.status || 'Stored',
      createdAt: now,
      updatedAt: now
    });
    next.stats.assetsSecured += 1;
    return next;
  }

  if (action === 'updateAsset') {
    const assetId = String(payload.assetId || '').trim();
    const index = next.assets.findIndex((asset) => asset.assetId === assetId);

    if (index >= 0) {
      next.assets[index] = {
        ...next.assets[index],
        owner: payload.owner || next.assets[index].owner,
        assetName: payload.assetName || next.assets[index].assetName,
        assetType: payload.assetType || next.assets[index].assetType,
        quantity: payload.quantity || next.assets[index].quantity,
        vault: payload.vault || next.assets[index].vault,
        storagePrice: payload.storagePrice || next.assets[index].storagePrice || '0',
        status: payload.status || next.assets[index].status,
        updatedAt: now
      };
    }

    return next;
  }

  if (action === 'deleteAsset') {
    const assetId = String(payload.assetId || '').trim();
    const index = next.assets.findIndex((asset) => asset.assetId === assetId);
    if (index >= 0) {
      next.assets.splice(index, 1);
      next.stats.assetsSecured = Math.max(0, next.stats.assetsSecured - 1);
    }
    return next;
  }

  if (action === 'signup') {
    next.signups.unshift({
      fullName: payload.fullName || '',
      email: payload.email || '',
      phone: payload.phone || '',
      company: payload.company || '',
      needs: payload.needs || '',
      createdAt: now
    });
    return next;
  }

  if (action === 'deleteSignup') {
    const email = String(payload.email || '').trim().toLowerCase();
    const createdAt = String(payload.createdAt || '').trim();
    next.signups = next.signups.filter((s) => {
      if (createdAt) return !(s.email.toLowerCase() === email && s.createdAt === createdAt);
      return s.email.toLowerCase() !== email;
    });
    return next;
  }

  if (action === 'contactRequest') {
    next.contacts.unshift({
      name: payload.name || '',
      email: payload.email || '',
      message: payload.message || '',
      createdAt: now
    });
    return next;
  }

  if (action === 'deleteContact') {
    const email = String(payload.email || '').trim().toLowerCase();
    const createdAt = String(payload.createdAt || '').trim();
    next.contacts = next.contacts.filter((c) => {
      if (createdAt) return !(c.email.toLowerCase() === email && c.createdAt === createdAt);
      return c.email.toLowerCase() !== email;
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
      courier: payload.courier || 'Iron Vault Secure Transport',
      updatedAt: now
    };

    const index = next.shipments.findIndex((shipment) => shipment.trackingId === trackingId);

    if (index >= 0) {
      next.shipments[index] = {
        ...next.shipments[index],
        ...record
      };
    } else {
      next.shipments.unshift({ ...record, createdAt: now });
    }

    if (
      record.status.toLowerCase().includes('deliver') &&
      !String(existingShipment?.status || '').toLowerCase().includes('deliver')
    ) {
      next.stats.deliveriesCompleted += 1;
    }

    return next;
  }

  if (action === 'deleteShipment') {
    const trackingId = String(payload.trackingId || '').trim().toUpperCase();
    const index = next.shipments.findIndex((s) => s.trackingId === trackingId);
    if (index >= 0) {
      const wasDelivered = String(next.shipments[index].status || '').toLowerCase().includes('deliver');
      next.shipments.splice(index, 1);
      if (wasDelivered) {
        next.stats.deliveriesCompleted = Math.max(0, next.stats.deliveriesCompleted - 1);
      }
    }
    return next;
  }

  if (action === 'updateStats') {
    if (payload.assetsSecured !== undefined) {
      next.stats.assetsSecured = Math.max(0, Number(payload.assetsSecured) || 0);
    }
    if (payload.vaultsInOperation !== undefined) {
      next.stats.vaultsInOperation = Math.max(0, Number(payload.vaultsInOperation) || 0);
    }
    if (payload.deliveriesCompleted !== undefined) {
      next.stats.deliveriesCompleted = Math.max(0, Number(payload.deliveriesCompleted) || 0);
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
    assets: Array.isArray(data?.assets) ? data.assets.map((asset, index) => ({
      assetId: asset.assetId || `asset-seed-${index + 1}`,
      owner: asset.owner || 'Client Record',
      assetName: asset.assetName || 'Unspecified Asset',
      assetType: asset.assetType || 'Asset',
      quantity: asset.quantity || '1',
      vault: asset.vault || 'Pending Vault',
      storagePrice: asset.storagePrice || '0',
      status: asset.status || 'Stored',
      createdAt: asset.createdAt || defaultState.assets[index]?.createdAt || new Date().toISOString(),
      updatedAt: asset.updatedAt || asset.createdAt || defaultState.assets[index]?.updatedAt || new Date().toISOString()
    })) : [],
    signups: Array.isArray(data?.signups) ? data.signups : [],
    contacts: Array.isArray(data?.contacts) ? data.contacts : []
  };
}

function clampNumber(value, minimum, maximum) {
  const number = Number.parseInt(value ?? '0', 10);
  return Math.max(minimum, Math.min(maximum, Number.isNaN(number) ? minimum : number));
}
