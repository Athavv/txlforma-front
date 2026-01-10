import { useRef } from "react";
import {
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Monitor,
} from "lucide-react";
import { formatDate } from "../../../utils/formatUtils";
import { getImageUrl } from "../../../utils/imageUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";

export default function SessionAVenir({ sessions }) {
  const navigate = useNavigate();

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

  return (
    <div className="space-y-6 mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] md:text-2xl font-medium text-noir">
          Mes prochaines sessions
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="bg-white rounded-full p-2 hover:bg-orange transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={scrollRight}
            className="bg-white rounded-full p-2 hover:bg-orange transition-colors shadow-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="bg-blanc rounded-2xl p-6 text-center text-noir">
          Aucune session à venir pour le moment. Veuillez en ajouter.
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 whitespace-nowrap"
        >
          {sessions.map((session) => {
            const imageUrl =
              session.formationImageUrl || session.formation?.imageUrl;
            const title = session.formationTitle || session.formation?.title;
            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl p-6 min-w-[320px] space-y-4 flex-shrink-0"
              >
                <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={getImageUrl(imageUrl)}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-noir text-xs">
                      Pas d'image
                    </div>
                  )}
                </div>
                {session.categoryName && (
                  <div className="flex items-center gap-2 bg-violet px-4 py-2 rounded-full w-fit">
                    <Monitor className="h-4 w-4 text-noir" />
                    <span className="text-xs font-medium">
                      {session.categoryName}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-noir">{title}</h3>
                {session.formationDescription && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {session.formationDescription}
                  </p>
                )}
                <div className="inline-flex items-center gap-2 text-sm bg-violet px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 text-noir" />
                  {formatDate(session.startDate)}
                </div>
                <div className="flex items-center gap-2 text-sm text-noir">
                  <User className="w-4 h-4 text-orange" />
                  Formateur :{" "}
                  {session.formateur || (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div>
                  <button
                    onClick={() =>
                      navigate(
                        ROUTES.PROFILE_SESSION_DETAIL.replace(":id", session.id)
                      )
                    }
                    className="relative text-xs font-regular text-noir hover:text-violet/70"
                  >
                    En savoir plus +
                    <span className="absolute left-0 bottom-[-4px] w-full h-[4px] rounded-full bg-vert transition-colors"></span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
