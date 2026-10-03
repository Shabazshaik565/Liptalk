const http = require('http');
const path = require('path');
// Load http-proxy from backend/node_modules
const httpProxy = require(path.join(__dirname, '..', 'backend', 'node_modules', 'http-proxy'));

const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
});

const BACKEND_TARGET = 'http://localhost:3000';
const FRONTEND_TARGET = 'http://localhost:8081';

const server = http.createServer((req, res) => {
  // Pass ngrok skip browser warning header to prevent ngrok warning interstitial
  res.setHeader('ngrok-skip-browser-warning', 'true');

  if (
    req.url.startsWith('/api') ||
    req.url.startsWith('/uploads') ||
    req.url.startsWith('/socket.io')
  ) {
    proxy.web(req, res, { target: BACKEND_TARGET }, (err) => {
      console.error('Backend proxy error:', err.message);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Backend unavailable');
      }
    });
  } else {
    proxy.web(req, res, { target: FRONTEND_TARGET }, (err) => {
      console.error('Frontend proxy error:', err.message);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Frontend unavailable');
      }
    });
  }
});

// Proxy WebSocket upgrade requests (for Socket.io & Metro HMR)
server.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/socket.io')) {
    proxy.ws(req, socket, head, { target: BACKEND_TARGET }, (err) => {
      console.error('Backend WebSocket proxy error:', err.message);
    });
  } else {
    proxy.ws(req, socket, head, { target: FRONTEND_TARGET }, (err) => {
      console.error('Metro WebSocket proxy error:', err.message);
    });
  }
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 LipTalk Unified Tunnel Proxy running on port ${PORT}`);
  console.log(`   • Routes /api, /socket.io, /uploads -> http://localhost:3000`);
  console.log(`   • Routes all frontend views -> http://localhost:8081`);
  console.log(`====================================================`);
});
