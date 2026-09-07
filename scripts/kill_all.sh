#! /bin/bash

# Kill everything
pkill -9 uvicorn 2>/dev/null
pkill -9 -f "npm run dev" 2>/dev/null
pkill -9 -f "vite" 2>/dev/null
sudo fuser -k 3000/tcp 2>/dev/null
sudo fuser -k 8000/tcp 2>/dev/null
sleep 2
