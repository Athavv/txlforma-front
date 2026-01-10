import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import { ROUTES } from "../../constants";
import { Monitor } from "lucide-react";

export default function FormationDetailRelatedFormations({
  relatedFormations,
}) {
  if (relatedFormations.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">
          Il n'y a pas d'autres formations dans cette catégorie.
        </p>
        <Link
          to={ROUTES.CATALOGUE}
          className="text-orange-500 hover:text-orange-600 underline font-medium"
        >
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {relatedFormations.map((relatedFormation) => (
        <div
          key={relatedFormation.id}
          className="bg-blanc rounded-lg overflow-hidden p-3"
        >
          {relatedFormation.imageUrl && (
            <img
              src={getImageUrl(relatedFormation.imageUrl)}
              alt={relatedFormation.title}
              className="w-full h-48 object-cover mt-2"
            />
          )}
          <div className="p-4">
            {relatedFormation.category && (
              <span className="inline-flex items-center gap-1 bg-violet font-medium px-5 py-2 rounded-full text-sm mb-2 mt-3">
                <Monitor className="h-3 w-3" />
                {relatedFormation.category.name}
              </span>
            )}
            <h3 className="text-lg font-bold mb-2">
              {relatedFormation.title}
            </h3>
             <div className="relative pl-4">
            <span className="absolute left-0 h-full w-[4px] bg-vert rounded-full"></span>
            <p className="text-sm text-gray-700 mb-4">
              {relatedFormation.description?.substring(0, 100)}...
            </p>
             </div>
            <Link
              to={ROUTES.FORMATION_DETAIL.replace(":id", relatedFormation.id)}
              className="relative inline-block text-sm text-gray-900 group"
            >
              En savoir plus +
               <span className="absolute left-0 bottom-[-4px] w-full h-[4px] rounded-full bg-vert transition-colors group-hover:bg-violet"></span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}




