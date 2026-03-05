# Deploy WebSocket Proxy - Multiple Free Options

Since GitHub Pages only serves static files, you need to host the WebSocket proxy elsewhere. Here are free options:

---

## 🚀 Option 1: Render.com (Easiest)

**Free tier**: Web services never sleep

### Step 1: Create GitHub Repo
Create a new repo with these files:

```javascript
// server.js
const WebSocket = require('ws');
const net = require('net');
const http = require('http');

const PORT = process.env.PORT || 10000;
const POOL_HOST = process.env.POOL_HOST || '0.tcp.au.ngrok.io';
const POOL_PORT = parseInt(process.env.POOL_PORT) || 11526;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('P2Pool WebSocket Proxy Running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New miner connected');
  const pool = new net.Socket();
  
  pool.connect(POOL_PORT, POOL_HOST, () => {
    console.log('Connected to P2Pool');
  });
  
  ws.on('message', (data) => {
    if (pool.readyState === 'open') pool.write(data);
  });
  
  pool.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  });
  
  ws.on('close', () => {
    console.log('Miner disconnected');
    pool.end();
  });
  
  pool.on('close', () => ws.close());
});

server.listen(PORT, () => {
  console.log('Proxy listening on port', PORT);
});
```

```json
// package.json
{
  "name": "p2pool-ws-proxy",
  "version": "1.0.0",
  "dependencies": { "ws": "^8.14.2" },
  "scripts": { "start": "node server.js" }
}
```

### Step 2: Deploy to Render
1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Name**: `p2pool-proxy`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `POOL_HOST`: `0.tcp.au.ngrok.io`
   - `POOL_PORT`: `11526`
6. Click **Create Web Service**

### Step 3: Get URL
Your proxy will be at: `wss://p2pool-proxy.onrender.com`

### Step 4: Update Web Miner
In the web miner page:
- **Pool**: `p2pool-proxy.onrender.com`
- **Port**: `443` (wss:// default)

---

## 🚀 Option 2: Fly.io (Free $5 credit)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Create app
mkdir p2pool-proxy && cd p2pool-proxy
cat > server.js << 'EOF'
// [same server.js as above]
EOF

cat > package.json << 'EOF'
{"dependencies":{"ws":"^8.14.2"},"scripts":{"start":"node server.js"}}
EOF

cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
EOF

# Deploy
fly launch
fly secrets set POOL_HOST=0.tcp.au.ngrok.io POOL_PORT=11526
fly deploy
```

---

## 🚀 Option 3: Railway.app (Free $5 credit)

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Use same files as Render option
4. Add environment variables
5. Deploy

---

## 🚀 Option 4: Run on Your Computer (No Deployment)

Just run the proxy on your local machine:

```bash
cd ~/Documents/p2pool-mining/web-miner
npm install
./start-proxy.sh
```

Then in web miner:
- **Pool**: `192.168.192.138`
- **Port**: `8080`

**Limitation**: Only works on your local network.

---

## 🔌 Web Miner Configuration

After deploying proxy to any service:

| Service | Pool Address | Port |
|---------|--------------|------|
| Render | `your-app.onrender.com` | `443` |
| Fly.io | `your-app.fly.dev` | `443` |
| Railway | `your-app.up.railway.app` | `443` |
| Local | `192.168.192.138` | `8080` |

---

## ⚠️ Important

The proxy connects **from the cloud server** to **your ngrok tunnel**. Make sure:
1. Your ngrok tunnel is running
2. Your P2Pool is running
3. The proxy environment variables point to your ngrok URL

## 💡 Quick Start Recommendation

**Use Render.com** - it's the easiest and has a generous free tier.
