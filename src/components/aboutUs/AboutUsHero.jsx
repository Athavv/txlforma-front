import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import workflowData from "../../assets/json/catalog.json";
import starorange from "../../assets/images/home/starorange.png";

export default function AboutUsHero() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setAnimationData(workflowData);
  }, []);

  return (
    <div className="mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="flex justify-center md:justify-start items-center gap-6">
            <img src={starorange} className="w-5 h-5" />
            <h2 className="text-3xl font-bold text-[16px]">
              3D
            </h2>
            <img src={starorange} className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-[34px] md:text-[68px] text-center md:text-left leading-none"> Environnement typique des salles  de classes de nos formations </h1>
         <h2 className="text-[16px] md:text-[32px] font-light mb-6 mt-3 leading-tight text-center md:text-left">Immersion au cœur de votre futur espace d'apprentissage</h2>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-4">
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