import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/common/layout/Header";
import Footer from "../../components/common/layout/Footer";
import PanierHeader from "../../components/panier/PanierHeader";
import PanierContent from "../../components/panier/PanierContent";
import PaymentSuccessModal from "../../components/panier/PaymentSuccessModal";
import { panierService } from "../../api/panier.service";
import { formationService } from "../../api/formation.service";
import { paymentService } from "../../api/payment.service";
import { ROUTES } from "../../constants";
import { authService } from "../../api/auth.service";

export default function PanierPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formations, setFormations] = useState({});
  const [removingSessionId, setRemovingSessionId] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const loadPanier = useCallback(async () => {
    setLoading(true);
    const result = await panierService.getPanier();
    if (result.success) {
      setPanier(result.data);
    }
    setLoading(false);
  }, []);

  const loadFormations = useCallback(async () => {
    if (!panier?.sessions) return;
    const formationIds = [
      ...new Set(
        panier.sessions.map(
          (panierSession) => panierSession.session.formationId
        )
      ),
    ];
    const formationsMap = {};
    for (const formationId of formationIds) {
      const result = await formationService.getFormationById(formationId);
      if (result.success) {
        formationsMap[formationId] = result.data;
      }
    }
    setFormations(formationsMap);
  }, [panier]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const paymentSuccess = searchParams.get("payment_success");
    const sessionId = searchParams.get("session_id");

    if (paymentSuccess === "true" && sessionId) {
      setShowPaymentSuccess(true);
      const syncPayment = async () => {
        try {
          await paymentService.syncCheckoutSession(sessionId);
        } catch (error) {
        }
        await panierService.clearPanier();
      };
      syncPayment();
      setSearchParams({});
    } else {
      loadPanier();
    }
  }, [navigate, searchParams, setSearchParams]);

  useEffect(() => {
    if (showPaymentSuccess) {
      const timer = setTimeout(() => navigate(ROUTES.DASHBOARD), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPaymentSuccess, navigate]);

  useEffect(() => {
    if (panier?.sessions) {
      loadFormations();
    }
  }, [panier, loadFormations]);

  const handleRemoveSession = async (sessionId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir retirer cette session du panier ?"
      )
    ) {
      return;
    }
    setRemovingSessionId(sessionId);
    const result = await panierService.removeSessionFromPanier(sessionId);
    if (result.success) {
      setPanier(result.data);
    } else {
      alert(result.error);
    }
    setRemovingSessionId(null);
  };

  const handleProceedToPayment = async () => {
    if (!panier?.id) return;
    setRedirecting(true);
    const result = await paymentService.createCheckoutSession(panier.id);
    if (result.success && result.data.url) {
      window.location.href = result.data.url;
    } else {
      setRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div>Chargement du panier...</div>
        </div>
        <Footer/>
      </div>
    );
  }

  const sessions = panier?.sessions || [];
  const totalPrice = panier?.totalPrice || 0;

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Header />
      { showPaymentSuccess && <PaymentSuccessModal />} 
      <div className="w-full mx-auto px-5 md:px-12 py-8">
        <PanierHeader />
        <PanierContent
          sessions={sessions}
          formations={formations}
          totalPrice={totalPrice}
          removingSessionId={removingSessionId}
          redirecting={redirecting}
          onRemoveSession={handleRemoveSession}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
      <Footer/>
    </div>
  );
}
