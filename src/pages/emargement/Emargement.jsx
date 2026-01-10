import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { emargementService } from "../../api/emargement.service";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import fondEmargement from "../../assets/images/emargement/fondemargement.png";
import EmargementSuccessModal from "../../components/user/emargement/emargementSuccessModal";

export default function Emargement() {
  const { participationId } = useParams();
  const navigate = useNavigate();
  const sigCanvas = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const clearSignature = () => {
    sigCanvas.current.clear();
    setError(null);
  };

  const validateSignature = async () => {
    if (!sigCanvas.current) {
      setError("Erreur interne : signature non prête");
      return;
    }
    if (sigCanvas.current.isEmpty()) {
      setError("Veuillez signer avant de valider");
      return;
    }
    const signatureData = sigCanvas.current.getCanvas().toDataURL("image/png");
    setLoading(true);
    const res = await emargementService.signParticipation(
      participationId,
      signatureData
    );
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Une erreur est survenue");
      return;
    }
    setShowSuccessModal(true);
  };

  return (
    <div className="w-full" style={{ backgroundImage: `url(${fondEmargement})`,backgroundSize: "cover", backgroundPosition: "center",}}>
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 container-fluid px-1 md:px-12">
        <div className="p-6 md:p-12 mt-20">
          <div className="max-w-xl space-y-6">
            <div onClick={() => navigate(ROUTES.PROFILE)} className="cursor-pointer text-sm text-noir hover:underline mb-6">← Retour
            </div>
            <h1 className="md:text-[42px] text-[32px] font-semibold leading-tight text-noir"> Bienvenue dans votre nouvelle session</h1>
            <p className="text-[18px] text-noir text-justify"> Avant de commencer et plonger dans toutes ces nouvelles connaissances, nous vous invitons à confirmer votre présence en signant la feuille d’émargement. Cette étape est indispensable pour valider votre participation et garantir le bon suivi de la formation.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="max-w-2xl w-full p-10 bg-white rounded-3xl shadow-xl">
            <h1 className="text-[24px] font-regular text-noir text-center">
              Émargement
            </h1>
            <div className="border-gray-300 rounded-3xl overflow-hidden w-full h-[200px] lg:h-[450px] mt-5">
              <SignaturePad
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  className: "w-full h-full bg-gray-100",
                }}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
            <div className="flex flex-col gap-4">
              <p className="text-noir text-center text-[15px] mt-5">Merci de signer ci-dessous pour confirmer votre présence.</p>
              <button onClick={validateSignature} disabled={loading} className="w-full py-4 bg-noir text-white rounded-lg hover:bg-violet/80 text-center">
                {loading ? "Envoi..." : "Valider ma signature"}
              </button>
              <button onClick={clearSignature} className="w-full py-3 bg-orange rounded-lg hover:bg-blanc text-center">
                Effacer
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && <EmargementSuccessModal />}
    </div>
  );
}
