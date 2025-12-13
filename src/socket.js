import { io } from "socket.io-client"

const URL = import.meta.env.VITE_BACKEND_URL

// 🔌 Single socket instance
export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 500
})

/* =========================
   CONNECT SOCKET (SAFE)
========================= */
export const connectSocket = () => {
  const token = localStorage.getItem("token")
  if (!token) return

  // ✅ Prevent duplicate connections
  if (socket.connected || socket.connecting) return

  socket.auth = { token }
  socket.connect()
}

/* =========================
   DISCONNECT SOCKET (OPTIONAL)
========================= */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}
