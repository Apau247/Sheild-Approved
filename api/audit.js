import { put, list } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localAuditPath = path.join(__dirname, '..', 'data', 'audit.json');
const blobPrefix = 'audit-logs/';

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const data = await readAuditStore();
    return response.status(200).json({ ok: true, logs: data.logs || [] });
  }

  if (request.method === 'POST') {
    const payload = request.body?.payload || {};
    if (!payload.action) {
      return response.status(400).json({ ok: false, error: 'Missing action.' });
    }

    const entry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      actor: payload.actor || 'Unknown',
      action: payload.action,
      target: payload.target || '',
      oldValue: payload.oldValue || null,
      newValue: payload.newValue || null,
      ip: request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown'
    };

    const data = await readAuditStore();
    data.logs.unshift(entry);
    if (data.logs.length > 5000) data.logs = data.logs.slice(0, 5000);

    await writeAuditStore(data);
    return response.status(201).json({ ok: true, entry });
  }

  response.setHeader('Allow', 'GET, POST');
  return response.status(405).json({ ok: false, error: 'Method not allowed.' });
}

async function readAuditStore() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: blobPrefix, limit: 1000 });
      const latestBlob = [...blobs].sort((a, b) => a.pathname.localeCompare(b.pathname)).pop();
      if (latestBlob?.url) {
        const res = await fetch(latestBlob.url);
        if (res.ok) return await res.json();
      }
    } catch (e) {}
  }
  try {
    return JSON.parse(await readFile(localAuditPath, 'utf8'));
  } catch (e) {
    return { logs: [] };
  }
}

async function writeAuditStore(data) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(`${blobPrefix}${new Date().toISOString()}.json`, JSON.stringify(data, null, 2), {
      access: 'public', addRandomSuffix: false, contentType: 'application/json'
    });
    return;
  }
  await mkdir(path.dirname(localAuditPath), { recursive: true });
  await writeFile(localAuditPath, JSON.stringify(data, null, 2));
}

