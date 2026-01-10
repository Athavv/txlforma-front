import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { ROUTES } from "../../constants";
import workflowData from "../../assets/json/workflow.json";
import starorange from "../../assets/images/home/starorange.png";

export default function HomeHero() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setAnimationData(workflowData);
  }, []);

  return (
    <div className="mt-3">
      <div className="container mx-auto grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 p-0 md:py-10">
          <h1 className="font-bold leading-none text-[34px] md:text-[68px] text-center md:text-left">
            Des formations qui font la différence
          </h1>
          <h2 className="text-[16px] md:text-[32px] mt-4 leading-thight text-center md:text-left md:px-0 px-3">
            Former aujourd'hui des compétences <br />
            numériques adaptées aux besoins réels.
          </h2>
          <div className="flex flex-col md:items-start items-center mt-2 md:mt-4 gap-4 ">
            <Link
              to={ROUTES.CATALOGUE}
              className="bg-black text-white rounded-full px-12 py-3 mt-3 hover:-translate-y-1 active:bg-beige active:text-black active:border border-black transition-all cursor-pointer inline-block text-center"
            >
              Voir les formations
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="mt-0 md:mt-2 border border-black text-black rounded-full px-12 py-3 hover:-translate-y-1 transition-all active:bg-noir active:text-blanc cursor-pointer inline-block text-center"
            >
              Je m'inscris
            </Link>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 p-4 lg:-mt-12">
          <Lottie
            animationData={animationData}
            loop={true}
            className="h-auto mx-auto"
            style={{ background: "transparent" }}
          />
        </div>
      </div>
      <div className="w-full text-center mt-8 p-5">
        <div className="inline-flex items-center gap-10">
          <img src={starorange} className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-[24px]">Chiffres Clés</h2>
          <img src={starorange} className="w-8 h-8" />
        </div>
        <p className="mt-3 text-xl text-[16px]">
          Quelques chiffres pour mieux comprendre TXLFORMA et son impact.
        </p>
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 gap-6 px-10 md:mt-10 mt-2">
        <div className="bg-beige1 p-6 rounded-xl">
          <h3 className="text-4xl font-bold ">3 500</h3>
          <p className="mt-2 fext-sm font-medium noir">Élèves formés</p>
          <p className="mt-1 text-xs text-noir/70">
            Chaque année dans nos centres de formation
          </p>
        </div>
        <div className="bg-vert p-6 rounded-xl">
          <h3 className="text-4xl font-bold">+20</h3>
          <p className="mt-2 fext-sm font-medium noir">Formateurs experts</p>
          <p className="mt-1 text-xs text-noir/70">
            Professionnels qualifiés du numérique
          </p>
        </div>
        <div className="bg-orange p-5 rounded-xl">
          <h3 className="text-4xl font-bold noir">30</h3>
          <p className="mt-2 fext-sm font-medium noir">Formations proposées</p>
          <p className="mt-1 text-xs text-noir/70">
            Adaptées aux besoins actuels
          </p>
        </div>
        <div className="bg-violet p-6 rounded-xl">
          <h3 className="text-4xl font-bold noir">4,8/5</h3>
          <p className="mt-2 text-md noir">D'avis positifs</p>
          <p className="mt-1 text-xs text-noir/70">
            Satisfaction de nos apprenants
          </p>
        </div>
      </div>
    </div>
  );
}
