import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import SessionDetailHeader from "../../components/admin/session/sessionDetails/SessionDetailHeader";
import SessionDetailSidebar from "../../components/admin/session/sessionDetails/SessionDetailSidebar";
import SessionInfoSection from "../../components/admin/session/sessionDetails/SessionInfoSection";
import SessionParticipantsSection from "../../components/admin/session/sessionDetails/SessionParticipantsSection";
import SessionEmargementsSection from "../../components/admin/session/sessionDetails/SessionEmargementsSection";
import SessionNotesSection from "../../components/admin/session/sessionDetails/SessionNotesSection";
import SessionAttestationsSection from "../../components/admin/session/sessionDetails/SessionAttestationsSection";

export default function SessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [attestations, setAttestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("info");

  useEffect(() => {
    loadSessionData();
    window.scrollTo(0, 0);
  }, [id]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      const [sessionRes, detailsRes] = await Promise.all([
        api.get(`/sessions/${id}`),
        api.get(`/statistics/sessions/${id}/details`),
      ]);

      setSession(sessionRes.data);
      setSessionDetails(detailsRes.data);

      const participantsData = detailsRes.data.participants || [];
      setParticipants(participantsData);

      const attestationsData = [];
      participantsData.forEach((participant) => {
        if (
          participant.attestations &&
          Array.isArray(participant.attestations)
        ) {
          attestationsData.push(
            ...participant.attestations.map((attestation) => ({
              ...attestation,
              participationId: participant.participationId,
            }))
          );
        }
      });
      setAttestations(attestationsData);
    } catch (error) {
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

  const handleEdit = () => {
    navigate(`/admin/sessions?edit=${id}`);
  };

  const handleDownloadAttestation = async (attestationId) => {
    try {
      const response = await api.get(
        `/attestations/download/${attestationId}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attestation.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erreur lors du téléchargement de l'attestation");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Session introuvable</p>
      </div>
    );
  }

  const totalAttestations = attestations.filter(
    (attestation) => attestation.type === "SUCCESS"
  ).length;
  const totalPresenceAttestations = attestations.filter(
    (attestation) => attestation.type === "PRESENCE"
  ).length;

  const participantsMap = {};
  participants.forEach((participant) => {
    participantsMap[participant.participationId] = {
      participation: participant,
      hasSigned: participant.hasSigned,
      signedAt: participant.signedAt,
      hasNote: participant.hasNote,
      note: participant.note,
      noteLocked: participant.noteLocked,
      attestations: attestations.filter(
        (attestation) =>
          attestation.participationId === participant.participationId
      ),
    };
  });

  const renderActiveSection = () => {
    switch (activeSection) {
      case "info":
        return (
          <SessionInfoSection session={session} participants={participants} />
        );
      case "participants":
        return (
          <SessionParticipantsSection
            session={session}
            participants={participants}
            formatDate={formatDate}
          />
        );
      case "emargements":
        return (
          <SessionEmargementsSection
            session={session}
            participants={participants}
            participantsMap={participantsMap}
            formatDate={formatDate}
          />
        );
      case "notes":
        return (
          <SessionNotesSection
            participants={participants}
            participantsMap={participantsMap}
            formatDate={formatDate}
          />
        );
      case "attestations":
        return (
          <SessionAttestationsSection
            session={session}
            participants={participants}
            participantsMap={participantsMap}
            totalPresenceAttestations={totalPresenceAttestations}
            totalAttestations={totalAttestations}
            formatDate={formatDate}
            onDownloadAttestation={handleDownloadAttestation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 border-r border-gray-200 pr-6">
          <SessionDetailHeader session={session} onEdit={handleEdit} />
          <div>{renderActiveSection()}</div>
        </div>

        <SessionDetailSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>
    </div>
  );
}
