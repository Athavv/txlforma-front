import { Users, User, NotebookPen } from "lucide-react";
import { useState, useMemo } from "react";
import { noteService } from "../../../api/note.service";
import { getImageUrl } from "../../../utils/imageUtils";

export default function SessionParticipantsFormateurSection({
  session,
  participants,
  notes,
  formatDate,
}) {
  const [notesMap, setNotesMap] = useState(
    notes.reduce((acc, note) => {
      acc[note.participationId] = note;
      return acc;
    }, {})
  );

  const [isEditingAllNotes, setIsEditingAllNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState({});

  const { limitDate, remainingDays } = useMemo(() => {
    if (!session?.endDate) return { limitDate: null, remainingDays: 0 };

    const end = new Date(session.endDate);
    end.setDate(end.getDate() + 14);

    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { limitDate: end, remainingDays: diffDays > 0 ? diffDays : 0 };
  }, [session.endDate]);

  const getStatusLabel = (status, isSessionFinished, hasParticipationAt) => {
    switch (status) {
      case "PRESENT":
      case "VALIDE":
        return "ÉMARGÉ";
      case "ABSENT":
        return "NON ÉMARGÉ";
      case "INSCRIT":
      default:
        if (hasParticipationAt) {
          return "ÉMARGÉ";
        }
        return isSessionFinished ? "ABSENT" : "EN ATTENTE";
    }
  };

  const getStatusColor = (status, isSessionFinished, hasParticipationAt) => {
    switch (status) {
      case "PRESENT":
      case "VALIDE":
        return "bg-vert text-noir";
      case "ABSENT":
        return "bg-orange text-noir";
      case "INSCRIT":
      default:
        if (hasParticipationAt) {
          return "bg-vert text-noir";
        }
        return isSessionFinished
          ? "bg-orange text-noir"
          : "bg-gray-200 text-gray-700";
    }
  };

  const hasAtLeastOneNote = participants.some(
    (particip) =>
      particip.status === "PRESENT" &&
      notesMap[particip.participationId]?.note !== undefined &&
      notesMap[particip.participationId]?.note !== null &&
      notesMap[particip.participationId]?.note !== ""
  );

  const hasAtLeastOneEmargedParticipant = participants.some(
    (particip) => particip.status === "PRESENT"
  );

  return (
    <div className="rounded-2xl p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-noir">Les participants</h2>
      </div>

      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-beige rounded-lg">
          <Users className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-noir">
            Capacité {participants.length}/{session.capacity}
          </span>
        </div>

        {hasAtLeastOneNote && remainingDays > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-beige rounded-lg">
            <NotebookPen className="h-5 w-5 text-gray-700" />
            <span className="text-sm">
              Notes modifiables jusqu’au{" "}
              <span className="font-semibold">
                {limitDate.toLocaleDateString("fr-FR")}
              </span>{" "}
              ({remainingDays} jour{remainingDays > 1 ? "s" : ""} restants).
            </span>
          </div>
        )}

        <div className="mt-2 md:mt-0 md:ml-auto">
          {hasAtLeastOneEmargedParticipant && (
            <button
              onClick={async () => {
                if (isEditingAllNotes) {
                  for (const participant of participants) {
                    if (
                      participant.status !== "PRESENT" &&
                      participant.status !== "VALIDE" &&
                      !participant.participationAt
                    )
                      continue;

                    const value = notesDraft[participant.participationId];
                    if (value === undefined || value === "") continue;

                    const existingNote = notesMap[participant.participationId];

                    if (existingNote) {
                      await noteService.updateNote(existingNote.id, value);
                    } else {
                      await noteService.createNote(
                        participant.participationId,
                        value
                      );
                    }
                  }

                  setNotesMap((prev) => ({
                    ...prev,
                    ...Object.fromEntries(
                      Object.entries(notesDraft).map(
                        ([participationId, noteValue]) => [
                          participationId,
                          { ...prev[participationId], note: noteValue },
                        ]
                      )
                    ),
                  }));

                  setIsEditingAllNotes(false);
                } else {
                  setNotesDraft(
                    participants.reduce((acc, particip) => {
                      if (particip.status === "PRESENT") {
                        acc[particip.participationId] =
                          notesMap[particip.participationId]?.note || "";
                      }
                      return acc;
                    }, {})
                  );
                  setIsEditingAllNotes(true);
                }
              }}
              className="bg-black text-white rounded-full px-6 py-3 whitespace-nowrap hover:-translate-y-1 transition-all"
            >
              {isEditingAllNotes
                ? "Confirmer les notes"
                : hasAtLeastOneNote
                ? "Modifier les notes"
                : "Ajouter les notes"}
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                NOM
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                STATUT
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                DATE EMARGEMENT
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                NOTE
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => {
              const note = notesMap[participant.participationId];
              const isSessionFinished =
                session.endDate && new Date(session.endDate) < new Date();
              const hasParticipationAt = !!participant.participationAt;

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
                        <div className="h-8 w-8 rounded-full bg-beige2 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-noir">
                        {participant.userName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                        participant.status,
                        isSessionFinished,
                        hasParticipationAt
                      )}`}
                    >
                      {getStatusLabel(
                        participant.status,
                        isSessionFinished,
                        hasParticipationAt
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {participant.participationAt
                      ? formatDate(participant.participationAt)
                      : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {participant.status !== "PRESENT" &&
                    participant.status !== "VALIDE" &&
                    !hasParticipationAt ? (
                      <span className="text-sm text-gray-400">-</span>
                    ) : (
                      <div className="flex items-center gap-1 w-[64px]">
                        {isEditingAllNotes ? (
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={
                              notesDraft[participant.participationId] ?? ""
                            }
                            onChange={(element) =>
                              setNotesDraft((prev) => ({
                                ...prev,
                                [participant.participationId]:
                                  element.target.value,
                              }))
                            }
                            className="w-[45px] text-sm text-center bg-beige rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-beige2"
                          />
                        ) : notesMap[participant.participationId] ? (
                          <span className="w-[45px] text-sm text-center text-gray-600">
                            {notesMap[participant.participationId].note}
                          </span>
                        ) : (
                          <span className="w-[45px] text-sm text-center text-gray-400">
                            –
                          </span>
                        )}

                        <span className="text-sm text-gray-600">/20</span>
                      </div>
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
