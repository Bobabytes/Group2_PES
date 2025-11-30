start "SERVER" cmd /k "cd /d %~dp0 && cd server && npm i && npm run dev"
start "CLIENT" cmd /k "cd /d %~dp0 && cd client && npm i && npm run dev"
