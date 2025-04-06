import { useEffect, useState } from "react";
import UserProfile from "./components/UserProfile";
import Lobby from "./components/Lobby";
import ProfileViewer from "./components/ProfileViewer";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [activeView, setActiveView] = useState("create");

  // Mise à jour du profil à chaque chargement
  useEffect(() => {
    const saved = localStorage.getItem("rpg_pulse_user");
    if (saved) {
      setProfile(JSON.parse(saved));
      setActiveView("profil");
    }
  }, []);

  const goTo = (view) => setActiveView(view);

  return (
    <div className="min-h-screen bg-white p-6">
      <nav className="mb-4 space-x-2">
        {profile ? (
          <>
            <button onClick={() => goTo("profil")}>Voir mon profil</button>
            <button onClick={() => goTo("lobby")}>Accéder au lobby</button>
          </>
        ) : (
          <button onClick={() => goTo("create")}>Créer mon profil</button>
        )}
      </nav>

      {activeView === "create" && <UserProfile onSave={() => {
        const saved = localStorage.getItem("rpg_pulse_user");
        if (saved) {
          setProfile(JSON.parse(saved));
          setActiveView("profil");
        }
      }} />}

      {activeView === "profil" && profile && <ProfileViewer />}
      {activeView === "lobby" && profile && <Lobby />}
    </div>
  );
}