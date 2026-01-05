import { Edit, Trash2 } from "lucide-react";
import { getImageUrl } from "../../../utils/imageUtils";

export default function FormationsList({ formations, onEdit, onDelete }) {
  if (formations.length === 0) {
    return (
      <div className="col-span-full p-8 text-center text-gray-500">
        Aucune formation trouvée
      </div>
    );
  }

  return (
    <>
      {formations.map((formation) => (
        <div
          key={formation.id}
          className="bg-blanc rounded-2xl p-6 "
        >
          {formation.imageUrl ? (
            <img
              src={getImageUrl(formation.imageUrl)}
              alt={formation.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
              Pas d'image
            </div>
          )}
          <h3 className="text-[24px] font-bold text-noir mb-2">
            {formation.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {formation.description}
          </p>
          {formation.category && (
            <span className="inline-block px-3 py-1 bg-vert text-noir text-xs rounded-full mb-4">
              {formation.category.name}
            </span>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(formation)}
              className="flex-1 px-4 py-2 bg-orange text-blanc rounded-lg hover:bg-orange/90 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </button>
            <button
              onClick={() => onDelete(formation.id)}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

