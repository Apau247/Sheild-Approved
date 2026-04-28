import { put, list } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localUsersPath = path.join(__dirname, '..', 'data', 'users.json');
const blobPrefix = 'auth-users/';

function sanitizeString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function sanitizeEmail(value) {
  if (!value) return null;
  return String(value).trim().toLowerCase();
}

async function logAudit(payload) {
  try {
    await fetch(
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000') + '/api/audit',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload })
      }
    );
  } catch (e) {
    // Audit logging is best-effort
  }
}

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
    const now = new Date().toISOString();

    if (action === 'createUser') {
      const user = {
        id: payload.id || `client-${Date.now()}`,
        fullName: sanitizeString(payload.fullName),
        email: sanitizeEmail(payload.email),
        password: payload.password || 'TempPass123!',
        phone: sanitizeString(payload.phone),
        company: sanitizeString(payload.company),
        country: sanitizeString(payload.country),
        city: sanitizeString(payload.city),
        address: sanitizeString(payload.address),
        preferredService: sanitizeString(payload.preferredService),
        assetType: sanitizeString(payload.assetType),
        nextOfKinName: sanitizeString(payload.nextOfKinName),
        nextOfKinPhone: sanitizeString(payload.nextOfKinPhone),
        nextOfKinRelationship: sanitizeString(payload.nextOfKinRelationship),
        nextOfKinEmail: sanitizeEmail(payload.nextOfKinEmail),
        occupation: sanitizeString(payload.occupation),
        province: sanitizeString(payload.province),
        clientStatus: sanitizeString(payload.clientStatus),
        role: payload.role || 'client',
        status: payload.status || 'active',
        createdAt: now,
        updatedAt: now
      };

      if (!user.fullName) {
        return response.status(400).json({ ok: false, error: 'Full name is required.' });
      }

      if (user.email && (data.users || []).some((entry) => entry.email && entry.email.toLowerCase() === user.email)) {
        return response.status(409).json({ ok: false, error: 'A user with this email already exists.' });
      }

      data.users.unshift(user);
      await writeUsersStore(data);
      await logAudit({
        actor: payload.actor || 'admin',
        action: 'users:createUser',
        target: user.id,
        oldValue: null,
        newValue: safeUser(user)
      });
      return response.status(201).json({ ok: true, data: { users: data.users.map(safeUser) } });
    }

    if (action === 'updateUser') {
      const userId = sanitizeString(payload.id);
      const index = (data.users || []).findIndex((user) => user.id === userId);

      if (index < 0) {
        return response.status(404).json({ ok: false, error: 'User not found.' });
      }

      const oldUser = safeUser(data.users[index]);

      data.users[index] = {
        ...data.users[index],
        fullName: sanitizeString(payload.fullName) || data.users[index].fullName,
        email: payload.email !== undefined ? sanitizeEmail(payload.email) : data.users[index].email,
        phone: sanitizeString(payload.phone) || data.users[index].phone,
        company: sanitizeString(payload.company) || data.users[index].company,
        country: sanitizeString(payload.country) || data.users[index].country,
        city: sanitizeString(payload.city) || data.users[index].city,
        address: sanitizeString(payload.address) || data.users[index].address,
        preferredService: sanitizeString(payload.preferredService) || data.users[index].preferredService,
        assetType: sanitizeString(payload.assetType) || data.users[index].assetType,
        nextOfKinName: sanitizeString(payload.nextOfKinName) || data.users[index].nextOfKinName,
        nextOfKinPhone: payload.nextOfKinPhone !== undefined ? sanitizeString(payload.nextOfKinPhone) : data.users[index].nextOfKinPhone,
        nextOfKinRelationship: sanitizeString(payload.nextOfKinRelationship) || data.users[index].nextOfKinRelationship,
        nextOfKinEmail: payload.nextOfKinEmail !== undefined ? sanitizeEmail(payload.nextOfKinEmail) : data.users[index].nextOfKinEmail,
        occupation: sanitizeString(payload.occupation) || data.users[index].occupation,
        province: sanitizeString(payload.province) || data.users[index].province,
        clientStatus: sanitizeString(payload.clientStatus) || data.users[index].clientStatus,
        role: payload.role || data.users[index].role,
        status: payload.status || data.users[index].status,
        clientImage: payload.clientImage !== undefined ? payload.clientImage : data.users[index].clientImage,
        nextOfKinImage: payload.nextOfKinImage !== undefined ? payload.nextOfKinImage : data.users[index].nextOfKinImage,
        assetDetails: payload.assetDetails !== undefined ? payload.assetDetails : data.users[index].assetDetails,
        logistics: payload.logistics !== undefined ? payload.logistics : data.users[index].logistics,
        updatedAt: now
      };

      if (payload.password) {
        data.users[index].password = payload.password;
      }

      await writeUsersStore(data);
      await logAudit({
        actor: payload.actor || 'admin',
        action: 'users:updateUser',
        target: userId,
        oldValue: oldUser,
        newValue: safeUser(data.users[index])
      });
      return response.status(200).json({ ok: true, data: { users: data.users.map(safeUser) } });
    }

    if (action === 'deleteUser') {
      const userId = sanitizeString(payload.id);
      const index = (data.users || []).findIndex((user) => user.id === userId);

      if (index < 0) {
        return response.status(404).json({ ok: false, error: 'User not found.' });
      }

      const deletedUser = safeUser(data.users[index]);
      data.users.splice(index, 1);
      await writeUsersStore(data);
      await logAudit({
        actor: payload.actor || 'admin',
        action: 'users:deleteUser',
        target: userId,
        oldValue: deletedUser,
        newValue: null
      });
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
