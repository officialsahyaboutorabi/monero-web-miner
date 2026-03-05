#!/bin/bash
# Start local HTTP server for web miner
# This avoids HTTPS mixed content issues

echo "=== Starting Web Miner Local Server ==="
echo ""

# Get local IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo "Starting HTTP server on port 8081..."
echo ""
echo "Access the web miner at:"
echo "  http://localhost:8081         (this computer)"
echo "  http://$LOCAL_IP:8081         (other devices on network)"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 -m http.server 8081
