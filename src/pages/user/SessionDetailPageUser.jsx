import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sessionService } from "../../api/session.service";
import { participationService } from "../../api/participation.service";
import { attestationService } from "../../api/attestation.service";
import SessionDetailHeader from "../../components/admin/session/sessionDetails/SessionDetailHeader";
import SessionInfoSection from "../../components/admin/session/sessionDetails/SessionInfoSection";
import { ROUTES } from "../../constants";

export default function SessionDetailPageUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participation, setParticipation] = useState(null);
  const [participationId, setParticipationId] = useState(null);
  const [attestations, setAttestations] = useState({
    presence: null,
    success: null,
  });

  const chargerSession = useCallback(async () => {
    try {
      setLoading(true);

      const sessionResponse = await sessionService.getSessionById(id);
      if (!sessionResponse.success || !sessionResponse.data) {
        setSession(null);
        return;
      }

      const sessionData = sessionResponse.data;
      setSession(sessionData);

      const participationResponse = await participationService.getMyParticipations();
      let foundParticipationId = null;

      if (participationResponse.success && Array.isArray(participationResponse.data)) {
        const participationFound = participationResponse.data.find(
          (participation) => participation.sessionId === sessionData.id
        );

        if (participationFound) {
          setParticipation(participationFound);
          setParticipationId(participationFound.id);
          foundParticipationId = participationFound.id;
        }
      }

      const attestationResponse = await attestationService.getMyAttestations();

      if (attestationResponse.success && Array.isArray(attestationResponse.data)) {
        const attestationsFiltrees = attestationResponse.data.filter(
          (attestation) => attestation.participationId === foundParticipationId
        );

        setAttestations({
          presence: attestationsFiltrees.find((attestation) => attestation.type === "PRESENCE") || null,
          success: attestationsFiltrees.find((attestation) => attestation.type === "SUCCES") || null,
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    chargerSession();
    window.scrollTo(0, 0);
  }, [chargerSession]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement en cours...</div>
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

  const maintenant = new Date();
  const debutSession = new Date(`${session.startDate}T${session.startTime}`);
  const finSession = new Date(`${session.endDate}T${session.endTime}`);
  const estEnCours = maintenant >= debutSession && maintenant <= finSession;
  const estTerminee = maintenant > finSession;

  return (
    <div className="space-y-6 p-6">
      <div onClick={() => navigate(ROUTES.PROFILE)} className="cursor-pointer text-sm text-noir hover:underline px-5">
        ← Retour
      </div>

      <SessionDetailHeader session={session} onEdit={null} />

      <div className="flex flex-col items-start gap-2 w-fit px-5">
        {!estEnCours && !estTerminee && (
          <p className="text-sm text-orange">
            *Vous ne pouvez pas émarger tant que la session n'a pas commencé.
          </p>
        )}

        {participation?.status === "PRESENT" || participation?.status === "VALIDE" ? (
          <div className="inline-block px-12 py-4 bg-vert text-noir rounded-full border border-vert text-[16px] font-medium">
            Déjà émargé
          </div>

        ) : estEnCours ? (
          <a
            href={`/emargement/${participationId}`}
            className="inline-block px-12 py-4 bg-orange text-white rounded-full hover:bg-orange-600 transition text-[16px] font-medium"
          >
            Émarger maintenant
          </a>

        ) : estTerminee ? (
          <button
            disabled
            className="inline-block px-12 py-3 bg-gray-700 text-white rounded-full text-[16px] font-medium cursor-not-allowed"
          >
            Non émargé (session terminée)
          </button>

        ) : (
          <button
            disabled
            className="inline-block px-12 py-3 bg-gray-700 text-blanc rounded-full text-[16px] font-medium cursor-not-allowed"
          >
            Émargement en attente
          </button>
        )}

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 border-r border-gray-200 pr-6">
          <SessionInfoSection session={session} participants={[]} showParticipants={false} />
        </div>
        <div className="pl-6 space-y-4">
          <div className="rounded-2xl bg-violet p-4 min-h-[120px] flex flex-col justify-between">
            <span className="font-semibold text-noir text-[24px]">Votre note</span>
            <span
              className={`font-semibold mt-2 ${participation?.note ? "text-[42px]" : "text-[20px]"
                }`}
            >
              {participation?.note ?? "Aucune note"}
            </span>

          </div>
          <div className="rounded-2xl bg-orange p-4 min-h-[120px] flex flex-col justify-between">
            <span className="font-semibold text-noir text-[24px]">Attestation de présence</span>
            <span className="text-sm mt-2">
              {estTerminee && participation?.status !== "PRESENT" && participation?.status !== "VALIDE" ? (
                <span className="text-noir text-[20px] font-medium">Absent</span>
              ) : attestations.presence ? (
                <button
                  onClick={() =>
                    attestationService.downloadAttestation(attestations.presence.id)
                  }
                  className="inline-block px-4 py-2 bg-noir text-blanc rounded-full hover:bg-blanc hover:text-noir transition text-sm font-regular"
                >
                  Télécharger mon attestation de présence
                </button>
              ) : (
                <span className="font-semibold text-[20px]">Non disponible</span>
              )}
            </span>
          </div>
          <div className="rounded-2xl bg-vert p-4 min-h-[120px] flex flex-col justify-between">
            <span className="font-semibold text-noir text-[24px]">Attestation de réussite</span>
            <span className="text-sm mt-2">
              {estTerminee && participation?.status !== "PRESENT" && participation?.status !== "VALIDE" ? (
                <span className="text-noir text-[20px] font-medium">Absent</span>
              ) : attestations.success ? (
                <button
                  onClick={() => attestationService.downloadAttestation(attestations.success.id)}
                  className="inline-block px-4 py-2 bg-noir text-blanc rounded-full hover:bg-blanc hover:text-noir transition text-sm font-regular"
                >
                  Télécharger mon attestation de réussite
                </button>
              ) : participation?.note !== null && participation?.note !== undefined ? (
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-[20px]">Non disponible</span>
                  <span className="text-xs text-gray-600">
                    L'attestation sera disponible 2 semaines après la fin de la session pour permettre aux formateurs de corriger d'éventuelles erreurs.
                  </span>
                </div>
              ) : (
                <span className="font-semibold text-[20px]">Non disponible</span>
              )}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
