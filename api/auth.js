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
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
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
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
    },
    {
      id: 'client-002',
      fullName: 'Lui Kyle Tan',
      email: 'luikyle@protonmail.com',
      password: 'LuiKyle2025!',
      phone: '+63 912 345 6789',
      company: 'Lui Family',
      country: 'Philippines',
      city: 'San Pablo',
      address: '384Q+Qm8, San Pablo City, Laguna, Philippines',
      preferredService: 'Private Vault',
      assetType: 'Gold',
      nextOfKinName: 'Abe Yna Lui',
      nextOfKinPhone: '+63 912 345 6790',
      nextOfKinRelationship: 'Next of Kin',
      nextOfKinEmail: 'Yanhans0@gmail.com',
      occupation: 'Police Officer',
      province: 'Laguna',
      clientStatus: 'Deceased',
      role: 'client',
      status: 'active',
      createdAt: '2026-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z'
    },
    {
      id: 'client-003',
      fullName: 'Marcus Thorne',
      email: 'm.thorne@silvergatefamily.com',
      password: 'ThorneVault2025!',
      phone: '+41 44 500 8901',
      company: 'Silvergate Family Office',
      country: 'Switzerland',
      city: 'Zurich',
      address: 'Bahnhofstrasse 42, 8001 Zurich, Switzerland',
      preferredService: 'Diamond and Jewellery Storage',
      assetType: 'Diamonds',
      nextOfKinName: 'Elara Thorne',
      nextOfKinPhone: '+41 44 500 8902',
      nextOfKinRelationship: 'Spouse',
      role: 'client',
      status: 'active',
      createdAt: '2026-05-10T00:00:00.000Z',
      updatedAt: '2026-05-10T00:00:00.000Z'
    },
    {
      id: 'client-004',
      fullName: 'Aisha Al-Rashid',
      email: 'a.alrashid@emiratetrust.ae',
      password: 'AishaSecure88!',
      phone: '+971 4 555 9912',
      company: 'Emirate Trust Holdings',
      country: 'United Arab Emirates',
      city: 'Dubai',
      address: 'DIFC Gate Village, Dubai, UAE',
      preferredService: 'Precious Metals Storage',
      assetType: 'Platinum',
      nextOfKinName: 'Omar Al-Rashid',
      nextOfKinPhone: '+971 4 555 9913',
      nextOfKinRelationship: 'Brother',
      role: 'client',
      status: 'active',
      createdAt: '2026-05-15T00:00:00.000Z',
      updatedAt: '2026-05-15T00:00:00.000Z'
    },
    {
      id: 'client-005',
      fullName: 'Elena Petrov',
      email: 'elena.petrov@novagold.ru',
      password: 'PetrovGold2025!',
      phone: '+7 495 777 3456',
      company: 'Nova Gold Imports',
      country: 'Russia',
      city: 'Moscow',
      address: 'Tverskaya Street 15, Moscow, Russia',
      preferredService: 'Private Vault Storage',
      assetType: 'Gold',
      nextOfKinName: 'Dmitri Petrov',
      nextOfKinPhone: '+7 495 777 3457',
      nextOfKinRelationship: 'Son',
      role: 'client',
      status: 'active',
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z'
    },
    {
      id: 'client-006',
      fullName: 'Phil Alan',
      email: 'philalan@protonmail.com',
      password: 'PhilAlan2025',
      phone: '+63 972 004 6789',
      company: 'Phil Alan Oil Industry',
      country: 'Philippines',
      city: 'Manila',
      address: '2450 Taft Avenue, Malate, Manila, Metro Manila, Philippines 1004',
      preferredService: 'Private Vault',
      assetType: 'Gold',
      nextOfKinName: 'Kendra Endra Mendes Scott',
      nextOfKinPhone: null,
      nextOfKinRelationship: 'Daughter',
      nextOfKinEmail: 'kendraloney664@gmail.com',
      occupation: 'Oil Industry Director',
      province: 'Manila',
      clientStatus: 'Deceased',
      role: 'client',
      status: 'active',
      createdAt: '2015-04-25T00:00:00.000Z',
      updatedAt: '2026-04-25T00:00:00.000Z',
      clientImage: 'images/id 006.jpeg',
      nextOfKinImage: 'images/new.jpeg',
      assetDetails: {
        assetType: 'Gold',
        quantity: '250 KG',
        consignmentValue: 23000000,
        currency: 'USD',
        monthlyCharges: 2200,
        dateIssued: '2019-08-20',
        securityCode: 'OBS102-US-GA',
        storageLocation: 'London'
      },
      logistics: {
        transportMethod: 'Armored Transport',
        vehicleType: 'Security Trucks',
        numberOfVehicles: 2,
        securityLevel: 'High',
        status: 'Secured and Monitored'
      }
    },
    {
      id: 'client-007',
      fullName: 'Yuki Tanaka',
      email: 'y.tanaka@tokyogems.jp',
      password: 'TokyoGem2025!',
      phone: '+81 3 4567 8901',
      company: 'Tokyo Gemstone Collectors',
      country: 'Japan',
      city: 'Tokyo',
      address: 'Ginza 4-12-1, Chuo-ku, Tokyo, Japan',
      preferredService: 'Diamond and Jewellery Storage',
      assetType: 'Rare Gemstones',
      nextOfKinName: 'Kenji Tanaka',
      nextOfKinPhone: '+81 3 4567 8902',
      nextOfKinRelationship: 'Husband',
      role: 'client',
      status: 'active',
      createdAt: '2026-06-10T00:00:00.000Z',
      updatedAt: '2026-06-10T00:00:00.000Z'
    },
    {
      id: 'client-008',
      fullName: 'Kwame Asante',
      email: 'k.asante@africangold.gh',
      password: 'AsanteGold88!',
      phone: '+233 24 456 7890',
      company: 'African Gold Export',
      country: 'Ghana',
      city: 'Accra',
      address: 'Airport City, Accra, Ghana',
      preferredService: 'Precious Metals Storage',
      assetType: 'Gold Bullion',
      nextOfKinName: 'Abena Asante',
      nextOfKinPhone: '+233 24 456 7891',
      nextOfKinRelationship: 'Sister',
      role: 'client',
      status: 'active',
      createdAt: '2026-06-15T00:00:00.000Z',
      updatedAt: '2026-06-15T00:00:00.000Z'
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
    const user = store.users.find((entry) => entry.email && entry.email.toLowerCase() === email);

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

    if (store.users.some((entry) => entry.email && entry.email.toLowerCase() === email)) {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
    nextOfKinEmail: user.nextOfKinEmail,
    occupation: user.occupation,
    province: user.province,
    clientStatus: user.clientStatus,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    clientImage: user.clientImage,
    nextOfKinImage: user.nextOfKinImage,
    assetDetails: user.assetDetails,
    logistics: user.logistics
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
