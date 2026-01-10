import { formatDate } from "../../../utils/formatUtils";
import { Flame, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";

export default function SessionEnApproche({ session }) {
  if (!session) {
    return (
      <div className="bg-violet p-6 rounded-2xl">
        <div>
          <p className="text-lg font-medium text-noir">
            Aucune session à venir
          </p>
          <p className="text-sm text-gray-600">
            Rappel : pensez à émarger pour valider votre présence
          </p>
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-blanc text-noir rounded-full text-sm mt-4">
            <Clock className="w-4 h-4" /> En attente d'une nouvelle session
          </span>
        </div>
      </div>
    );
  }
  const navigate = useNavigate();
  const maintenant = new Date();
  const dateSession = new Date(session.startDate);
  const finSession = new Date(`${session.endDate}T${session.endTime}`);
  const estEnCours = maintenant >= dateSession && maintenant <= finSession;

  return (
    <div className="bg-violet p-6 rounded-2xl">
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 md:col-span-6 space-y-3">
            <h3 className="text-lg font-semibold text-noir">
              Session : {session.title}
            </h3>
            <p className="text-sm text-gra">
              {" "}
              Rappel : pensez à émarger pour valider votre présence
            </p>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm bg-fond text-noir">
              {estEnCours ? (
                <Flame className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              {estEnCours ? "Maintenant" : "Session en approche"}
            </span>
          </div>
          <div className="col-span-12 md:col-span-6 flex justify-center items-center bg-fond rounded-xl md:ml-12 md:px-12 py-9">
            <div className=" text-noir flex flex-col items-center">
              <span>Début : {formatDate(session.startDate)}</span>
              <span>
                Fin : {formatDate(`${session.endDate}T${session.endTime}`)}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate(ROUTES.PROFILE_SESSION_DETAIL.replace(":id", session.id))
          }
          className="rounded-full px-6 py-2 bg-noir text-blanc hover:bg-blanc hover:text-noir transition-colors"
        >
          Voir la session et émarger
        </button>
      </div>
    </div>
  );
}
