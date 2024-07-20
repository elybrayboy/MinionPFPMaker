#!/bin/sh

# Install dependencies
npm install

# Build the frontend
npm run build

# Navigate to the server directory and start the server
cd assets/js

# Kill any process running on port 3000
lsof -t -i:3000 | xargs kill -9

# Start the server
node server.js
