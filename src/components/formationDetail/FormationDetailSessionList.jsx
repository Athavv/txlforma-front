import { ShoppingCart, CheckCircle } from "lucide-react";
import { formatDateShort, formatTime } from "../../utils/dateUtils";

export default function FormationDetailSessionList({
  sessions,
  onAddToPanier,
  panierItems,
  paidSessions = new Set(),
  panierLoading = false,
}) {
  const isInPanier = (sessionId) => {
    return panierItems.has(sessionId);
  };

  const isPaid = (sessionId) => {
    return paidSessions.has(sessionId);
  };

  if (sessions.length === 0) {
    return (
      <p className="text-orange text-sm px-8">Aucune session disponible</p>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`px-8 p-4 flex items-center justify-between gap-4 border-b border-gray-200 ${
            session.isFull ? "opacity-60" : ""
          }`}
        >
          <div className="flex flex-col">
            {session.isFull ? (
              <div className="text-lg text-red-600 font-medium mb-2 px-8">
                Session complète
              </div>
            ) : (
              session.remainingPlaces !== undefined && (
                <div className="text-xs text-orange mb-2">
                  * {session.remainingPlaces} place(s) restante(s)
                </div>
              )
            )}
            <div>
              <div className="font-medium text-[16px] text-gray-900">
                {formatDateShort(session.startDate)}
              </div>
              <div className="text-[14px] text-noir mt-1">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </div>
              <div className="text-[18px] text-noir mt-1">
                {session.price} €
              </div>
            </div>
          </div>
          <button
            onClick={() => onAddToPanier(session.id)}
            disabled={
              panierLoading ||
              session.isFull ||
              isInPanier(session.id) ||
              isPaid(session.id)
            }
            className={`py-2 px-10 text-[18px] rounded-full font-regular flex items-center justify-center gap-2 transition-colors hover:bg-violet ${
              panierLoading
                ? "bg-gray-200 text-gray-400 cursor-wait"
                : isPaid(session.id)
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : session.isFull || isInPanier(session.id)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {panierLoading ? (
              "Chargement..."
            ) : isPaid(session.id) ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Déjà payé
              </>
            ) : isInPanier(session.id) ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="text-[16px]">Déjà dans le panier</span>
              </>
            ) : session.isFull ? (
              "Session complète"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Ajouter
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
