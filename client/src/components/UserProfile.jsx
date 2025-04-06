import { useState } from "react";

const defaultStats = {
  agilité: 5,
  force: 4,
  intelligence: 5,
  vitesse: 5,
  chance: 5,
};

const roles = ["mage", "archer", "épéiste", "tank", "clerc", "assassin"];
const races = ["elfe", "nain", "humain", "orc", "haut elfe"];

export default function UserProfile({ onSave }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("rpg_pulse_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [form, setForm] = useState({
    pseudo: "",
    race: races[2],
    role: roles[0],
    stats: { ...defaultStats },
  });

  const [editMode, setEditMode] = useState(profile ? false : true);

  const getTitle = (level, rank) => {
    const map = {
      E: ["Éveillé", "Novice", "Apprenti", "Initiateur", "Pionnier", "Stabilisé"],
      D: ["Confirmé", "Bravoure", "Combattant", "Rôdeur", "Expert", "Chef de groupe"],
    };
    const tranche = Math.floor((level - 1) / 5);
    return map[rank]?.[tranche] || "Héros inconnu";
  };

  const saveProfile = () => {
    const newProfile = {
      ...form,
      level: 1,
      exp: 0,
      rank: "E",
      title: getTitle(1, "E"),
    };
    localStorage.setItem("rpg_pulse_user", JSON.stringify(newProfile));
    setProfile(newProfile);
    setEditMode(false);
    if (onSave) onSave();
  };

  const resetProfile = () => {
    localStorage.removeItem("rpg_pulse_user");
    setProfile(null);
    setForm({
      pseudo: "",
      race: races[2],
      role: roles[0],
      stats: { ...defaultStats },
    });
    setEditMode(true);
  };

  if (profile && !editMode) {
    return (
      <div className="p-4 border rounded-lg max-w-md mx-auto mt-6">
        <h2 className="text-xl font-bold mb-2">Profil de {profile.pseudo}</h2>
        <p>Race : {profile.race}</p>
        <p>Rôle : {profile.role}</p>
        <p>Niveau : {profile.level} | Rang : {profile.rank} | Titre : {profile.title}</p>
        <ul className="list-disc list-inside mt-2">
          {Object.entries(profile.stats).map(([key, val]) => (
            <li key={key}>{key} : {val}</li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setEditMode(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Modifier
          </button>
          <button
            onClick={resetProfile}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Supprimer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Créer ton profil</h2>
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Ton pseudo"
        value={form.pseudo}
        onChange={(e) => setForm({ ...form, pseudo: e.target.value })}
      />
      <select
        className="w-full p-2 mb-2"
        value={form.race}
        onChange={(e) => setForm({ ...form, race: e.target.value })}
      >
        {races.map((r) => <option key={r}>{r}</option>)}
      </select>
      <select
        className="w-full p-2 mb-4"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        {roles.map((r) => <option key={r}>{r}</option>)}
      </select>
      <button
        onClick={saveProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Sauvegarder
      </button>
    </div>
  );
}