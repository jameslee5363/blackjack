#!/bin/sh
 set -e  

 echo "Setting up frontend..."
 cd frontend
 cd vite-project
 npm install
 npm run build
 cd ..
 cd ..

 echo "Setting up backend..."
 cd backend
 npm install
 cd ..

 echo "Starting server..."
 cd backend
 npm run start
