@echo off

npx create-vite@latest frontend --template react-ts
cd frontend
npm install
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..
cd backend
npm install
cd ..
exit