# Deploy to Railway (Free $5/month credit)

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

## Step 2: Create Project
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Create a new GitHub repo with these files:

### server.js
```javascript
const WebSocket = require('ws');
const net = require('net');
const http = require('http');

const PORT = process.env.PORT || 8080;
const POOL_HOST = process.env.POOL_HOST || '0.tcp.au.ngrok.io';
const POOL_PORT = process.env.POOL_PORT || 11526;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('P2Pool WS Proxy\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const pool = new net.Socket();
  pool.connect(POOL_PORT, POOL_HOST);
  
  ws.on('message', (data) => pool.write(data));
  pool.on('data', (data) => ws.send(data));
  ws.on('close', () => pool.end());
  pool.on('close', () => ws.close());
});

server.listen(PORT, () => {
  console.log('Proxy on port', PORT);
});
```

### package.json
```json
{
  "name": "p2pool-proxy",
  "version": "1.0.0",
  "dependencies": { "ws": "^8.14.2" },
  "scripts": { "start": "node server.js" }
}
```

### Dockerfile (optional but recommended)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

## Step 3: Deploy
Railway will auto-deploy when you push to GitHub.

## Step 4: Get URL
Railway gives you a URL like: `https://p2pool-proxy.up.railway.app`

In your web miner:
- **Pool**: `p2pool-proxy.up.railway.app`
- **Port**: `443` (for wss://)
