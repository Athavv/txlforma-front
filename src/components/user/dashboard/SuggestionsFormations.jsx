import { Link } from "react-router-dom";
import { getImageUrl } from "../../../utils/imageUtils";
import { ROUTES } from "../../../constants";
import { Monitor } from "lucide-react";

export default function SuggestionsFormations({ formations }) {
  if (!formations || formations.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">
          Nous n’avons aucune formation à vous proposer pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {formations.map((formation, index) => (
        <div
          key={formation.id}
          className={`rounded-xl p-4 flex gap-6 items-center shadow-sm 
      ${index === 1 ? "bg-violet" : "bg-vert"}`}>
          <div className="flex-1 px-5">
            {formation.category && (
              <span className="inline-flex items-center gap-1 bg-fond font-medium px-4 py-1 rounded-full text-xs mb-2">
                <Monitor className="h-3 w-3" />
                {formation.category.name}
              </span>
            )}
            <p className="text-lg font-medium text-noir mt-1">{formation.title}</p>
            <Link to={ROUTES.FORMATION_DETAIL.replace(":id", formation.id)} className="text-[15px] inline-flex items-center justify-center px-6 py-2 text-sm font-regular text-blanc bg-noir rounded-full transition-all hover:bg-orange mt-2">
              Voir plus +
            </Link>
          </div>

          <div className="md:w-64 md:h-32 w-36 h-32 rounded-lg overflow-hidden bg-beige">
            {formation.imageUrl ? (
              <img src={getImageUrl(formation.imageUrl)} alt={formation.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center text-noir mt-12">
                Sans image
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
