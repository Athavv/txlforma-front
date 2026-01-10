import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { participationService } from "../../api/participation.service";
import { noteService } from "../../api/note.service";
import SessionDetailHeader from "../../components/admin/session/sessionDetails/SessionDetailHeader";
import SessionInfoSection from "../../components/admin/session/sessionDetails/SessionInfoSection";
import SessionParticipantsFormateurSection from "../../components/formateur/session/SessionParticipantsFormateurSection";

export default function SessionDetailFormateur() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeSection, setActiveSection] = useState("info");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessionData();
    window.scrollTo(0, 0);
  }, [id]);

  const loadSessionData = async () => {
    try {
      setLoading(true);

      const [sessionResponse, participantsResponse, notesResponse] =
        await Promise.all([
          api.get(`/sessions/${id}`),
          participationService.getParticipationsBySession(id),
          noteService.getNotesBySession(id),
        ]);

      if (!sessionResponse.data) {
        return;
      }

      setSession(sessionResponse.data);

      const participantsData = participantsResponse.success
        ? participantsResponse.data.map((participant) => ({
            participationId: participant.id,
            userId: participant.userId,
            userName: `${participant.userFirstname || ""} ${
              participant.userLastname || ""
            }`.trim(),
            userEmail: participant.userEmail,
            userImageUrl: participant.userImageUrl,
            status: participant.status,
            participationAt: participant.participationAt,
            createdAt: participant.createdAt,
          }))
        : [];

      setParticipants(participantsData);

      if (notesResponse.success && notesResponse.data) {
        setNotes(notesResponse.data);
      }
    } catch (apiError) {
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "info":
        return (
          <SessionInfoSection session={session} participants={participants} />
        );
      case "participants":
        return (
          <SessionParticipantsFormateurSection
            session={session}
            participants={participants}
            notes={notes}
            formatDate={formatDate}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Session introuvable</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 border-r border-gray-200 pr-6">
          <SessionDetailHeader session={session} onEdit={null} />
          <div>{renderActiveSection()}</div>
        </div>

        <div className="px-6">
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-noir">
              Informations de la session
            </h3>
            <div className="h-[2px] bg-gray-200 rounded-full mt-4"></div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-vert p-4 min-h-[120px] flex flex-col justify-between">
              <div>
                <span className="font-semibold text-noir">
                  Informations générales
                </span>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setActiveSection("info")}
                  className="px-5 py-2 bg-noir text-white rounded-full hover:bg-blanc hover:text-noir transition-colors text-xs font-medium"
                >
                  Voir plus
                </button>
              </div>
            </div>
            <div className="rounded-2xl bg-violet p-4 min-h-[120px] flex flex-col justify-between">
              <div>
                <span className="font-semibold text-noir">
                  Les participants
                </span>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setActiveSection("participants")}
                  className="px-5 py-2 bg-noir text-white rounded-full hover:bg-blanc hover:text-noir transition-colors text-xs font-medium"
                >
                  Voir plus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
