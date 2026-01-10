import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import starorange from "../../assets/images/home/starorange.png";
import quisommesnous from "../../assets/images/home/quisommesnous.png";

export default function HomeAboutUs() {
  return (
    <>
      <div className="w-full text-center mt-12 p-5">
        <div className="inline-flex items-center gap-10">
          <img src={starorange} className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-[24px]">
            Qui sommes-nous ?
          </h2>
          <img src={starorange} className="w-8 h-8" />
        </div>
        <p className="mt-3 text-xl">
          TXLFORMA est un centre de formation spécialisé dans les métiers du
          numérique et des nouvelles technologies.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-5">
        <div className="md:col-span-7 p-6">
          <p className="mt-0 md:mt-8 text-justify text-lg">
            Nos formations sont 100 % en présentiel, animées par des
            formateurs experts issus du terrain, et réalisées avec du matériel
            professionnel fourni par TXLFORMA. Chaque session est pensée pour
            offrir un apprentissage pratique, interactif et efficace,
            garantissant une montée en compétences rapide et durable.
          </p>
          <p className="mt-7 text-justify text-lg">
            Notre objectif est simple : proposer des formations efficaces,
            actuelles et orientées pratique, qui font réellement la différence
            pour ceux qui souhaitent évoluer ou se spécialiser dans le
            numérique. Nous croyons que l'apprentissage passe par
            l'expérience, la pratique et l'accompagnement personnalisé, et
            nous mettons tout en œuvre pour que chaque formation soit une
            réussite.
          </p>
          <Link 
            to={ROUTES.ABOUT_US}
            className="mt-6 bg-noir rounded-full text-blanc px-12 py-3 hover:-translate-y-1 active:bg-beige active:text-black active:border border-black transition-all cursor-pointer inline-block text-center"
          >
            En savoir +
          </Link>
        </div>
        <div className="md:col-span-5 pd-3 md:p-6">
          <img src={quisommesnous} className="h-auto mx-auto" />
        </div>
      </div>
    </>
  );
}

