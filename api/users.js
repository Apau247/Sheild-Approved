import { put, list } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localUsersPath = path.join(__dirname, '..', 'data', 'users.json');
const blobPrefix = 'auth-users/';

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const data = await readUsersStore();
    return response.status(200).json({
      ok: true,
      data: {
        users: (data.users || []).map(safeUser)
      }
    });
  }

  if (request.method === 'POST') {
    const action = request.body?.action;
    const payload = request.body?.payload || {};
    const data = await readUsersStore();

    if (action === 'createUser') {
      const user = {
        id: payload.id || `client-${Date.now()}`,
        fullName: payload.fullName || '',
        email: String(payload.email || '').trim().toLowerCase(),
        password: payload.password || 'TempPass123!',
        phone: payload.phone || '',
        company: payload.company || '',
        country: payload.country || '',
        city: payload.city || '',
        address: payload.address || '',
        preferredService: payload.preferredService || '',
        assetType: payload.assetType || '',
        nextOfKinName: payload.nextOfKinName || '',
        nextOfKinPhone: payload.nextOfKinPhone || '',
        nextOfKinRelationship: payload.nextOfKinRelationship || '',
        role: payload.role || 'client',
        status: payload.status || 'active',
        createdAt: new Date().toISOString()
      };

      if (!user.fullName || !user.email) {
        return response.status(400).json({ ok: false, error: 'Full name and email are required.' });
      }

      if ((data.users || []).some((entry) => entry.email.toLowerCase() === user.email)) {
        return response.status(409).json({ ok: false, error: 'A user with this email already exists.' });
      }

      data.users.unshift(user);
      await writeUsersStore(data);
      return response.status(201).json({ ok: true, data: { users: data.users.map(safeUser) } });
    }

    if (action === 'updateUser') {
      const userId = String(payload.id || '').trim();
      const index = (data.users || []).findIndex((user) => user.id === userId);

      if (index < 0) {
        return response.status(404).json({ ok: false, error: 'User not found.' });
      }

      data.users[index] = {
        ...data.users[index],
        fullName: payload.fullName || data.users[index].fullName,
        email: String(payload.email || data.users[index].email).trim().toLowerCase(),
        phone: payload.phone || data.users[index].phone,
        company: payload.company || data.users[index].company,
        country: payload.country || data.users[index].country,
        city: payload.city || data.users[index].city,
        address: payload.address || data.users[index].address,
        preferredService: payload.preferredService || data.users[index].preferredService,
        assetType: payload.assetType || data.users[index].assetType,
        nextOfKinName: payload.nextOfKinName || data.users[index].nextOfKinName,
        nextOfKinPhone: payload.nextOfKinPhone || data.users[index].nextOfKinPhone,
        nextOfKinRelationship: payload.nextOfKinRelationship || data.users[index].nextOfKinRelationship,
        role: payload.role || data.users[index].role,
        status: payload.status || data.users[index].status
      };

      if (payload.password) {
        data.users[index].password = payload.password;
      }

      await writeUsersStore(data);
      return response.status(200).json({ ok: true, data: { users: data.users.map(safeUser) } });
    }

    return response.status(400).json({ ok: false, error: 'Unsupported user action.' });
  }

  response.setHeader('Allow', 'GET, POST');
  return response.status(405).json({ ok: false, error: 'Method not allowed.' });
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
          return await blobResponse.json();
        }
      }
    } catch (error) {}
  }

  try {
    const file = await readFile(localUsersPath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    return { users: [] };
  }
}

async function writeUsersStore(data) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const pathname = `${blobPrefix}${new Date().toISOString()}.json`;
    await put(pathname, JSON.stringify(data, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });
    return;
  }

  await mkdir(path.dirname(localUsersPath), { recursive: true });
  await writeFile(localUsersPath, JSON.stringify(data, null, 2));
}
