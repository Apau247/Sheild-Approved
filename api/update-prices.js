import { execSync } from 'node:child_process';
import path from 'node:path';

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');
const UPDATE_SCRIPT = path.join(SCRIPTS_DIR, 'update-prices.js');

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Run the scraper synchronously (for API response)
    const output = execSync(`node ${UPDATE_SCRIPT}`, { 
      cwd: process.cwd(),
      encoding: 'utf8',
      timeout: 30000 // 30s timeout
    });

    return response.status(200).json({ 
      ok: true, 
      message: 'Prices updated successfully',
      output: output.trim()
    });
  } catch (error) {
    console.error('Price update failed:', error);
    return response.status(500).json({ 
      ok: false, 
      error: 'Price update failed',
      details: error.message 
    });
  }
}

