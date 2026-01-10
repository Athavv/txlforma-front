import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { attestationService } from "../../../api/attestation.service";
import { ROUTES } from "../../../constants";
import { getImageUrl } from "../../../utils/imageUtils";

export default function HistoriqueSessionListe({
  sessions = [],
  formatDate = () => "-",
}) {
  const navigate = useNavigate();
  const sessionsTriees = sessions
    .filter((session) => session)
    .sort(
      (first, second) => new Date(second.startDate) - new Date(first.startDate)
    );

  const sessionEstTerminee = (session) => {
    const maintenant = new Date();
    const debutSession = new Date(session.startDate);
    return maintenant > debutSession;
  };

  const presenceStatus = (session) => {
    if (!sessionEstTerminee(session)) {
      return { type: "ATTENTE", label: "-" };
    }

    // Si l'utilisateur a émergé (status PRESENT ou VALIDE) ou a une note, 
    // il devrait avoir une attestation de présence
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
    // Utiliser endDate si disponible, sinon calculer depuis startDate
    const maintenant = new Date();
    let dateFinSession;
    if (session.endDate) {
      // Si endDate est une string au format "YYYY-MM-DD"
      dateFinSession = new Date(session.endDate);
      // S'assurer que la date est correctement parsée
      if (isNaN(dateFinSession.getTime())) {
        // Si le parsing échoue, essayer avec endTime
        if (session.endTime) {
          dateFinSession = new Date(`${session.endDate}T${session.endTime}`);
        } else {
          // Fallback: extraire la date depuis startDate
          const sessionDateParts = session.startDate.split("T");
          dateFinSession = new Date(sessionDateParts[0]);
        }
      }
    } else {
      // Fallback: extraire la date depuis startDate
      const sessionDateParts = session.startDate.split("T");
      dateFinSession = new Date(sessionDateParts[0]);
    }
    // Ajouter 14 jours à la date de fin de session
    const deadline = new Date(dateFinSession);
    deadline.setDate(deadline.getDate() + 14);
    const delaiBon = maintenant >= deadline;
    if (!delaiBon) {
      return { type: "ATTENTE", label: "En attente" };
    }
    // Vérifier si la note est >= 10 avant de dire "non réussie"
    // Si l'utilisateur a une note >= 10 mais pas d'attestation, afficher "Non disponible"
    if (session.note !== null && session.note !== undefined && session.note >= 10) {
      if (!session.attestationSuccess) {
        return { type: "NON_DISPONIBLE", label: "Non disponible" };
      }
      return { type: "PDF", id: session.attestationSuccess.id };
    }
    // Si pas de note ou note < 10
    return { type: "ECHEC", label: "Session non réussie" };
  };

  return (
    <div className="rounded-2xl p-6 relative">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium">
                Session
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium">Note</th>
              <th className="text-left py-3 px-4 text-sm font-medium">
                Formateur
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium">
                Date de session
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium">
                Attestation présence
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium">
                Attestation de succès
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium">
                Détails
              </th>
            </tr>
          </thead>
          <tbody>
            {sessionsTriees.map((session) => {
              const presence = presenceStatus(session);
              const success = successStatus(session);
              const note = session.note;

              return (
                <tr key={session.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-noir font-medium">
                    {session.title || "Session"}
                  </td>

                  <td className="py-3 px-4">
                    {note !== null && note !== undefined ? (
                      <span
                        className={`px-6 py-1 rounded-full text-xs font-semibold ${
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
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-noir">
                      {session.formateurImageUrl ? (
                        <img
                          src={getImageUrl(session.formateurImageUrl)}
                          alt={session.formateur}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-violet" />
                      )}
                      {session.formateur || (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-sm text-noir">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange" />
                      {formatDate(session.startDate)}
                    </div>
                  </td>

                  <td className="py-3 px-4 bg">
                    {presence.type === "PDF" ? (
                      <button
                        onClick={() =>
                          attestationService.downloadAttestation(presence.id)
                        }
                        className="text-sm py-2 px-5 bg-noir rounded-full text-blanc hover:bg-violet transition-colors"
                      >
                        Télécharger PDF
                      </button>
                    ) : (
                      <span
                        className={`text-sm px-12 py-2 rounded-full ${
                          presence.type === "ABSENT" || presence.type === "NON_DISPONIBLE"
                            ? "bg-gray-300 text-noir"
                            : "bg-orange text-noir"
                        }`}
                      >
                        {presence.label}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {success.type === "PDF" ? (
                      <button
                        onClick={() =>
                          attestationService.downloadAttestation(success.id)
                        }
                        className="text-sm py-2 px-5 bg-noir rounded-full text-blanc hover:bg-violet transition-colors"
                      >
                        Télécharger PDF
                      </button>
                    ) : success.type === "NON_DISPONIBLE" ? (
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-xs py-2 px-5 rounded-full bg-gray-300 text-noir`}
                        >
                          {success.label}
                        </span>
                        <span className="text-[10px] text-gray-600 max-w-[200px]">
                          Disponible 2 semaines après la fin de la session pour permettre aux formateurs de corriger d'éventuelles erreurs.
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`text-xs py-2 px-5 rounded-full ${
                          success.type === "ECHEC"
                            ? "bg-orange text-noir"
                            : "bg-gray-300 text-noir"
                        }`}
                      >
                        {success.label}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        navigate(
                          ROUTES.PROFILE_SESSION_DETAIL.replace(
                            ":id",
                            session.id
                          )
                        );
                        window.scrollTo(0, 0);
                      }}
                      className="text-xs font-regular text-gray-700 underline hover:text-violet/70"
                    >
                      Voir plus
                    </button>
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
