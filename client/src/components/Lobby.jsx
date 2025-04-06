import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Lobby() {
  const [lobbyId, setLobbyId] = useState("");
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [inputLobby, setInputLobby] = useState("");

  const profile = JSON.parse(localStorage.getItem("rpg_pulse_user"));

  const createLobby = () => {
    socket.emit("create_lobby", { profile });
  };

  const joinLobby = () => {
    if (inputLobby.trim() !== "") {
      socket.emit("join_lobby", { lobbyId: inputLobby, profile });
    }
  };

  useEffect(() => {
    socket.on("lobby_created", ({ lobbyId }) => {
      setLobbyId(lobbyId);
    });

    socket.on("player_joined", ({ players }) => {
      setConnectedPlayers(players);
    });

    socket.on("error_join", ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off("lobby_created");
      socket.off("player_joined");
      socket.off("error_join");
    };
  }, []);

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Lobby Multijoueur</h2>

      {!lobbyId && (
        <>
          <button
            onClick={createLobby}
            className="bg-green-600 text-white px-4 py-2 rounded w-full mb-2"
          >
            Créer un lobby
          </button>
          <input
            className="border p-2 w-full mb-2"
            placeholder="Code du lobby"
            value={inputLobby}
            onChange={(e) => setInputLobby(e.target.value)}
          />
          <button
            onClick={joinLobby}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Rejoindre un lobby
          </button>
        </>
      )}

      {lobbyId && (
        <>
          <p className="mt-4 text-green-700">Lobby : <strong>{lobbyId}</strong></p>
          <ul className="mt-2 list-disc list-inside">
            {connectedPlayers.map((p, i) => (
              <li key={i}>{p.pseudo} – {p.role} ({p.race})</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}