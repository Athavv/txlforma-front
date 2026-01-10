import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FormationCard from "./FormationCard";
import starorange from "../../assets/images/home/starorange.png";
import etoiles from "../../assets/images/home/5etoiles.png";

export default function CategorySection({ category, formations }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (formations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
        <img src={starorange} className="w-8 h-8" />
        <h2 className="text-[24px] md:text-[40px] font-bold text-gray-900">{category.name}</h2>
        <img src={starorange} className="w-8 h-8" />
      </div>
      <div className="flex items-center justify-between px-5 mb-6">
        {category.description && (
          <p className="text-gray-700">{category.description}</p>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="bg-white rounded-full p-2 hover:bg-orange transition-colors"
            aria-label="Défiler vers la gauche"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={scrollRight}
            className="bg-white rounded-full p-2 hover:bg-orange transition-colors"
            aria-label="Défiler vers la droite"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="px-0">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar"
        >
          {formations.map((formation) => (
            <FormationCard key={formation.id} formation={formation} />
          ))}
        </div>
      </div>
    </div>
  );
}
