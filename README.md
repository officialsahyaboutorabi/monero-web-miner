# ⛏️ Monero Web Miner v2.0 - REAL MINING

Browser-based Monero miner that performs **REAL hash computations** and can connect to your pool.

## 🚨 Important: Browser Limitations

**Browsers CANNOT make raw TCP connections.** This is a security feature.

Your P2Pool uses **TCP port 3333**, but browsers can only use **WebSocket (ws:// or wss://)**.

### Solutions:

#### Option 1: Use WebSocket Proxy (Recommended)
Run the included proxy to bridge WebSocket to your TCP pool:

```bash
# Install dependencies
npm install

# Start the proxy (connects to your pool)
npm start

# Or with custom settings:
POOL_HOST=0.tcp.au.ngrok.io POOL_PORT=11526 npm start
```

Then in the web miner, set:
- **Pool**: `localhost`
- **Port**: `8080` (the proxy port)

#### Option 2: Use XMRig (Best Performance)
For actual profitable mining, use the native miner:

```bash
./xmrig -o 0.tcp.au.ngrok.io:11526 -u YOUR_WALLET
```

## 🚀 Deploy to GitHub Pages

### Step 1: Create Repository
1. Go to https://github.com/new
2. Name: `monero-web-miner`
3. Make it **Public**
4. Click **Create repository**

### Step 2: Upload Files
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/monero-web-miner.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Repository **Settings** → **Pages**
2. Source: **Deploy from a branch** → **main** → **Save**

Your site: `https://yourusername.github.io/monero-web-miner`

## ⛏️ Features

- ✅ **REAL hash computation** (not simulation)
- ✅ Multi-threaded Web Workers
- ✅ Live hashrate display
- ✅ Attempts WebSocket pool connection
- ✅ Dark theme UI
- ✅ Start/Stop controls
- ✅ Console logging

## ⚙️ How It Works

1. **Hash Computation**: Uses Web Workers to perform real cryptographic calculations
2. **Pool Connection**: Tries WebSocket proxies to connect to your TCP pool
3. **Fallback**: If pool connection fails, continues hashing (real work, no submission)

## 📊 Performance

| Platform | Hashrate | Notes |
|----------|----------|-------|
| Browser | 5-50 H/s | Very slow, educational only |
| XMRig (CPU) | 1000-5000 H/s | Actual profitable mining |

## 🔧 Files

- `index.html` - Web interface
- `miner.js` - Mining logic with REAL hashing
- `style.css` - Dark theme
- `ws-proxy.js` - WebSocket-to-TCP proxy server
- `package.json` - Node.js dependencies

## 🔒 Privacy & Security

- No data sent to third parties
- All hashing done locally in browser
- Pool credentials only sent to your configured pool

## ⚠️ Disclaimer

Browser mining is **not profitable**. This is for educational/demo purposes. Use XMRig for real mining.

## 🆘 Troubleshooting

**"Connection failed"**
- Browsers can't do TCP. Use the WebSocket proxy or XMRig.

**"Very low hashrate"**
- Normal for browsers. They are 100x slower than native miners.

**"Proxy won't start"**
- Make sure port 8080 is free: `lsof -ti:8080 | xargs kill -9`

## 📄 License

MIT License
