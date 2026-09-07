#! /bin/bash

# Kill everything
#pkill -9 uvicorn 2>/dev/null; pkill -9 -f "npm run dev" 2>/dev/null; pkill -9 -f "vite" 2>/dev/null; sudo fuser -k 3000/tcp 2>/dev/null; sudo fuser -k 8000/tcp 2>/dev/null; sleep 2
/root/kill_all.sh

# Start Backend
cd /root/asimov-ai/backend
source ../venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
