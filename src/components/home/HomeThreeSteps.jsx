import starorange from "../../assets/images/home/starorange.png";
import etape1 from "../../assets/images/home/etape1.png";
import etape2 from "../../assets/images/home/etape2.png";
import etape3 from "../../assets/images/home/etape3.png";
import fleche1 from "../../assets/images/home/fleche1.png";
import fleche2 from "../../assets/images/home/fleche2.png";

export default function HomeThreeSteps() {
  return (
    <div className="w-full text-center mt-12 p-5">
      <div className="inline-flex items-center gap-4 justify-center mb-10">
        <img src={starorange} className="w-8 h-8" alt="Étoile gauche" />
        <h2 className="text-3xl font-bold text-gray-900">
          Votre session en 3 clics
        </h2>
        <img src={starorange} className="w-8 h-8" alt="Étoile droite" />
      </div>
      <p className="text-xl w-3/4 text-center mx-auto text-[16px] mb-10 -mt-3">
        En trois clics, TUXFORMA simplifie votre parcours : choisir une formation, sélectionner une date, finaliser un paiement sécurisé.
      </p>
      <div className="flex flex-col md:flex-row md:justify-center md:gap-10 space-y-10 md:space-y-0">
        <div className="flex flex-col items-center space-y-3 w-full md:w-[400px]">
          <div className="relative w-full flex justify-center">
            <img src={etape1} className="w-56 h-56 object-cover" />
            <img
              src={fleche1}
              className="absolute right-0 top-1/2 w-28 h-3 -mr-20 hidden md:block"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            Choisissez votre formation
          </h3>
          <p className="text-gray-600 text-center text-[16px]">
            Sélectionnez une formation dans une catégorie large et variée adaptée à vos besoins.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-3 w-full md:w-[400px]">
          <div className="relative w-full flex justify-center">
            <img src={etape2} className="w-56 h-56 object-cover" />
            <img
              src={fleche2}
              className="absolute right-0 top-1/2 w-28 h-3 -mr-20 hidden md:block"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            Ajoutez au panier
          </h3>
          <p className="text-gray-600 text-center text-[16px]">
            Choisissez la date qui vous convient et ajoutez votre formation au panier.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-3 w-full md:w-[400px]">
          <div className="relative w-full flex justify-center">
            <img src={etape3} className="w-56 h-56 object-cover" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            Payez en sécurité
          </h3>
          <p className="text-gray-600 text-center text-[16px]">
            Finalisez votre achat grâce à notre paiement sécurisé via Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}

