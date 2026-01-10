import formationsuivicon from "../../../assets/images/user/formationsuivicon.png";
import moyenneicone from "../../../assets/images/user/moyenneicone.png";
import meilleurnoteicon from "../../../assets/images/user/meilleurnoteicon.png";
import reussicon from "../../../assets/images/user/reussicon.png";

export default function StatsGlobales({ stats }) {
  if (!stats) {
    return (
      <div className="bg-beige rounded-xl p-6">
        <p className="text-noir">Aucune statistique disponible.</p>
      </div>
    );
  }

  const items = [
    {
      label: "Sessions suivies",
      value: stats.sessionsSuivies ? stats.sessionsSuivies : "-",
      icon: formationsuivicon,
      bg: "bg-violet",
    },
    {
      label: "Moyenne générale",
      value: stats.moyenne ? stats.moyenne : "-",
      icon: moyenneicone,
      bg: "bg-vert",
    },
    {
      label: "Meilleure note obtenue",
      value: stats.meilleureNote ? stats.meilleureNote : "-",
      icon: meilleurnoteicon,
      bg: "bg-orange",
    },
    {
      label: "Taux de réussite",
      value: stats.tauxReussite ? stats.tauxReussite + "%" : "-",
      icon: reussicon,
      bg: "bg-beige2",
    },
  ];

  return (
    <div className="rounded-xl">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={index} className="group bg-beige rounded-xl p-5 text-left transition-colors hover:bg-noir hover:text-white">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.bg}`}>
              <img src={item.icon} alt={item.label} className="h-8 w-8 group-hover:brightness-0 group-hover:invert"/>
            </div>
            <p className="text-sm text-noir group-hover:text-white mt-3"> {item.label}</p>
            <p className="text-2xl font-semibold text-noir group-hover:text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
