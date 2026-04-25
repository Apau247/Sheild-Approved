import { list } from '@vercel/blob';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localUsersPath = path.join(__dirname, '..', 'data', 'users.json');
const blobPrefix = 'auth-users/';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

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
