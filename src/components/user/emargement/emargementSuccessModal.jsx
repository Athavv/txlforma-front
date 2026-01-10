import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "../../../constants";
import illustrationPaiement from "../../../assets/images/panier/paiement-confirme.png";

export default function EmargementSuccessModal() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate(ROUTES.DASHBOARD);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-5xl  mx-4 shadow-xl relative">
      <div className="grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 lg:col-span-8 text-left">
          <h2 className="text-2xl font-semibold mb-4">Émargement confirmé ! <span>🎉</span></h2>
          <p className="text-gray-600 mb-4 text-lg">
            Nous vous souhaitons une excellente session, riche en découvertes et
            en pratique. <span> 🚀</span> 
          </p>
          <button onClick={() => navigate(ROUTES.DASHBOARD)} className="bg-noir text-white px-6 py-3 rounded-full font-regular hover:bg-violet transition-colors w-fit">
            Retour au dashboard
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Redirection automatique vers le dashboard dans {countdown} seconde{countdown > 1 ? 's' : ''}...
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 hidden lg:block">
            <img src={illustrationPaiement}  alt="Confirmation"  className="w-full h-auto object-contain rounded-[30px]"/>
        </div>
      </div>
    </div>
    </div>
  );
}
