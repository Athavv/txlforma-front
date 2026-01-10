import { Monitor, CalendarDays } from "lucide-react";
import { getImageUrl } from "../../../utils/imageUtils";
import { formatDateShort } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";

export default function SessionsInProgressUser({ sessions }) {
  const navigate = useNavigate();

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
        Aucune session en cours
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div key={session.id} className="relative rounded-3xl overflow-hidden">
          {session.formationImageUrl && (
            <img
              src={getImageUrl(session.formationImageUrl)}
              alt={session.formationTitle}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 px-8 py-10 flex flex-col justify-between">
            <div>
              {session.categoryName && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full w-fit">
                    <Monitor className="h-5 w-5" />
                    <span className="font-medium">{session.categoryName}</span>
                  </div>
                </div>
              )}
              <h3 className="text-2xl font-medium mb-2 text-white">
                {session.formationTitle}
              </h3>
              {session.formationDescription && (
                <div className="my-4 pl-3 border-l-2 border-vert text-white">
                  <p className="text-sm">{session.formationDescription}</p>
                </div>
              )}
              <div className="mb-3 flex items-center gap-2 py-2 w-fit text-white">
                <CalendarDays className="h-5 w-5" />
                <span className="font-medium">
                  {formatDateShort(session.startDate)}
                </span>
              </div>
            </div>
            <span
              onClick={() => {
                navigate(
                  ROUTES.PROFILE_SESSION_DETAIL.replace(":id", session.id)
                );
                window.scrollTo(0, 0);
              }}
              className="text-sm cursor-pointer underline decoration-vert decoration-2 underline-offset-8 text-white"
            >
              Voir ma session
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
