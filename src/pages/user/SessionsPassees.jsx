import { useEffect, useState } from "react";
import { participationService } from "../../api/participation.service";
import { attestationService } from "../../api/attestation.service";
import { ArrowLeft, ArrowRight } from "lucide-react";

import SessionsPastUser from "../../components/user/session/SessionsPastUser";
import SessionsInProgressUser from "../../components/user/session/SessionsInProgressUser";
import SessionsUpcomingUser from "../../components/user/session/SessionsUpcomingUser";

export default function SessionPassees() {
  const [sessionsPassees, setSessionsPassees] = useState([]);
  const [sessionsEnCours, setSessionsEnCours] = useState([]);
  const [sessionsAvenir, setSessionsAvenir] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inProgressIndex, setInProgressIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);

  const IN_PROGRESS_PER_PAGE = 1;
  const UPCOMING_PER_PAGE = 2;

  const [pastVisibleCount, setPastVisibleCount] = useState(5);

  useEffect(() => {
    async function chargerSessions() {
      try {
        setLoading(true);
        const participationsResponse =
          await participationService.getMyParticipations();
        if (!participationsResponse.success) return;
        const attestationsResponse =
          await attestationService.getMyAttestations();
        const maintenant = new Date();
        const listeParticipations = participationsResponse.data || [];
        const listeAttestations = attestationsResponse.success
          ? attestationsResponse.data
          : [];
        const sessionsTerminees = listeParticipations.filter(
          (participation) => {
            const dateFin = new Date(
              `${participation.endDate}T${participation.endTime}`
            );
            return dateFin < maintenant;
          }
        );
        const sessionsEnCoursTemp = listeParticipations
          .filter((participation) => {
            const dateDebut = new Date(
              `${participation.startDate}T${participation.startTime}`
            );
            const dateFin = new Date(
              `${participation.endDate}T${participation.endTime}`
            );
            return maintenant >= dateDebut && maintenant <= dateFin;
          })
          .map((participation) => ({
            id: participation.sessionId,
            participationId: participation.id,
            formationTitle: participation.formationTitle,
            formationDescription: participation.formationDescription,
            formationImageUrl: participation.formationImageUrl,
            categoryName: participation.categoryName,
            startDate: `${participation.startDate}T${participation.startTime}`,
            endDate: participation.endDate,
            endTime: participation.endTime,
          }));
        const sessionsAvenirTemp = listeParticipations
          .filter((participation) => {
            const dateDebut = new Date(
              `${participation.startDate}T${participation.startTime}`
            );
            return dateDebut > maintenant;
          })
          .map((participation) => ({
            id: participation.sessionId,
            participationId: participation.id,
            formationTitle: participation.formationTitle,
            formationDescription: participation.formationDescription,
            formationImageUrl: participation.formationImageUrl,
            categoryName: participation.categoryName,
            startDate: `${participation.startDate}T${participation.startTime}`,
            endDate: participation.endDate,
            endTime: participation.endTime,
            formateur: `${participation.formateurFirstname} ${participation.formateurLastname}`,
          }));
        const sessionsFormatees = sessionsTerminees.map((participation) => {
          const attestationPresence =
            listeAttestations.find(
              (attestation) =>
                attestation.participationId === participation.id &&
                attestation.type === "PRESENCE"
            ) || null;
          const attestationSucces =
            listeAttestations.find(
              (attestation) =>
                attestation.participationId === participation.id &&
                attestation.type === "SUCCES"
            ) || null;
          return {
            id: participation.sessionId,
            participationId: participation.id,
            title: participation.formationTitle,
            note: participation.note ?? null,
            status: participation.status,
            formateur: `${participation.formateurFirstname} ${participation.formateurLastname}`,
            formateurImageUrl: participation.formateurImageUrl,
            startDate: `${participation.startDate}T${participation.startTime}`,
            endDate: participation.endDate,
            endTime: participation.endTime,
            categoryName: participation.categoryName,
            formationDescription: participation.formationDescription,
            attestationPresence,
            attestationSuccess: attestationSucces,
          };
        });

        setSessionsPassees(sessionsFormatees);
        setSessionsEnCours(sessionsEnCoursTemp);
        setSessionsAvenir(sessionsAvenirTemp);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    chargerSessions();
  }, []);

  const visiblePastSessions = sessionsPassees
    .sort(
      (sessionA, sessionB) =>
        new Date(sessionB.startDate) - new Date(sessionA.startDate)
    )
    .slice(0, pastVisibleCount);

  const paginate = (items, index, perPage) =>
    items.slice(index, index + perPage);

  const goNext = (index, setIndex, perPage, total) => {
    if (index + perPage < total) setIndex(index + perPage);
  };

  const goPrev = (index, setIndex, perPage) => {
    if (index > 0) setIndex(index - perPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-5 sm:px-6 lg:px-0">
      <h1 className="text-2xl md:text-4xl font-semibold text-noir">
        Mes Sessions
      </h1>

      <div>
        <div className="flex items-center mb-3 mt-2">
          <h2 className="text-xl font-medium text-noir">
            Sessions en cours ({sessionsEnCours.length})
          </h2>

          {sessionsEnCours.length > 1 && (
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() =>
                  goPrev(
                    inProgressIndex,
                    setInProgressIndex,
                    IN_PROGRESS_PER_PAGE
                  )
                }
                disabled={inProgressIndex === 0}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:bg-[#FF4F01] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-7 h-7 text-noir" />
              </button>

              <button
                onClick={() =>
                  goNext(
                    inProgressIndex,
                    setInProgressIndex,
                    IN_PROGRESS_PER_PAGE,
                    sessionsEnCours.length
                  )
                }
                disabled={
                  inProgressIndex + IN_PROGRESS_PER_PAGE >=
                  sessionsEnCours.length
                }
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:bg-[#FF4F01] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-7 h-7 text-noir" />
              </button>
            </div>
          )}
        </div>

        <SessionsInProgressUser
          sessions={paginate(
            sessionsEnCours,
            inProgressIndex,
            IN_PROGRESS_PER_PAGE
          )}
        />
      </div>

      <div>
        <div className="flex items-center mb-3 mt-2">
          <h2 className="text-xl font-medium text-noir">
            Sessions à venir ({sessionsAvenir.length})
          </h2>

          {sessionsAvenir.length > 2 && (
            <div className="ml-auto flex gap-3">
              <button
                onClick={() =>
                  goPrev(upcomingIndex, setUpcomingIndex, UPCOMING_PER_PAGE)
                }
                disabled={upcomingIndex === 0}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:bg-[#FF4F01] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-7 h-7 text-noir" />
              </button>

              <button
                onClick={() =>
                  goNext(
                    upcomingIndex,
                    setUpcomingIndex,
                    UPCOMING_PER_PAGE,
                    sessionsAvenir.length
                  )
                }
                disabled={
                  upcomingIndex + UPCOMING_PER_PAGE >= sessionsAvenir.length
                }
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:bg-[#FF4F01] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-7 h-7 text-noir" />
              </button>
            </div>
          )}
        </div>

        <SessionsUpcomingUser
          sessions={paginate(sessionsAvenir, upcomingIndex, UPCOMING_PER_PAGE)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 mt-2">
          <h2 className="text-xl font-medium text-noir">
            Sessions passées ({sessionsPassees.length})
          </h2>

          {pastVisibleCount < sessionsPassees.length && (
            <button
              onClick={() => setPastVisibleCount((prev) => prev + 5)}
              className="text-sm underline hover:text-[#FF4F01]"
            >
              Voir plus
            </button>
          )}

          {pastVisibleCount > 5 && (
            <button
              onClick={() => setPastVisibleCount(5)}
              className="text-sm underline hover:text-[#FF4F01] ml-4"
            >
              Voir moins
            </button>
          )}
        </div>
        <SessionsPastUser sessions={visiblePastSessions} />
      </div>
    </div>
  );
}
