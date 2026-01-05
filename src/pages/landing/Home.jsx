import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/common/layout/Header";
import Lottie from "lottie-react";
import CategoriesFormations from "../../components/common/CategoriesFormations.jsx";
import starorange from "../../assets/images/home/starorange.png";
import etoiles from "../../assets/images/home/5etoiles.png";
import jiravitrine from "../../assets/images/home/jiravitrine.png";
import quisommesnous from "../../assets/images/home/quisommesnous.png";
import reactjsvitrine from "../../assets/images/home/reactjsvitrine.png";
import springbootvitrine from "../../assets/images/home/springbootvitrine.png";
import workflowData from "../../assets/json/workflow.json";

export default function Home() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setAnimationData(workflowData);
  }, []);

  return (
    <div className="min-h-screen bg-beige">
      <Header />

      <div className="p-6 md:p-8 bg-beige">
        {/* Première section de la page d'accueil avec texte btn et photo */}
        <div className="mt-3">
          <div className="container mx-auto grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 p-0 md:py-10">
              <h1 className="font-bold leading-none text-[34px] md:text-[68px] text-center md:text-left">
                {" "}
                Des formations qui font la différence
              </h1>
              <h2 className="text-[16px] md:text-[32px] mt-4 leading-thight text-center md:text-left md:px-0 px-3">
                Former aujourd'hui des compétences <br />
                numériques adaptées aux besoins réels.
              </h2>
              <div className="flex flex-col md:items-start items-center mt-2 md:mt-4 gap-4 ">
                <button className="bg-black text-white rounded-full px-12 py-3 mt-3 hover:-translate-y-1 active:bg-beige active:text-black active:border border-black transition-all">
                  Voir les formations
                </button>
                <Link to="/register">
                  <button className="mt-0 md:mt-2 border border-black text-black rounded-full px-12 py-3 hover:-translate-y-1 transition-all active:bg-noir active:text-blanc">
                    Je m'inscris
                  </button>
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
        </div>
        {/* Section Chiffres Clés */}
        <div className="w-full text-center mt-8 p-5 ">
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
            <p className="mt-2 fext-sm font-medium noir">
              Formations proposées
            </p>
            <p className="mt-1 text-xs text-noir/70">
              Adaptées aux besoins actuels
            </p>
          </div>
          <div className="bg-violet p-6 rounded-xl">
            <h3 className="text-4xl font-bold noir">4,8/5</h3>
            <p className="mt-2 text-md noir">D’avis positifs</p>
            <p className="mt-1 text-xs text-noir/70">
              Satisfaction de nos apprenants
            </p>
          </div>
        </div>
        {/* Qui somme nous ? */}
        <div className="w-full text-center mt-12 p-5">
          <div className="inline-flex items-center gap-10">
            <img src={starorange} className="w-8 h-8" />
            <h2 className="text-3xl font-bold text-[24px]">
              Qui sommes-nous ?
            </h2>
            <img src={starorange} className="w-8 h-8" />
          </div>
          <p className="mt-3 text-xl">
            {" "}
            TXLFORMA est un centre de formation spécialisé dans les métiers du
            numérique et des nouvelles technologies.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-5">
          <div className="md:col-span-7 p-6">
            <p className="mt-0 md:mt-8 text-justify text-lg">
              {" "}
              Nos formations sont 100 % en présentiel, animées par des
              formateurs experts issus du terrain, et réalisées avec du matériel
              professionnel fourni par TXLFORMA. Chaque session est pensée pour
              offrir un apprentissage pratique, interactif et efficace,
              garantissant une montée en compétences rapide et durable.
            </p>
            <p className="mt-7 text-justify text-lg">
              {" "}
              Notre objectif est simple : proposer des formations efficaces,
              actuelles et orientées pratique, qui font réellement la différence
              pour ceux qui souhaitent évoluer ou se spécialiser dans le
              numérique. Nous croyons que l’apprentissage passe par
              l’expérience, la pratique et l’accompagnement personnalisé, et
              nous mettons tout en œuvre pour que chaque formation soit une
              réussite.{" "}
            </p>
            <button className="mt-6 bg-noir rounded-full text-blanc px-12 py-3  hover:-translate-y-1 active:bg-beige active:text-black active:border border-black transition-all">
              En savoir +
            </button>
          </div>
          <div className="md:col-span-5 pd-3 md:p-6">
            <img src={quisommesnous} className="h-auto mx-auto" />
          </div>
        </div>
        {/* Nos catégories */}
        <div>
          <div className="w-full text-center mt-8 p-5">
            <div className="inline-flex items-center gap-10">
              <img src={starorange} className="w-8 h-8" />
              <h2 className="text-3xl font-bold text-[24px]">
                Notre catalogue
              </h2>
              <img src={starorange} className="w-8 h-8" />
            </div>
            <p className="mt-3 text-xl text-[16px] text-center lg:px-40">
              {" "}
              TXLFORMA propose un large éventail de formations, conçues pour
              développer vos compétences techniques et professionnelles dans des
              domaines variés. Nos sessions sont interactives et encadrées par
              des formateurs experts.{" "}
            </p>
          </div>
          <CategoriesFormations />
          <div className="text-center mt-6">
            <button className="bg-noir rounded-full text-blanc px-12 py-3 hover:-translate-y-1 active:bg-beige active:text-black active:border border-black transition-all">
              {" "}
              Tout notre catalogue{" "}
            </button>
          </div>
        </div>
        {/* Nos formations en vedette */}
        <div className="w-full text-center mt-8 p-5">
          <div className="inline-flex items-center gap-10">
            <img src={starorange} className="w-8 h-8" />
            <h2 className="text-3xl font-bold text-[24px]">
              Nos formations en vedette
            </h2>
            <img src={starorange} className="w-8 h-8" />
          </div>
          <p className="mt-3 text-xl text-[16px]">
            {" "}
            Découvrez nos formations les plus demandées, conçues pour répondre
            aux besoins actuels du marché numérique.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 md:px-12 mt-2 md:mt-5">
          <div className="flex flex-col bg-vert p-6 rounded-3xl">
            <img
              src={springbootvitrine}
              className="w-full h-40 object-cover rounded-3xl mb-4"
            />
            <h3 className="text-xl font-bold">SpringBoot – Débutant</h3>
            <p className="text-xl mt-3">170€</p>
            <p className="text-sm mt-3 flex-grow">
              {" "}
              Cette formation vous initie au développement back-end moderne avec
              Spring Boot, il permet de créer des applications robustes et
              performantes.{" "}
            </p>
            <p className="text-xs mt-5">— Aathavan Thevakumar (Formateur)</p>
            <button className="mt-5 bg-noir text-blanc rounded-full px-6 py-2 hover:-translate-y-1 active:bg-violet active:text-black transition-all">
              Découvrir
            </button>
          </div>
          <div className="flex flex-col bg-vert p-6 rounded-3xl">
            <img
              src={reactjsvitrine}
              className="w-full h-40 object-cover rounded-3xl mb-4"
            />
            <h3 className="text-xl font-bold">React JS – Débutant</h3>
            <p className="text-xl mt-3">190€</p>
            <p className="text-sm mt-3 flex-grow">
              {" "}
              Cette formation vous initie au développement front-end moderne
              avec React JS, une bibliothèque JavaScript incontournable.{" "}
            </p>
            <p className="text-xs mt-5">— Aathavan Thevakumar (Formateur)</p>
            <button className="mt-4 bg-noir text-blanc rounded-full px-6 py-2 hover:-translate-y-1 active:bg-violet active:text-black transition-all">
              Découvrir
            </button>
          </div>
          <div className="flex flex-col  bg-vert p-6 rounded-3xl">
            <img
              src={jiravitrine}
              className="w-full h-40 object-cover rounded-3xl mb-4"
            />
            <h3 className="text-xl font-bold">Jira – Intermédiaire</h3>
            <p className="text-xl mt-3">220€</p>
            <p className="text-sm mt-3 flex-grow">
              {" "}
              Cette formation vous initie à la gestion de projets moderne avec
              Jira, un outil incontournable pour organiser, suivre et optimiser
              le travail en équipe.{" "}
            </p>
            <p className="text-xs text-noir mt-5">
              — Aathavan Thevakumar (Formateur)
            </p>
            <button className="px-6 py-2 mt-5 bg-noir text-blanc rounded-full hover:-translate-y-1 active:bg-violet active:text-black transition-all">
              Découvrir
            </button>
          </div>
        </div>
        {/* Ils nous font confiance*/}
        <div className="w-full text-center mt-12 p-5">
          <div className="inline-flex items-center gap-10">
            <img src={starorange} className="w-8 h-8" />
            <h2 className="text-3xl font-bold text-[24px]">
              Ils nous font confiance
            </h2>
            <img src={starorange} className="w-8 h-8" />
          </div>
          <p className="mt-3 text-xl w-3/4 text-center mx-auto mt-7 text-[16px]">
            Entreprises et particuliers font confiance à TXLFORMA pour
            développer leurs compétences numériques. Des formations en
            présentiel, animées par des experts, pour des résultats concrets et
            durables.
          </p>
        </div>
        <div className="text-blanc py-5 md:px-12 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-noir rounded-3xl p-8 rounded-xl text-center">
              <img src={etoiles} className="w-2/4 mx-auto mb-3" />
              <p className="mt-4 italic mx-5 text-lg">
                Plateforme intuitive, tout est clair et super fluide.
              </p>
              <p className="mt-4 italic text-sm">
                — Formateur gestion de projet
              </p>
            </div>
            <div className="bg-noir rounded-3xl p-8 rounded-xl text-center">
              <img
                src={etoiles}
                alt="5 étoiles"
                className="w-2/4 mx-auto mb-3"
              />
              <p className="mt-4 italic mx-5 text-lg">
                Navigation simple, je trouve tout en quelques secondes.
              </p>
              <p className="mt-4 italic text-sm">— Élève en cybersécurité</p>
            </div>
            <div className="bg-noir rounded-3xl p-8 rounded-xl text-center">
              <img
                src={etoiles}
                alt="5 étoiles"
                className="w-2/4 mx-auto mb-3"
              />
              <p className="mt-4 italic mx-5 text-lg">
                Interface moderne, agréable et vraiment facile à utiliser.
              </p>
              <p className="mt-4 italic text-sm">— Élève en dev front</p>
            </div>
            <div className="bg-noir rounded-3xl p-8 rounded-xl text-center">
              <img
                src={etoiles}
                alt="5 étoiles"
                className="w-2/4 mx-auto mb-3"
              />
              <p className="mt-4 italic mx-5 text-lg">
                Plateforme rapide, bien organisée et très accessible.
              </p>
              <p className="mt-4 italic text-sm">— Formateur en dev front</p>
            </div>
          </div>
        </div>
        <div className="text-blanc px-12 md:px-12 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-noir rounded-3xl p-8 rounded-xl text-center">
              <img
                src={etoiles}
                alt="5 étoiles"
                className="w-2/4 mx-auto mb-3"
              />
              <p className="mt-4 italic mx-5 text-lg">
                Ressources claires, plateforme propre et hyper pratique.
              </p>
              <p className="mt-4 italic text-sm">— Formateur dev back</p>
            </div>
            <div className="bg-noir rounded-3xl p-8 rounded-xl text-center">
              <img
                src={etoiles}
                alt="5 étoiles"
                className="w-2/4 mx-auto mb-3"
              />
              <p className="mt-4 italic mx-5 text-lg">
                Plateforme efficace, fluide et pensée pour apprendre vite.
              </p>
              <p className="mt-4 italic text-sm">
                — Élève en gestion de projet
              </p>
            </div>
            <div className="bg-noir rounded-3xl p-8 rounded-xl text-center">
              <img src={etoiles} className="w-2/4 mx-auto mb-3" />
              <p className="mt-4 italic mx-5 text-lg">
                Utilisation simple, je m’y retrouve immédiatement.
              </p>
              <p className="mt-4 italic text-sm">— Formateur dev back</p>
            </div>
            <div className="bg-noir rounded-3xl p-8 rounded-xl text-center">
              <img src={etoiles} className="w-2/4 mx-auto mb-3" />
              <p className="mt-4 italic mx-5 text-lg">
                Une montée en compétences rapide grâce au présentiel.
              </p>
              <p className="mt-4 italic text-sm">
                — Élève en gestion de projet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
