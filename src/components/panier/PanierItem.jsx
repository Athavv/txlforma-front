import { Trash2 } from "lucide-react";
import { formatDateShort, formatTime } from "../../utils/dateUtils";
import { getImageUrl } from "../../utils/imageUtils";

export default function PanierItem({
  panierSession,
  formation,
  onRemove,
  isRemoving,
}) {
  const session = panierSession.session;
  const formationTitle = formation?.title || "Formation";
  const imageUrl = session.formationImageUrl || formation?.imageUrl;

  return (
    <div className="bg-white rounded-2xl px-6 py-9 shadow-sm relative">
      <button
        onClick={() => onRemove(panierSession.sessionId)}
        disabled={isRemoving}
        className="absolute top-4 right-4 text-orange-500 hover:text-orange-700 text-sm flex items-center gap-1 mr-3"
      >
        <Trash2 className="h-4 w-4" style={{ stroke: '#f97316' }} /> 
        <span style={{ color: '#f97316', textDecoration: 'underline'}}>
        {isRemoving ? "Suppression..." : "Supprimer"}
        </span>
      </button>

      <div className="flex gap-10">
        <div className="w-72 h-48 bg-gray-200 rounded-lg flex-shrink-0">
          {imageUrl ? (
            <img
              src={getImageUrl(imageUrl)}
              alt={formationTitle}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Pas d'image
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-medium mb-3">{formationTitle}</h3>
          <div className="space-y-4">
            <p>
              <span className="font-medium">Prix :</span> {session.price}€
            </p>
            {session.level && (
              <p>
                <span className="font-medium">Niveau :</span> {session.level}
              </p>
            )}
            <p>
              <span className="font-medium">Date :</span>{" "}
              {formatDateShort(session.startDate)}
            </p>
            <p>
              <span className="font-medium">Heure :</span>{" "}
              {formatTime(session.startTime)}
              {session.endTime && ` - ${formatTime(session.endTime)}`}
            </p>
            <p>
              <span className="font-medium">Formateur :</span>{" "}
              {session.formateurName || "Non spécifié"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
