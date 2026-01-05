import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { Clock, BookOpen, ShoppingCart } from "lucide-react";
import catalogData from "../../assets/json/catalog.json";
import starorange from "../../assets/images/home/starorange.png";
import etoiles from "../../assets/images/home/5etoiles.png";

export default function CatalogueHero({ totalCategories, totalFormations }) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setAnimationData(catalogData);
  }, []);

  return (
    <div className="mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="flex justify-center md:justify-start items-center gap-6">
            <img src={starorange} className="w-5 h-5" />
            <h2 className="text-3xl font-bold text-[16px]">
              Catalogue
            </h2>
            <img src={starorange} className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-[34px] md:text-[68px] text-center md:text-left leading-none"> Le meilleur du savoir, réuni pour vous </h1>
         <h2 className="text-[16px] md:text-[32px] font-light mb-6 mt-3 leading-tight text-center md:text-left">Accompagner chaque talent vers des <br />compétences vraiment utiles.</h2>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-4">
            <div className="bg-[#FDFDFC] px-6 py-2 rounded-full flex items-center gap-2">
              <Clock className="h-4 w-4 " /> <span className="font-medium">{totalCategories} Catalogues</span>
            </div>
            <div className="bg-[#FDFDFC] px-6 py-2 rounded-full flex items-center gap-2">
              <BookOpen className="h-4 w-4" /><span className="font-medium">+{totalFormations} Formations</span>
            </div>
            <div className="bg-[#FDFDFC] px-6 py-2 rounded-full flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /><span className="font-medium">Panier en quelques clics</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-4 -mt-20 lg:-mt-60">
          {animationData && (
            <Lottie
              animationData={animationData}
              loop={true}
              className="h-auto mx-auto"
              style={{ background: "transparent" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
