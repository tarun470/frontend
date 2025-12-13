import { io } from "socket.io-client"

const URL = import.meta.env.VITE_BACKEND_URL

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
})

export const connectSocket = () => {
  const token = localStorage.getItem("token")
  if (!token) return
  socket.auth = { token }
  socket.connect()
}
