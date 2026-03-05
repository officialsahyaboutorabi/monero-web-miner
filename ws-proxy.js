/**
 * WebSocket-to-TCP Proxy for Monero Web Miner
 * Run this on your server to allow browser miners to connect to your pool
 * 
 * Usage: node ws-proxy.js
 * Then point web miners to: ws://YOUR_SERVER:8080
 */

const WebSocket = require('ws');
const net = require('net');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const WS_PORT = process.env.PORT || 8080;
const POOL_HOST = process.env.POOL_HOST || '127.0.0.1';
const POOL_PORT = process.env.POOL_PORT || 3333;

console.log('=== Monero Web Miner - WebSocket Proxy ===');
console.log('This proxy allows browser miners to connect to your TCP pool');
console.log('');
console.log('Configuration:');
console.log('  WebSocket Port: ' + WS_PORT);
console.log('  Target Pool: ' + POOL_HOST + ':' + POOL_PORT);
console.log('');

// Create HTTP server for static files and WebSocket upgrade
const server = http.createServer((req, res) => {
    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log('[' + new Date().toISOString() + '] New connection from ' + clientIp);
    
    // Connect to the actual pool
    const poolSocket = new net.Socket();
    
    poolSocket.connect(POOL_PORT, POOL_HOST, () => {
        console.log('  Connected to pool ' + POOL_HOST + ':' + POOL_PORT);
    });
    
    // WebSocket -> Pool
    ws.on('message', (data) => {
        if (poolSocket.readyState === 'open') {
            poolSocket.write(data);
        }
    });
    
    // Pool -> WebSocket
    poolSocket.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });
    
    // Handle disconnections
    ws.on('close', () => {
        console.log('  Client disconnected');
        poolSocket.end();
    });
    
    poolSocket.on('close', () => {
        console.log('  Pool connection closed');
        ws.close();
    });
    
    ws.on('error', (err) => {
        console.log('  WebSocket error: ' + err.message);
        poolSocket.end();
    });
    
    poolSocket.on('error', (err) => {
        console.log('  Pool error: ' + err.message);
        ws.close();
    });
});

server.listen(WS_PORT, () => {
    console.log('WebSocket proxy server running on port ' + WS_PORT);
    console.log('');
    console.log('Web miners can connect to:');
    console.log('  ws://localhost:' + WS_PORT + ' (local)');
    console.log('  ws://YOUR_SERVER_IP:' + WS_PORT + ' (network)');
    console.log('');
    console.log('Web interface available at:');
    console.log('  http://localhost:' + WS_PORT);
    console.log('');
    console.log('Press Ctrl+C to stop');
});
