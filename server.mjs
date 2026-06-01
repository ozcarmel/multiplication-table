import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const root = resolve('dist');
const port = 5173;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
};

createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const filePath = requestedPath === '/' ? join(root, 'index.html') : join(root, requestedPath);
  const safePath = resolve(filePath);
  const finalPath = safePath.startsWith(root) && existsSync(safePath) ? safePath : join(root, 'index.html');
  const ext = extname(finalPath);

  response.writeHead(200, {
    'content-type': types[ext] ?? 'application/octet-stream',
    'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    pragma: 'no-cache',
    expires: '0',
  });
  createReadStream(finalPath).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Static multiplication table running at http://127.0.0.1:${port}/`);
});
