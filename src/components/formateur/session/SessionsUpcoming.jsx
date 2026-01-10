import { Monitor, CalendarDays } from "lucide-react";
import { getImageUrl } from "../../../utils/imageUtils";
import { formatDateShort } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

export default function SessionsUpcoming({ sessions }) {
  const navigate = useNavigate();

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
        Aucune session à venir
      </div>
    );
  }

const sortedSessions = [...sessions].sort(
  (sessionA, sessionB) => new Date(sessionA.startDate) - new Date(sessionB.startDate)
);

  return (
    <div className="grid grid-cols-12 gap-6">
      {sortedSessions.map((session) => (
        <div
          key={session.id}
          className="col-span-12 lg:col-span-6 rounded-3xl bg-[#F5F5EA] grid grid-cols-12 overflow-hidden"
        >
          <div className="col-span-12 lg:col-span-7 p-8 flex flex-col justify-between">
            <div>
            <div className="mb-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full w-fit">
                  <Monitor className="h-5 w-5" />
                  <span className="font-medium">
                    {session.categoryName}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-medium text-noir mb-2">
                {session.formationTitle}
              </h3>

              <div className="my-4 pl-3 border-l-2 border-[#FF4F01]">
                <p className="text-sm">
                {session.formationDescription}
                </p>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 py-2 w-fit">
                  <CalendarDays className="h-5 w-5" />
                  <span className="font-medium">
                  {formatDateShort(session.startDate)}
                  </span>
                </div>
              </div>
            </div>

            <span
              onClick={() => {
                navigate(`/formateur/sessions/${session.id}`);
                window.scrollTo(0, 0);
              }}
              className="text-sm cursor-pointer underline decoration-[#FF4F01] decoration-2 underline-offset-8"
            >
              En savoir +
            </span>
          </div>
          <div className="col-span-12 lg:col-span-5">
            {session.formationImageUrl ? (
              <img
                src={getImageUrl(session.formationImageUrl)}
                alt={session.formationTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-36 lg:h-40 bg-gray-300 rounded-xl flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  Pas d'image
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

