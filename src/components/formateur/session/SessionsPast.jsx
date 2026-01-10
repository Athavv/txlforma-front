import { CalendarDays, User, MapPin, Laptop } from "lucide-react";
import { formatDateShort } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

export default function SessionsPast({ sessions }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Sessions</th>
              <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Date de session</th>
              <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Nombre d'élèves</th>
              <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Lieu</th>
              <th className="text-left py-3 text-gray-500"></th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-noir font-medium">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                  <Laptop className="w-5 h-5 text-violet-500" />
                    {session.formationTitle || "Session"}
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
                  <User className="w-5 h-5 text-[#9F8BE9]" />
                  {session.participantsCount || 0} / {session.capacity || 0}
                  </div>
                  </td>

                  <td className="py-3 px-4 text-noir">
                  <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF4F01]" />
                  {session.location || "-"}
                  </div>
                  </td>

                  <td className="py-3 px-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        navigate(`/formateur/sessions/${session.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="bg-noir text-white px-5 py-2 rounded-full text-sm font-medium transition hover:bg-[#FF4F01]"
                    >
                      Voir les informations
                    </button>
                  </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
