export default function ProfileViewer() {
    const profile = JSON.parse(localStorage.getItem("rpg_pulse_user"));
  
    if (!profile) return <p>Profil introuvable.</p>;
  
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
      </div>
    );
  }