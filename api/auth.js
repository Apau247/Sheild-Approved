import { put, list } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localUsersPath = path.join(__dirname, '..', 'data', 'users.json');
const blobPrefix = 'auth-users/';

const defaultUsers = {
  users: [
    {
      id: 'admin-001',
      fullName: 'Vault Administrator',
      email: 'secure@ironvaultsecurity.co.uk',
      password: 'VaultAccess2025!',
      phone: '+44 20 7946 0958',
      company: 'Iron Vault Security',
      country: 'United Kingdom',
      city: 'London',
      address: '45 Bankside Lane, London EC2V 7NQ, UK',
      preferredService: 'Private Vault Storage',
      assetType: 'Administrative Access',
      nextOfKinName: 'Operations Director',
      nextOfKinPhone: '+44 20 7000 1111',
      nextOfKinRelationship: 'Operations',
      role: 'admin',
      status: 'active',
      createdAt: '2026-04-25T00:00:00.000Z'
    },
    {
      id: 'client-001',
      fullName: 'Valued Client',
      email: 'client@ironvaultsecurity.co.uk',
      password: 'ClientSecure99',
      phone: '+44 20 7000 0000',
      company: 'Private Client',
      country: 'United Kingdom',
      city: 'London',
      address: 'Client Address On File',
      preferredService: 'Secure Cargo Delivery',
      assetType: 'Jewellery',
      nextOfKinName: 'Family Representative',
      nextOfKinPhone: '+44 20 7000 2222',
      nextOfKinRelationship: 'Next of Kin',
      role: 'client',
      status: 'active',
      createdAt: '2026-04-25T00:00:00.000Z'
    }
  ]
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const action = request.body?.action;
  const payload = request.body?.payload || {};

  if (!action) {
    return response.status(400).json({ ok: false, error: 'Missing action.' });
  }

  const store = await readUsersStore();

  if (action === 'login') {
    const email = String(payload.email || '').trim().toLowerCase();
    const password = String(payload.password || '');
    const user = store.users.find((entry) => entry.email.toLowerCase() === email);

    if (!user || user.password !== password) {
      return response.status(401).json({ ok: false, error: 'Invalid email or password.' });
    }

    return response.status(200).json({
      ok: true,
      user: safeUser(user),
      redirectTo: user.role === 'admin' ? 'admin-dashboard.html' : 'client-portal.html'
    });
  }

  if (action === 'signup') {
    const fullName = String(payload.fullName || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();
    const password = String(payload.password || '');
    const phone = String(payload.phone || '').trim();
    const company = String(payload.company || '').trim();
    const country = String(payload.country || '').trim();
    const city = String(payload.city || '').trim();
    const address = String(payload.address || '').trim();
    const preferredService = String(payload.preferredService || '').trim();
    const assetType = String(payload.assetType || '').trim();
    const nextOfKinName = String(payload.nextOfKinName || '').trim();
    const nextOfKinPhone = String(payload.nextOfKinPhone || '').trim();
    const nextOfKinRelationship = String(payload.nextOfKinRelationship || '').trim();
    const needs = String(payload.needs || '').trim();

    if (!fullName || !email || !password || !phone || !country || !city || !address || !preferredService || !assetType || !nextOfKinName || !nextOfKinPhone || !nextOfKinRelationship) {
      return response.status(400).json({ ok: false, error: 'Please complete all required signup details.' });
    }

    if (store.users.some((entry) => entry.email.toLowerCase() === email)) {
      return response.status(409).json({ ok: false, error: 'An account with this email already exists.' });
    }

    const user = {
      id: `client-${Date.now()}`,
      fullName,
      email,
      password,
      phone,
      company,
      country,
      city,
      address,
      preferredService,
      assetType,
      nextOfKinName,
      nextOfKinPhone,
      nextOfKinRelationship,
      needs,
      role: 'client',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    store.users.unshift(user);
    await writeUsersStore(store);

    return response.status(201).json({
      ok: true,
      user: safeUser(user),
      redirectTo: 'client-portal.html'
    });
  }

  return response.status(400).json({ ok: false, error: 'Unsupported auth action.' });
}

function safeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    company: user.company,
    country: user.country,
    city: user.city,
    address: user.address,
    preferredService: user.preferredService,
    assetType: user.assetType,
    nextOfKinName: user.nextOfKinName,
    nextOfKinPhone: user.nextOfKinPhone,
    nextOfKinRelationship: user.nextOfKinRelationship,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt
  };
}

async function readUsersStore() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: blobPrefix, limit: 1000 });
      const latestBlob = [...blobs].sort((left, right) => left.pathname.localeCompare(right.pathname)).pop();
      if (latestBlob?.url) {
        const blobResponse = await fetch(latestBlob.url);
        if (blobResponse.ok) {
          return normalizeStore(await blobResponse.json());
        }
      }
    } catch (error) {
      return readLocalUsersStore();
    }
  }

  return readLocalUsersStore();
}

async function writeUsersStore(data) {
  const normalized = normalizeStore(data);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const pathname = `${blobPrefix}${new Date().toISOString()}.json`;
    await put(pathname, JSON.stringify(normalized, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });
    return;
  }

  await mkdir(path.dirname(localUsersPath), { recursive: true });
  await writeFile(localUsersPath, JSON.stringify(normalized, null, 2));
}

async function readLocalUsersStore() {
  try {
    const file = await readFile(localUsersPath, 'utf8');
    return normalizeStore(JSON.parse(file));
  } catch (error) {
    return normalizeStore(defaultUsers);
  }
}

function normalizeStore(data) {
  return {
    users: Array.isArray(data?.users) ? data.users : defaultUsers.users
  };
}
