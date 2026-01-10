import { Users, User } from "lucide-react";
import { getImageUrl } from "../../../../utils/imageUtils";

export default function SessionParticipantsSection({
  session,
  participants,
  formatDate,
}) {
  return (
    <div className="rounded-2xl p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-noir">Les participants</h2>
      </div>
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-beige rounded-lg">
          <Users className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-noir">
            Capacité {participants.length}/{session.capacity}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                NOM
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                STATUTS
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                MÉTHODE DE PAIEMENT
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                DATE
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => {
              return (
                <tr
                  key={participant.participationId}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {participant.userImageUrl ? (
                        <img
                          src={getImageUrl(participant.userImageUrl)}
                          alt={participant.userName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-noir">
                        {participant.userName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-vert text-noir">
                      PAYÉ
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {participant.paymentMethod === "apple_pay" ? (
                        <>
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                          </svg>
                          <span className="text-sm text-gray-700">
                            Apple Pay
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">Carte</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(
                      participant.paymentDate ||
                        participant.createdAt ||
                        new Date()
                    )}
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
