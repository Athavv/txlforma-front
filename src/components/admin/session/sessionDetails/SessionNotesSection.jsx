import { Users, User } from "lucide-react";

export default function SessionNotesSection({
  participants,
  participantsMap,
  formatDate,
}) {
  const participantsWithNotes = participants.filter(
    (participant) => participantsMap[participant.participationId]?.hasNote
  );
  const averageNote =
    participantsWithNotes.length > 0
      ? (
          participantsWithNotes.reduce(
            (sum, participant) => sum + (participantsMap[participant.participationId]?.note || 0),
            0
          ) / participantsWithNotes.length
        ).toFixed(1)
      : "0";

  return (
    <div className="rounded-2xl p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-noir">Notes</h2>
      </div>
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-beige  rounded-lg">
          <Users className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-noir">
            Moyenne session {averageNote}
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
                NOTE ATTRIBUÉE
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                ASSIGNÉE LE
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => {
              const participantData = participantsMap[participant.participationId];
              const note = participantData?.note;
              return (
                <tr
                  key={participant.participationId}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-noir">
                        {participant.userName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {note !== undefined && note !== null ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          note >= 10
                            ? "bg-vert/20 text-vert"
                            : "bg-orange/20 text-orange"
                        }`}
                      >
                        {note}/20
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {participantData?.hasNote ? formatDate(new Date()) : "-"}
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


