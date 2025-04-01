const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// stocker les lobbies { lobbyId: [socket.id, ...] }
const lobbies = {};

io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  socket.on("create_lobby", () => {
    const lobbyId = uuidv4().slice(0, 6); // ID court
    lobbies[lobbyId] = [socket.id];
    socket.join(lobbyId);
    socket.emit("lobby_created", { lobbyId });
    console.log(`🛠️ Lobby créé: ${lobbyId}`);
  });

  socket.on("join_lobby", ({ lobbyId }) => {
    if (lobbies[lobbyId]) {
      lobbies[lobbyId].push(socket.id);
      socket.join(lobbyId);
      io.to(lobbyId).emit("player_joined", { players: lobbies[lobbyId] });
      console.log(`👥 ${socket.id} a rejoint le lobby ${lobbyId}`);
    } else {
      socket.emit("error_join", { message: "Lobby introuvable." });
    }
  });

  socket.on("disconnect", () => {
    // Supprimer le socket de tous les lobbies
    for (const [lobbyId, sockets] of Object.entries(lobbies)) {
      if (sockets.includes(socket.id)) {
        lobbies[lobbyId] = sockets.filter(id => id !== socket.id);
        io.to(lobbyId).emit("player_joined", { players: lobbies[lobbyId] });
        if (lobbies[lobbyId].length === 0) delete lobbies[lobbyId];
      }
    }
    console.log(`❌ Socket déconnecté: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("🚀 Serveur backend sur http://localhost:3001");
});