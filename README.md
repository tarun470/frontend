# 🎮 Tic-Tac-Toe (Frontend)

A modern **real-time Tic-Tac-Toe web application frontend** built using **React + Vite**, supporting:

- 👥 Multiplayer (1v1)
- 🤖 Play vs AI (Minimax Algorithm)
- 🔁 Auto Rematch System
- 🔐 JWT-based Authentication
- ⚡ Real-time updates using Socket.IO
- ☁️ Deployed on Render

---

## 🌐 Live Demo

- **Frontend**: https://your-frontend-url.onrender.com  
- **Backend**: https://your-backend-url.onrender.com  

---

## 🧩 Project Overview

This frontend application communicates with a **Node.js + Socket.IO backend** to provide a **real-time multiplayer gaming experience**.

The frontend is responsible for:

- User interaction & UI rendering
- Managing game state
- Communicating with backend via sockets
- Displaying real-time moves and results
- Handling authentication & routing

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|--------|
| React | UI development |
| Vite | Fast build & dev server |
| Socket.IO Client | Real-time communication |
| React Router | Page navigation |
| Axios | HTTP requests |
| CSS | Styling |
| JWT | Authentication |

---

## 📁 Folder Structure (Frontend)

```txt
frontend/
│
├── src/
│   ├── components/
│   │   ├── Board.jsx        # Game board UI
│   │   └── Header.jsx       # App header
│   │
│   ├── pages/
│   │   ├── Lobby.jsx        # Create / Join rooms
│   │   ├── Room.jsx         # Room container
│   │   └── Game.jsx         # Game logic & UI
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx  # Authentication context
│   │
│   ├── socket.js            # Socket.IO client setup
│   ├── App.jsx              # Routing & layout
│   ├── main.jsx             # App entry point
│   └── styles.css           # Global styles
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
🔍 Module Explanation
🔐 AuthContext.jsx
Stores logged-in user information

Manages JWT authentication state

Protects private routes

Ensures socket connects only after login

🌐 socket.js
Handles real-time communication with the backend:

Connects using JWT token

Prevents multiple socket connections

Emits and listens to game events

Acts as the bridge between frontend and backend

Example:

js
Copy code
socket.emit("makeMove");
socket.on("moveMade");
🏠 Lobby.jsx
Create a new room (1v1)

Create AI room

Join existing room

Automatically navigates to the game room

Manages game entry flow

🚪 Room.jsx
Fetches room details

Resolves player role (X / O / Spectator)

Joins the socket room

Passes room data to the Game component

Acts as the room controller

🎲 Game.jsx
Core gameplay logic:

Board state updates

Turn validation

Winner detection

Rematch voting

Handles AI and multiplayer logic

This is the heart of the frontend.

🧩 Board.jsx
Renders 3×3 grid

Handles cell click events

Pure UI component

Keeps game UI clean and reusable

🤖 AI Gameplay (Frontend Perspective)
AI logic runs on the backend

Frontend responsibilities:

Send player moves

Receive AI moves

Update UI in real-time

This keeps the frontend lightweight and secure.

🔁 Rematch Logic
Players vote for rematch

Votes sync via Socket.IO

Once required votes are reached:

Board resets automatically

Game restarts without page refresh

🚀 How to Run Locally
1️⃣ Clone the Repository
bash
Copy code
git clone https://github.com/your-username/tic-tac-toe-frontend.git
cd tic-tac-toe-frontend
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Configure Environment Variables
Create a .env file:

env
Copy code
VITE_BACKEND_URL=https://your-backend-url.onrender.com
4️⃣ Start Development Server
bash
Copy code
npm run dev
App will run at:

arduino
Copy code
http://localhost:5173
☁️ Deployment on Render (Frontend)
Deployment Steps
Push frontend code to GitHub

Go to Render → New → Static Site

Connect GitHub repository

Configure settings:

Setting	Value
Build Command	npm install && npm run build
Publish Directory	dist
Environment Variable	VITE_BACKEND_URL

Click Deploy 🚀

🔐 Authentication Flow
User logs in / registers

JWT token stored in localStorage

Socket connects using token

Backend verifies token

Secure real-time gameplay starts

✅ Features Summary
✔️ Real-time multiplayer

✔️ AI opponent (Minimax)

✔️ Spectator mode

✔️ Auto rematch system

✔️ Secure authentication

✔️ Responsive UI

✔️ Cloud deployment

📌 Future Enhancements
🎨 Better UI animations

🧠 Multiple AI difficulty levels

📊 Match history & statistics

👀 Live spectator list

🌍 Global leaderboard

👨‍💻 Author
TARUN DUGGEMPUDI
Full-Stack Developer
React | Node.js | Socket.IO | MongoDB

📄 License
This project is licensed under the MIT License.

⭐ If you like this project, please give it a star on GitHub!

yaml
Copy code

---

If you want next, I can:

- ✅ Write **Backend README**
- ✅ Add **screenshots section**
- ✅ Make it **resume / LinkedIn optimized**
- ✅ Improve UI with **Tailwind + animations**








