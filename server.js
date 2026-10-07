import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createNovaResponse, validateNovaRequest } from './api/nova.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(JSON.stringify(payload));
}

async function serveFile(res, filePath) {
  try {
    const fileContent = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[extension] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-store'
    });
    res.end(fileContent);
  } catch (error) {
    res.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', 'http://localhost');
  const pathname = requestUrl.pathname;

  if (pathname === '/api/nova') {
    if (req.method !== 'POST') {
      return sendJson(res, 405, {
        success: false,
        error: 'Only POST requests are supported for Nova.',
        metadata: {
          status: 'method_not_allowed',
          backendConnected: false
        }
      });
    }

    let rawBody = '';

    req.on('data', (chunk) => {
      rawBody += String(chunk);
    });

    req.on('end', () => {
      try {
        const parsed = rawBody ? JSON.parse(rawBody) : {};
        const validation = validateNovaRequest(parsed);

        if (!validation.ok) {
          return sendJson(res, 400, {
            success: false,
            error: validation.error,
            conversationId: typeof parsed?.conversationId === 'string' ? parsed.conversationId : null,
            metadata: {
              status: 'invalid_request',
              backendConnected: false
            }
          });
        }

        return sendJson(res, 200, createNovaResponse(parsed));
      } catch (error) {
        return sendJson(res, 400, {
          success: false,
          error: 'The request body could not be parsed as JSON.',
          metadata: {
            status: 'invalid_request',
            backendConnected: false
          }
        });
      }
    });

    return;
  }

  let filePath = pathname;

  if (pathname === '/') {
    filePath = path.join(__dirname, 'index.html');
  } else if (pathname === '/app' || pathname === '/app/') {
    filePath = path.join(__dirname, 'app', 'index.html');
  } else {
    filePath = path.join(__dirname, pathname.replace(/^\/+/, ''));
  }

  try {
    const resolvedPath = path.resolve(filePath);
    const rootPath = path.resolve(__dirname);

    if (!resolvedPath.startsWith(rootPath)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    await serveFile(res, resolvedPath);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Nova development server running at http://localhost:${PORT}`);
});
