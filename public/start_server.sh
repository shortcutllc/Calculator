#!/bin/bash

# Configuration
PORT=8000
MAX_RETRIES=5

# Function to check if port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
    return $?
}

# Function to find next available port
find_available_port() {
    local port=$1
    local max_port=$((port + MAX_RETRIES))
    
    while [ $port -le $max_port ]; do
        if ! check_port $port; then
            echo $port
            return 0
        fi
        port=$((port + 1))
    done
    
    return 1
}

# Kill any existing Python HTTP servers
echo "Cleaning up existing servers..."
pkill -f "python3 -m http.server" 2>/dev/null || true

# Find available port
FINAL_PORT=$(find_available_port $PORT)

if [ -z "$FINAL_PORT" ]; then
    echo "Error: Could not find available port in range $PORT-$((PORT + MAX_RETRIES))"
    exit 1
fi

# Start the server
echo "Starting server on port $FINAL_PORT..."
python3 -m http.server $FINAL_PORT 