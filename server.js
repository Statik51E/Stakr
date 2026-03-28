// Serveur local simple pour Stakr
// Usage: node server.js
// Puis ouvrir http://localhost:3000 (ou l'IP locale pour le téléphone)

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.css':  'text/css',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const interfaces = require('os').networkInterfaces();
  let localIP = 'localhost';
  for (const iface of Object.values(interfaces)) {
    for (const addr of iface) {
      if (addr.family === 'IPv4' && !addr.internal) {
        localIP = addr.address;
        break;
      }
    }
  }

  console.log(`\n  ╔══════════════════════════════════════╗`);
  console.log(`  ║     🪶  STAKR — Corbeau Viking IA     ║`);
  console.log(`  ╠══════════════════════════════════════╣`);
  console.log(`  ║  PC:        http://localhost:${PORT}     ║`);
  console.log(`  ║  Mobile:    http://${localIP}:${PORT}  ║`);
  console.log(`  ╚══════════════════════════════════════╝\n`);
});
