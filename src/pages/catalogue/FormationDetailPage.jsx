import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/layout/Header";
import FormationDetailHeader from "../../components/formationDetail/FormationDetailHeader";
import FormationDetailCalendar from "../../components/formationDetail/FormationDetailCalendar";
import FormationDetailSessionList from "../../components/formationDetail/FormationDetailSessionList";
import FormationDetailRelatedFormations from "../../components/formationDetail/FormationDetailRelatedFormations";
import { formationService } from "../../api/formation.service";
import { sessionService } from "../../api/session.service";
import { participationService } from "../../api/participation.service";
import { panierService } from "../../api/panier.service";
import { authService } from "../../api/auth.service";
import { ROUTES, ROLES } from "../../constants";
import { Link } from "react-router-dom";


export default function FormationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formation, setFormation] = useState(null);
  const [relatedFormations, setRelatedFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsWithStats, setSessionsWithStats] = useState([]);
  const [panierItems, setPanierItems] = useState(new Set());
  const [paidSessions, setPaidSessions] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [panierLoading, setPanierLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadFormation();
      loadSessions();
      if (authService.isAuthenticated()) {
        loadPanierItems();
        loadPaidSessions();
      } else {
        setPanierLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    if (formation) {
      loadRelatedFormations();
    }
  }, [formation]);

  const loadFormation = async () => {
    const result = await formationService.getFormationById(id);
    if (result.success) {
      setFormation(result.data);
    }
  };

  const loadSessions = async () => {
    setLoading(true);
    const result = await sessionService.getSessionsByFormation(id);
    if (result.success) {
      loadSessionsStats(result.data);
    }
    setLoading(false);
  };

  const loadRelatedFormations = async () => {
    if (!formation || !formation.category) return;

    const result = await formationService.getAllFormations();
    if (result.success) {
      const related = result.data.filter(
        (formationItem) =>
          formationItem.category?.id === formation.category?.id &&
          formationItem.id !== parseInt(id)
      );
      setRelatedFormations(related);
    }
  };

  const loadSessionsStats = async (sessionsList) => {
    const isAuthenticated = authService.isAuthenticated();
    const userRole = authService.getRole();
    const canAccessParticipations =
      isAuthenticated &&
      (userRole === ROLES.ADMIN || userRole === ROLES.FORMATEUR);

    const statsPromises = sessionsList.map(async (session) => {
      let participationsCount = 0;

      if (canAccessParticipations) {
        try {
          const participationsResult =
            await participationService.getParticipationsBySession(session.id);
          if (participationsResult.success) {
            participationsCount = participationsResult.data.length;
          }
        } catch (error) {
          participationsCount = 0;
        }
      }

      const remainingPlaces = session.capacity - participationsCount;
      const isFull = remainingPlaces <= 0;

      return {
        ...session,
        remainingPlaces,
        isFull,
        participationsCount,
      };
    });

    try {
      const stats = await Promise.all(statsPromises);
      setSessionsWithStats(stats);
    } catch (error) {
      setSessionsWithStats(
        sessionsList.map((session) => ({
          ...session,
          remainingPlaces: session.capacity,
          isFull: false,
          participationsCount: 0,
        }))
      );
    }
  };

  const loadPanierItems = async () => {
    setPanierLoading(true);
    const result = await panierService.getPanier();
    if (result.success && result.data?.sessions) {
      const sessionIds = new Set(
        result.data.sessions.map((panierSession) => panierSession.sessionId)
      );
      setPanierItems(sessionIds);
    } else {
      setPanierItems(new Set());
    }
    setPanierLoading(false);
  };

  const loadPaidSessions = async () => {
    const result = await participationService.getMyParticipations();
    if (result.success && result.data) {
      const sessionIds = new Set(
        result.data.map((participation) => participation.session.id)
      );
      setPaidSessions(sessionIds);
    }
  };

  const handleAddToPanier = async (sessionId) => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const result = await panierService.addSessionToPanier(sessionId);
    if (result.success) {
      await loadPanierItems();
      window.dispatchEvent(new Event("panierUpdated"));
    } else {
      alert(result.error);
    }
  };

  const handleMonthChange = (newDate) => {
    setCurrentMonth(newDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fond">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div>Chargement de la formation...</div>
        </div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="min-h-screen bg-fond">
        <Header />
        <div className="p-6 md:p-8">
          <div>Formation introuvable</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fond px-5">
      <Header />
      <div className="p-6 md:p-8">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 mb-4">
          &lt; Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FormationDetailHeader formation={formation} />
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium relative w-fit pb-2"> Autres formations à consulter <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gray-200 rounded-full"></span>
                </h2>
                <Link to={ROUTES.CATALOGUE} className="font-regular text-gray-600 hover:text-gray-950 pt-[20px]" > Voir plus
                </Link>
              </div>
              <FormationDetailRelatedFormations relatedFormations={relatedFormations} />
            </div>
          </div>
          <div className="lg:border-l lg:border-gray-300 lg:pl-7">
            <div className="sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 px-5">
                Listes de sessions disponibles
              </h3>
             <div className="h-[2px] bg-gray-200 mx-5 mb-6 rounded-full" />
              <FormationDetailCalendar
                sessions={sessionsWithStats}
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
              />
              <FormationDetailSessionList
                sessions={sessionsWithStats}
                onAddToPanier={handleAddToPanier}
                panierItems={panierItems}
                paidSessions={paidSessions}
                panierLoading={panierLoading}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
