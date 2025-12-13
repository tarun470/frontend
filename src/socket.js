import { io } from "socket.io-client"

const URL = import.meta.env.VITE_BACKEND_URL

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
})

/* =========================
   CONNECT SOCKET (SAFE)
========================= */
export const connectSocket = () => {
  const token = localStorage.getItem("token")
  if (!token) return

  // 🔥 Prevent multiple connections
  if (socket.connected) return

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
