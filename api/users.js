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
        users: (data.users || []).map(function (user) {
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
            role: user.role,
            status: user.status,
            createdAt: user.createdAt
          };
        })
      }
    });
  }

  if (request.method === 'POST') {
    const action = request.body?.action;
    const payload = request.body?.payload || {};
    const data = await readUsersStore();

    if (action === 'updateUser') {
      const userId = String(payload.id || '').trim();
      const index = (data.users || []).findIndex((user) => user.id === userId);

      if (index < 0) {
        return response.status(404).json({ ok: false, error: 'User not found.' });
      }

      data.users[index] = {
        ...data.users[index],
        fullName: payload.fullName || data.users[index].fullName,
        email: payload.email || data.users[index].email,
        phone: payload.phone || data.users[index].phone,
        company: payload.company || data.users[index].company,
        country: payload.country || data.users[index].country,
        city: payload.city || data.users[index].city,
        address: payload.address || data.users[index].address,
        preferredService: payload.preferredService || data.users[index].preferredService,
        assetType: payload.assetType || data.users[index].assetType,
        status: payload.status || data.users[index].status
      };

      await writeUsersStore(data);

      return response.status(200).json({ ok: true, data });
    }

    return response.status(400).json({ ok: false, error: 'Unsupported user action.' });
  }

  response.setHeader('Allow', 'GET, POST');
  return response.status(405).json({ ok: false, error: 'Method not allowed.' });
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
