import { Users, User, Download, X } from "lucide-react";

export default function SessionAttestationsSection({
  session,
  participants,
  participantsMap,
  totalPresenceAttestations,
  totalAttestations,
  formatDate,
  onDownloadAttestation,
}) {
  return (
    <div className="rounded-2xl p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-noir">Attestations</h2>
      </div>
      <div className="mb-4 flex gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-beige rounded-lg">
          <Users className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-noir">
            Total attestation de présence {totalPresenceAttestations}/
            {session.capacity}
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-beige rounded-lg">
          <Users className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-noir">
            Total attestation de succès {totalAttestations}/{session.capacity}
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
                Attestation de présence
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Attestation de succès
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                MISE À JOUR LE
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => {
              const userAttestations =
                participantsMap[participant.participationId]?.attestations || [];
              const presenceAttestation = userAttestations.find(
                (attestation) => attestation.type === "PRESENCE"
              );
              const successAttestation = userAttestations.find(
                (attestation) => attestation.type === "SUCCESS"
              );

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
                    {presenceAttestation ? (
                      <button
                        onClick={() =>
                          onDownloadAttestation(presenceAttestation.id)
                        }
                        className="px-3 py-1 bg-vert text-white rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-vert/90"
                      >
                        <Download className="h-3 w-3" />
                        Disponible
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-orange/20 text-orange rounded-full text-xs font-semibold flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Indisponible
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {successAttestation ? (
                      <button
                        onClick={() =>
                          onDownloadAttestation(successAttestation.id)
                        }
                        className="px-3 py-1 bg-vert text-white rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-vert/90"
                      >
                        <Download className="h-3 w-3" />
                        Disponible
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-orange/20 text-orange rounded-full text-xs font-semibold flex items-center gap-1">
                        <X className="h-3 w-3" />
                        Indisponible
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {successAttestation
                      ? formatDate(successAttestation.generatedAt)
                      : presenceAttestation
                      ? formatDate(presenceAttestation.generatedAt)
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


