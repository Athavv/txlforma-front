import { CalendarDays, User, Laptop } from "lucide-react";
import { formatDateShort } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { getImageUrl } from "../../../utils/imageUtils";

export default function HistoriqueSession({ sessions, formatDate }) {
  const navigate = useNavigate();

  const sessionsLimitees = [...sessions]
    .sort(
      (session1, session2) =>
        new Date(session2.startDate) - new Date(session1.startDate)
    )
    .slice(0, 7);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[20px] md:text-2xl font-medium text-noir">
          Historique de mes sessions
        </h2>
        <button
          onClick={() => navigate(ROUTES.PROFILE_SESSIONS_PASSEES)}
          className="text-sm underline"
        >
          Voir plus
        </button>
      </div>
      <div className="rounded-2xl border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Sessions</th>
                <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Date de session</th>
                <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Formateur</th>
                <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Note</th>
                <th className="text-left py-3 text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {sessionsLimitees.map((session) => {
                const note = session.note;
                const isValidNote = note !== undefined && note !== null;

                return (
                  <tr key={session.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-noir font-medium">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Laptop className="w-5 h-5 text-violet-500" />
                        {session.title || "Session"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-noir">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <CalendarDays className="w-5 h-5 text-[#CAC9B7]" />
                        {formatDateShort(session.startDate)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-noir">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {session.formateurImageUrl ? (
                          <img
                            src={getImageUrl(session.formateurImageUrl)}
                            alt={session.formateur}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-[#9F8BE9]" />
                        )}
                        {session.formateur || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-start min-h-[36px]">
                        {isValidNote ? (
                          <span
                            className={`px-6 py-1.5 rounded-full text-xs font-semibold inline-block ${
                              note >= 10
                                ? "bg-vert text-noir"
                                : "bg-orange text-noir"
                            }`}
                          >
                            {note}/20
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            navigate(
                              ROUTES.PROFILE_SESSION_DETAIL.replace(":id", session.id)
                            );
                            window.scrollTo(0, 0);
                          }}
                          className="bg-noir text-white px-5 py-2 rounded-full text-sm font-medium transition hover:bg-[#FF4F01]"
                        >
                          Voir les informations
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
