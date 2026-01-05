import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import paiementType from "../../assets/images/panier/paiement-type1.png";

export default function PanierSummary({
  totalPrice,
  sessionsCount,
  onProceedToPayment,
  redirecting = false,
}) {
  return (
    <div className="p-6 sticky top-24">
      <h3 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-6 inline-block font-medium">Récapitulatif</h3>
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span>Valeur de la commande :</span>
          <span>{totalPrice.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between">
          <span>Remise :</span>
          <span>0€</span>
        </div>
        <div className="flex justify-between font-medium text-2xl pt-2">
          <span>Total de la commande :</span>
          <span>{totalPrice.toFixed(2)}€</span>
        </div>
      </div>
      <button
        onClick={onProceedToPayment}
        disabled={sessionsCount === 0 || redirecting}
        className="w-full bg-gray-900 text-white py-3 px-4 rounded-full font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
      >
        {redirecting
          ? "Redirection vers le paiement..."
          : "Procéder au paiement"}
      </button>
      <Link
        to={ROUTES.CATALOGUE}
        className="block w-full text-center border-2 border-gray-900 text-gray-900 py-3 px-4 rounded-full font-medium hover:bg-gray-50"
      >
        Continuer mes achats
      </Link>
      <div className="mt-6 pt-6">

      <div className="w-full flex justify-center py-4">
        <img 
          src={paiementType} 
          alt="Moyens de paiement" 
          className="w-full h-auto object-contain" 
        />
      </div>
        <p className="text-s text-gray-600 mb-2">
          Paiement 100% sécurisé : toutes vos transactions sont protégées grâce
          au protocole SSL.
        </p>
        <p className="text-s text-gray-600 mb-2">
          Stripe : nous utilisons la plateforme de paiement internationale
          Stripe, reconnue pour sa fiabilité et sa sécurité.
        </p>
        <p className="text-s text-gray-600">
          Confirmation immédiate : dès validation, vous recevez un email avec
          votre facture et l'accès à votre espace formation.
        </p>
      </div>
    </div>
  );
}
