import { getImageUrl } from "../../utils/imageUtils";
import { Monitor } from "lucide-react";

export default function FormationDetailHeader({ formation }) {
  return (
    <>
    <h1 className="text-4xl font-bold text-gray-900 mb-4">{formation.title}</h1>
      {formation.imageUrl && (
        <div className="mb-6">
          <img
            src={getImageUrl(formation.imageUrl)}
            alt={formation.title}
            className="w-[95%] h-96 object-cover rounded-lg"
          />
        </div>
      )}
      {formation.category && (
        <div className="flex gap-3 mb-6">
          <span className="bg-violet text-noir px-6 py-2 rounded-full flex items-center gap-2 font-medium">
            <Monitor className="h-4 w-4" />
            {formation.category.name}
          </span>
        </div>
      )}
            <h3 className="text-[24px] font-medium text-gray-900 mb-3">
        Description
      </h3>
      <div className="mb-2">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {formation.description || "Aucune description disponible."}
        </p>
      </div>
    </>
  );
}



