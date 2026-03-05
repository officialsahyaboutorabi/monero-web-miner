#!/bin/bash
# Start WebSocket-to-TCP proxy for your P2Pool

echo "=== P2Pool WebSocket Proxy ==="
echo ""
echo "This allows browser miners to connect to your P2Pool"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install it first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Install ws if not present
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Get local IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo ""
echo "🌐 Your Local IP: $LOCAL_IP"
echo ""
echo "Pool Configuration:"
echo "  P2Pool Host: 127.0.0.1"
echo "  P2Pool Port: 3333"
echo "  Proxy Port:  8080"
echo ""
echo "Web miners should connect to:"
echo "  ws://$LOCAL_IP:8080"
echo ""
echo "Starting proxy..."
echo "Press Ctrl+C to stop"
echo ""

# Start the proxy
POOL_HOST=127.0.0.1 POOL_PORT=3333 node ws-proxy.js
