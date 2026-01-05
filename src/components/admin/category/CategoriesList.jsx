import { Edit, Trash2 } from "lucide-react";
import { getImageUrl } from "../../../utils/imageUtils";

export default function CategoriesList({ categories, onEdit, onDelete }) {
  if (categories.length === 0) {
    return (
      <div className="col-span-full p-8 text-center text-gray-500">
        Aucune catégorie trouvée
      </div>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-blanc rounded-2xl p-6"
        >
          {category.imageUrl ? (
            <img
              src={getImageUrl(category.imageUrl)}
              alt={category.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
              Pas d'image
            </div>
          )}
          <h3 className="text-xl font-bold text-noir mb-2">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {category.description}
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(category)}
              className="flex-1 px-4 py-2 bg-beige2 text-blanc rounded-lg hover:bg-orange transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="px-4 py-2 bg-orange text-blanc rounded-lg hover:bg-orange transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

