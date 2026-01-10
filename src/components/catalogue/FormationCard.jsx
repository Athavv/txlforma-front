import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import { ROUTES } from "../../constants";

export default function FormationCard({ formation }) {
  return (
    <div className="flex-shrink-0 w-[28rem] bg-white rounded-xl p-6">
      {formation.imageUrl ? (
        <img
          src={getImageUrl(formation.imageUrl)}
          alt={formation.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-48  rounded-lg mb-4 flex items-center justify-center">
          Pas d'image
        </div>
      )}
      <h3 className="text-[24px] font-semibold text-gray-900 mb-2">
        {formation.title}
      </h3>
      <div className="relative pl-4">
        <span className="absolute left-0 h-full w-[4px] bg-vert rounded-full"></span>
        <p className="text-sm text-gray-700 mb-4">
          {(formation.description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.")
            .split(" ")
            .slice(0, 15)
            .join(" ") + " ..."}
        </p>
      </div>
      <Link
        to={ROUTES.FORMATION_DETAIL.replace(":id", formation.id)}
        className="relative inline-block text-sm text-gray-900 group"
      >
        En savoir plus +
        <span className="absolute left-0 bottom-[-4px] w-full h-[4px] rounded-full bg-vert transition-colors group-hover:bg-violet"></span>
      </Link>
    </div>
  );
}

