# Payment Enrollment System
This project was made for a Software Engineering II course by Group 2.

### Requirements
- Node.js and all dependencies installed on your machine(check npm install step). You can get the prebuilt Node.js installer from https://nodejs.org/en/download.

### Installation
```sh
# Step 0: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL> 
# (Alternatively, download it locally using the green button on the top-right of this project)

## You need to do the following TWICE: Once for the client, once for the server.
# a: SERVER
# Step 1: open the server folder on your terminal
cd <SERVER_FOLDER>
# Step 2: Install the necessary NPM dependencies
npm install
# STEP 3: Run the server
npm run dev

# b: CLIENT
# Step 1: open the client folder on your terminal
cd <CLIENT_FOLDER>
# Step 2: install the necessary NPM dependencies
npm install
# Step 3: Run the application
npm run dev


# Packages, if needed
npm i @tanstack/react-query
npm i tailwindcss @tailwindcss/vite
npm i react-router
npm i sonner
npm i radix-ui
npm i next-themes
```
### FAQ (& Known Bugs)
1. "npm[___] is not digitally signed" - P.M(222378)

Running this seems to have fixed it for me in Powershell as an admin:
```sh 
set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Credits 

This project is built with:
- Reactjs (tsx)
- Nodejs
- Vite
- SQLite (To be added)
- shadcn-ui (The entire /components/ library is from here)
- Tailwind CSS (All of the styling is from here)
- React Router Dom(You need to install this seperately from react idk -p.m.)
- Tanstack React Query (Used in Login page)
- Radix-UI
- And some other less prevalent libraries

### Learning Resources

- React Course Playlist, by Bro Code (https://www.youtube.com/playlist?list=PLZPZq0r_RZOMQArzyI32mVndGBZ3D99XQ)
- Tailwind CSS v4 Full Course, by Javascript Mastery (https://youtu.be/6biMWgD6_JY)
- Node.js Ultimate Beginner's Guide, by Fireship (https://youtu.be/ENrzD9HAZK4)
- How to Create a React Frontend + Express/Node Backend Project, by How to Web Dev (https://youtu.be/yc_D8u7ETuw)
- How to Create a Express/Node + React Project with Vite | Node Backend + React Frontend, by Arpan Neupane (https://youtu.be/mKmxc8TcWQ8)

Boilerplate React + Vite Readme below.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
