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

// stocker les lobbies : { lobbyId: [{ socketId, profile }] }
const lobbies = {};

io.on("connection", (socket) => {
  console.log("🔌 Nouveau socket connecté :", socket.id);

  socket.on("create_lobby", ({ profile }) => {
    const lobbyId = uuidv4().slice(0, 6); // ID court
    lobbies[lobbyId] = [{ socketId: socket.id, profile }];
    socket.join(lobbyId);
    socket.emit("lobby_created", { lobbyId });
    console.log(`🛠️ Lobby créé: ${lobbyId} par ${profile?.pseudo || socket.id}`);
  });

  socket.on("join_lobby", ({ lobbyId, profile }) => {
    if (lobbies[lobbyId]) {
      lobbies[lobbyId].push({ socketId: socket.id, profile });
      socket.join(lobbyId);

      const playerList = lobbies[lobbyId].map(p => p.profile);
      io.to(lobbyId).emit("player_joined", { players: playerList });

      console.log(`👥 ${profile.pseudo} (${socket.id}) a rejoint le lobby ${lobbyId}`);
    } else {
      socket.emit("error_join", { message: "Lobby introuvable." });
    }
  });

  socket.on("disconnect", () => {
    for (const [lobbyId, players] of Object.entries(lobbies)) {
      if (players.find(p => p.socketId === socket.id)) {
        lobbies[lobbyId] = players.filter(p => p.socketId !== socket.id);
        const updated = lobbies[lobbyId].map(p => p.profile);
        io.to(lobbyId).emit("player_joined", { players: updated });
        if (lobbies[lobbyId].length === 0) delete lobbies[lobbyId];
      }
    }
    console.log(`❌ Socket déconnecté: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("🚀 Serveur backend sur http://localhost:3001");
});