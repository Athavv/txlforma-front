import { Users, User } from "lucide-react";

export default function SessionEmargementsSection({
  session,
  participants,
  participantsMap,
  formatDate,
}) {
  return (
    <div className="rounded-2xl p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-noir">Émargement</h2>
      </div>
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-beige rounded-lg">
          <Users className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-noir">
            Total émargé{" "}
            {participants.filter((participant) => participantsMap[participant.participationId]?.hasSigned).length}/
            {session.capacity}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-noir">
                NOM
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-noir">
                STATUTS
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-noir">
                ÉMARGER LE
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => {
              const participantData = participantsMap[participant.participationId];
              const status = participantData?.hasSigned
                ? "ÉMARGÉ"
                : participant.status === "PAYE"
                ? "EN ATTENTE"
                : "NON ÉMARGÉ";
              const statusColor =
                status === "ÉMARGÉ"
                  ? "bg-vert/20 text-vert"
                  : status === "EN ATTENTE"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-orange/20 text-orange";

              return (
                <tr
                  key={participant.participationId}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-beige2 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-noir">
                        {participant.userName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {participantData?.signedAt
                      ? formatDate(participantData.signedAt)
                      : "-"}
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


