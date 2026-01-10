import { CalendarDays, User, Laptop, Calendar } from "lucide-react";
import { formatDateShort } from "../../../utils/dateUtils";
import { formatDate } from "../../../utils/formatUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { getImageUrl } from "../../../utils/imageUtils";
import { attestationService } from "../../../api/attestation.service";

export default function SessionsPastUser({ sessions }) {
  const navigate = useNavigate();

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
        Aucune session passée
      </div>
    );
  }

  const sessionEstTerminee = (session) => {
    const maintenant = new Date();
    const debutSession = new Date(session.startDate);
    return maintenant > debutSession;
  };

  const presenceStatus = (session) => {
    if (!sessionEstTerminee(session)) {
      return { type: "ATTENTE", label: "-" };
    }

    if (!session.attestationPresence) {
      if (session.status === "PRESENT" || session.status === "VALIDE" || (session.note !== null && session.note !== undefined)) {
        return { type: "NON_DISPONIBLE", label: "Non disponible" };
      }
      return { type: "Absent", label: "Absent" };
    }
    return { type: "PDF", id: session.attestationPresence.id };
  };

  const successStatus = (session) => {
    if (!sessionEstTerminee(session)) {
      return { type: "ATTENTE", label: "En attente" };
    }
    const maintenant = new Date();
    let dateFinSession;
    if (session.endDate) {
      dateFinSession = new Date(session.endDate);
      if (isNaN(dateFinSession.getTime())) {
        if (session.endTime) {
          dateFinSession = new Date(`${session.endDate}T${session.endTime}`);
        } else {
          const sessionDateParts = session.startDate.split("T");
          dateFinSession = new Date(sessionDateParts[0]);
        }
      }
    } else {
      const sessionDateParts = session.startDate.split("T");
      dateFinSession = new Date(sessionDateParts[0]);
    }
    const deadline = new Date(dateFinSession);
    deadline.setDate(deadline.getDate() + 14);
    const delaiBon = maintenant >= deadline;
    if (!delaiBon) {
      return { type: "ATTENTE", label: "En attente" };
    }
    if (session.note !== null && session.note !== undefined && session.note >= 10) {
      if (!session.attestationSuccess) {
        return { type: "NON_DISPONIBLE", label: "Non disponible" };
      }
      return { type: "PDF", id: session.attestationSuccess.id };
    }
    return { type: "ECHEC", label: "Session non réussie" };
  };

  const sessionsTriees = [...sessions].sort(
    (first, second) => new Date(second.startDate) - new Date(first.startDate)
  );

  return (
    <div className="rounded-2xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Sessions</th>
              <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Date de session</th>
              <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Formateur</th>
              <th className="text-left py-3 px-4 text-gray-500 font-normal text-sm">Note</th>
              <th className="text-center py-3 px-4 text-gray-500 font-normal text-sm">Attestation présence</th>
              <th className="text-center py-3 px-4 text-gray-500 font-normal text-sm">Attestation de succès</th>
              <th className="text-left py-3 text-gray-500"></th>
            </tr>
          </thead>

          <tbody>
            {sessionsTriees.map((session) => {
              const presence = presenceStatus(session);
              const success = successStatus(session);
              const note = session.note;

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
                      {note !== null && note !== undefined ? (
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
                    <div className="flex items-center justify-center min-h-[36px]">
                      {presence.type === "PDF" ? (
                        <button
                          onClick={() =>
                            attestationService.downloadAttestation(presence.id)
                          }
                          className="text-xs py-2 px-5 bg-noir rounded-full text-blanc hover:bg-violet transition-colors whitespace-nowrap"
                        >
                          Télécharger PDF
                        </button>
                      ) : (
                        <span
                          className={`text-xs px-12 py-2 rounded-full whitespace-nowrap inline-block ${
                            presence.type === "ABSENT" || presence.type === "NON_DISPONIBLE"
                              ? "bg-gray-300 text-noir"
                              : "bg-orange text-noir"
                          }`}
                        >
                          {presence.label}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center min-h-[36px]">
                      {success.type === "PDF" ? (
                        <button
                          onClick={() =>
                            attestationService.downloadAttestation(success.id)
                          }
                          className="text-xs py-2 px-5 bg-noir rounded-full text-blanc hover:bg-violet transition-colors whitespace-nowrap"
                        >
                          Télécharger PDF
                        </button>
                      ) : success.type === "NON_DISPONIBLE" ? (
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-xs py-2 px-5 rounded-full bg-gray-300 text-noir whitespace-nowrap inline-block`}
                          >
                            {success.label}
                          </span>
                          <span className="text-[10px] text-gray-600 max-w-[200px] text-center">
                            Disponible 2 semaines après la fin de la session pour permettre aux formateurs de corriger d'éventuelles erreurs.
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`text-xs py-2 px-5 rounded-full whitespace-nowrap inline-block ${
                            success.type === "ECHEC"
                              ? "bg-orange text-noir"
                              : "bg-gray-300 text-noir"
                          }`}
                        >
                          {success.label}
                        </span>
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
  );
}

