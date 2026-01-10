import { useEffect, useState } from "react";
import { participationService } from "../../api/participation.service";
import { formationService } from "../../api/formation.service";
import DerniersResultats from "../../components/user/dashboard/DerniersResultats";
import SessionEnApproche from "../../components/user/dashboard/SessionEnApproche";
import StatsGlobales from "../../components/user/dashboard/StatsGlobales";
import SessionAVenir from "../../components/user/dashboard/SessionAVenir";
import HistoriqueSession from "../../components/user/dashboard/HistoriqueSession";
import SuggestionsFormations from "../../components/user/dashboard/SuggestionsFormations";
import { formatDate } from "../../utils/formatUtils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

export default function UserDashboard() {
  const [sessionEnApproche, setSessionEnApproche] = useState(null);
  const [sessionsFutures, setSessionsFutures] = useState([]);
  const [sessionsPassees, setSessionsPassees] = useState([]);
  const [suggestionsFormations, setSuggestionsFormations] = useState([]);
  const [derniereNote, setDerniereNote] = useState(null);
  const [derniereSession, setDerniereSession] = useState(null);
  const [statsGlobales, setStatsGlobales] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function chargerSessionsUtilisateur() {
      const resultatParticipations =
        await participationService.getMyParticipations();
      if (!resultatParticipations.success || !resultatParticipations.data)
        return;

      const dateActuelle = new Date();
      const listeParticipations = resultatParticipations.data;
      const sessionsActives = listeParticipations.filter((participation) => {
        const dateDebut = new Date(
          `${participation.startDate}T${participation.startTime}`
        );
        const dateFin = new Date(
          `${participation.endDate}T${participation.endTime}`
        );

        return (
          (dateActuelle >= dateDebut && dateActuelle <= dateFin) ||
          dateActuelle < dateDebut
        );
      });

      if (sessionsActives.length > 0) {
        const sessionLaPlusProche = sessionsActives.reduce(
          (session1, session2) => {
            const dateDebut1 = new Date(
              `${session1.startDate}T${session1.startTime}`
            );
            const dateDebut2 = new Date(
              `${session2.startDate}T${session2.startTime}`
            );
            return dateDebut1 < dateDebut2 ? session1 : session2;
          }
        );

        setSessionEnApproche({
          id: sessionLaPlusProche.sessionId,
          participationId: sessionLaPlusProche.id,
          title: sessionLaPlusProche.formationTitle,
          formationDescription: sessionLaPlusProche.formationDescription,
          categoryName: sessionLaPlusProche.categoryName,
          formationImageUrl: sessionLaPlusProche.formationImageUrl,
          startDate: `${sessionLaPlusProche.startDate}T${sessionLaPlusProche.startTime}`,
          endDate: sessionLaPlusProche.endDate,
          endTime: sessionLaPlusProche.endTime,
        });
      } else {
        setSessionEnApproche(null);
      }
      const sessionsFuturesFiltrees = listeParticipations.filter(
        (participation) => {
          const dateDebut = new Date(
            `${participation.startDate}T${participation.startTime}`
          );
          return dateDebut > dateActuelle;
        }
      );

      const sessionsFuturesFormatees = sessionsFuturesFiltrees.map(
        (participation) => ({
          id: participation.sessionId,
          participationId: participation.id,
          startDate: `${participation.startDate}T${participation.startTime}`,
          endDate: participation.endDate,
          endTime: participation.endTime,
          formateur: `${participation.formateurFirstname} ${participation.formateurLastname}`,
          formationTitle: participation.formationTitle,
          formationDescription: participation.formationDescription,
          categoryName: participation.categoryName,
          formationImageUrl: participation.formationImageUrl,
          formation: {
            title: participation.formationTitle,
            imageUrl: participation.formationImageUrl,
          },
        })
      );

      setSessionsFutures(sessionsFuturesFormatees);

      const sessionsPasseesFiltrees = listeParticipations.filter(
        (participation) => {
          const dateFin = new Date(
            `${participation.endDate}T${participation.endTime}`
          );
          return dateFin < dateActuelle;
        }
      );

      const sessionsPasseesFormatees = sessionsPasseesFiltrees.map(
        (participation) => ({
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
        })
      );

      setSessionsPassees(sessionsPasseesFormatees);

      const derniereSessionAvecNote =
        [...sessionsPasseesFormatees]
          .filter(
            (session) => session.note !== null && session.note !== undefined
          )
          .sort((sessionAvant, sessionApres) => {
            const dateFinAvant = new Date(
              sessionAvant.endDate + "T" + sessionAvant.endTime
            );
            const dateFinApres = new Date(
              sessionApres.endDate + "T" + sessionApres.endTime
            );
            return dateFinAvant - dateFinApres;
          })
          .at(-1) || null;

      setDerniereSession(derniereSessionAvecNote);
      setDerniereNote(derniereSessionAvecNote?.note ?? null);

      const listeNotes = sessionsPasseesFormatees
        .map((session) => session.note)
        .filter((note) => note !== null);

      setStatsGlobales({
        sessionsSuivies: sessionsPasseesFormatees.length,
        moyenne:
          listeNotes.length > 0
            ? (
                listeNotes.reduce((total, valeur) => total + valeur, 0) /
                listeNotes.length
              ).toFixed(1)
            : 0,
        meilleureNote: listeNotes.length > 0 ? Math.max(...listeNotes) : 0,
        tauxReussite:
          listeNotes.length > 0
            ? Math.round(
                (listeNotes.filter((note) => note >= 10).length /
                  listeNotes.length) *
                  100
              )
            : 0,
      });
    }

    async function chargerSuggestionsFormations() {
      const resultatFormations = await formationService.getAllFormations();
      if (
        resultatFormations.success &&
        Array.isArray(resultatFormations.data)
      ) {
        setSuggestionsFormations(resultatFormations.data.slice(0, 2));
      }
    }

    chargerSessionsUtilisateur();
    chargerSuggestionsFormations();
  }, []);

  return (
    <div className="space-y-8 px-5 sm:px-6 lg:px-0">
      <h1 className="text-2xl md:text-4xl font-semibold text-noir">
        Tableau de bord
      </h1>
      <div className="grid grid-cols-12 md:gap-12">
        <div className="col-span-12 md:col-span-7 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] md:text-2xl font-medium text-noir">
              Session en approche
            </h2>
            <button
              onClick={() => navigate(ROUTES.PROFILE_SESSIONS_PASSEES)}
              className="text-sm underline"
            >
              Voir plus
            </button>
          </div>
          <SessionEnApproche session={sessionEnApproche} />
          <div className="py-5 no-scrollbar">
            <SessionAVenir sessions={sessionsFutures} />
          </div>
          <HistoriqueSession
            sessions={sessionsPassees}
            formatDate={formatDate}
          />
        </div>
        <div className="col-span-12 md:col-span-5 md:-mt-0 -mt-12">
          <h2 className="md:text-2xl text-[20px] font-medium text-noir mb-4 mt-8 md:mt-0">
            Mes statistiques
          </h2>
          <DerniersResultats note={derniereNote} session={derniereSession} />
          <div className="mt-4">
            <h2 className="md:text-2xl text-[20px] font-medium text-noir mb-4 mt-8 md:mt-0">
              Mes statistiques globales
            </h2>
            <StatsGlobales stats={statsGlobales} />
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-medium text-noir mb-4">
                Suggestions de formation
              </h2>
              <button
                onClick={() => navigate(ROUTES.PROFILE_SESSIONS_PASSEES)}
                className="text-sm underline"
              >
                Voir plus
              </button>
            </div>
            <SuggestionsFormations formations={suggestionsFormations} />
          </div>
        </div>
      </div>
    </div>
  );
}
