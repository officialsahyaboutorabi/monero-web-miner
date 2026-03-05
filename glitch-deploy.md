# Deploy WebSocket Proxy to Glitch (Free)

## Step 1: Create Glitch Project
1. Go to https://glitch.com
2. Click **New Project** → **hello-express**
3. Delete all default files

## Step 2: Upload Files
Create these files in Glitch:

### package.json
```json
{
  "name": "p2pool-ws-proxy",
  "version": "1.0.0",
  "description": "WebSocket to TCP proxy for P2Pool",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "ws": "^8.14.2"
  },
  "engines": {
    "node": "16.x"
  }
}
```

### server.js
```javascript
const WebSocket = require('ws');
const net = require('net');
const http = require('http');

const PORT = process.env.PORT || 3000;
const POOL_HOST = '0.tcp.au.ngrok.io';  // Your ngrok host
const POOL_PORT = 11526;                 // Your ngrok port

console.log('P2Pool WebSocket Proxy');
console.log('Target:', POOL_HOST + ':' + POOL_PORT);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('P2Pool WebSocket Proxy Running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New connection');
  
  const poolSocket = new net.Socket();
  poolSocket.connect(POOL_PORT, POOL_HOST, () => {
    console.log('Connected to pool');
  });
  
  ws.on('message', (data) => {
    if (poolSocket.readyState === 'open') {
      poolSocket.write(data);
    }
  });
  
  poolSocket.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
  
  ws.on('close', () => poolSocket.end());
  poolSocket.on('close', () => ws.close());
  ws.on('error', () => poolSocket.end());
  poolSocket.on('error', () => ws.close());
});

server.listen(PORT, () => {
  console.log('Proxy running on port', PORT);
});
```

## Step 3: Update Web Miner
In your web miner, set:
- **Pool**: `your-project.glitch.me`
- **Port**: `80` (or 443 for wss)

## Step 4: Glitch will auto-deploy!
Your proxy URL: `wss://your-project.glitch.me`
