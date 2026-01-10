import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/layout/Header";
import Footer from "../../components/common/layout/Footer";
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
  const location = useLocation();
  const [formation, setFormation] = useState(null);
  const [relatedFormations, setRelatedFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsWithStats, setSessionsWithStats] = useState([]);
  const [panierItems, setPanierItems] = useState(new Set());
  const [paidSessions, setPaidSessions] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [panierLoading, setPanierLoading] = useState(true);

  const loadFormation = useCallback(async () => {
    const result = await formationService.getFormationById(id);
    if (result.success) {
      setFormation(result.data);
    }
  }, [id]);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    const result = await sessionService.getSessionsByFormation(id);
    if (result.success) {
      await loadSessionsStats(result.data);
    }
    setLoading(false);
  }, [id]);

  const loadSessionsStats = useCallback(async (sessions) => {
    const statsPromises = sessions.map(async (session) => {
      let participationsCount = 0;

      try {
        const result = await participationService.getParticipationsBySession(session.id);
        if (result.success) {
          if (result.data.count !== undefined) {
            participationsCount = result.data.count;
          } else if (Array.isArray(result.data)) {
            participationsCount = result.data.length;
          }
        }
      } catch {
        participationsCount = 0;
      }

      const remainingPlaces = session.capacity - participationsCount;

      return {
        ...session,
        remainingPlaces,
        isFull: remainingPlaces <= 0,
        participationsCount,
      };
    });

    const stats = await Promise.all(statsPromises);
    setSessionsWithStats(stats);
  }, []);

  const loadRelatedFormations = useCallback(async () => {
    if (!formation?.category) return;

    const result = await formationService.getAllFormations();
    if (result.success) {
      const related = result.data.filter(
        (formationItem) =>
          formationItem.category?.id === formation.category?.id &&
          formationItem.id !== parseInt(id)
      );
      setRelatedFormations(related);
    }
  }, [formation, id]);

  const loadPanierItems = useCallback(async () => {
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
  }, []);

  const loadPaidSessions = useCallback(async () => {
    const result = await participationService.getMyParticipations();
    if (result.success && result.data) {
      const sessionIds = new Set(
        result.data
          .map((participation) => participation.sessionId)
          .filter(Boolean)
      );
      setPaidSessions(sessionIds);
    } else {
      setPaidSessions(new Set());
    }
  }, []);

  const reloadData = useCallback(() => {
    if (authService.isAuthenticated() && id) {
      loadPanierItems();
      loadPaidSessions();
      loadSessions();
    }
  }, [id, loadPanierItems, loadPaidSessions, loadSessions]);

  useEffect(() => {
    if (!id) return;

    loadFormation();
    loadSessions();
    if (authService.isAuthenticated()) {
      loadPanierItems();
      loadPaidSessions();
    } else {
      setPanierLoading(false);
    }
  }, [id, loadFormation, loadSessions, loadPanierItems, loadPaidSessions]);

  useEffect(() => {
    if (formation) {
      loadRelatedFormations();
    }
  }, [formation, loadRelatedFormations]);

  useEffect(() => {
    const handlePanierUpdate = () => reloadData();
    window.addEventListener("panierUpdated", handlePanierUpdate);
    return () => window.removeEventListener("panierUpdated", handlePanierUpdate);
  }, [reloadData]);

  useEffect(() => {
    const handleFocus = () => reloadData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [reloadData]);

  useEffect(() => {
    if (
      location.pathname.includes(`/formation/${id}`) &&
      authService.isAuthenticated() &&
      id
    ) {
      reloadData();
    }
  }, [location.pathname, id, reloadData]);

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
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-900 mb-4"
        >
          &lt; Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FormationDetailHeader formation={formation} />
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium relative w-fit pb-2">
                  Autres formations à consulter
                  <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gray-200 rounded-full"></span>
                </h2>
                <Link
                  to={ROUTES.CATALOGUE}
                  className="font-regular text-gray-600 hover:text-gray-950 pt-[20px]"
                >
                  Voir plus
                </Link>
              </div>
              <FormationDetailRelatedFormations
                relatedFormations={relatedFormations}
              />
            </div>
          </div>
          <div className="lg:border-l lg:border-gray-300 lg:pl-7">
            <div className="sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 px-5">
                Liste de sessions disponibles
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
      <Footer />
    </div>
  );
}