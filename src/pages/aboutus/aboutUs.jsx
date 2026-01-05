import { useState, useEffect } from "react";
import Header from "../../components/common/layout/Header.jsx";
import starorange from "../../assets/images/home/starorange.png";
import quisommesnous from "../../assets/images/aboutUs/Salle3D.png";
import workflowData from "../../assets/json/workflow.json";
import AboutUsHero from "../../components/aboutUs/AboutUsHero.jsx";
import "@google/model-viewer";

export default function AboutUs() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setAnimationData(workflowData);
  }, []);

  return (
    <div className="min-h-screen bg-beige">
      <Header />

      <AboutUsHero />

      <div className="container mx-auto mb-20">
        <div className="w-full text-center mt-12 p-5">
          <div className="inline-flex items-center gap-10">
            <img src={starorange} alt="star" className="w-8 h-8" />
            <h2 className="text-3xl font-bold text-[24px]">
              Nos salles de classes
            </h2>
            <img src={starorange} alt="star" className="w-8 h-8" />
          </div>
          <p className="mt-3 text-xl">
            TXLFORMA est un centre de formation spécialisé dans les métiers du
            numérique et des nouvelles technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-5">
          <div className="md:col-span-7 p-6">
            <p className="mt-0 md:mt-8 text-justify text-lg">
              Découvrez un environnement conçu pour la réussite. Nos salles de
              classe ne sont pas de simples pièces, mais des écosystèmes
              technologiques pensés pour favoriser l'interaction, la
              concentration et la créativité. Grâce à notre modélisation 3D,
              explorez chaque détail de l'équipement mis à votre disposition.
            </p>
            <p className="mt-7 text-justify text-lg">
              Au-delà de l'esthétique, notre approche repose sur la synergie
              entre l'humain et son espace de travail. Nous croyons que la
              qualité des finitions — du grain satiné du mobilier à la clarté du
              système acoustique — influence directement la capacité
              d'assimilation et le bien-être des apprenants. Chaque élément
              modélisé ici reflète notre engagement : offrir un cadre
              professionnel, épuré et hautement technologique.
            </p>
          </div>
          <div className="md:col-span-5 pd-3 md:p-6">
            <img
              src={quisommesnous}
              alt="Aperçu salle"
              className="h-auto mx-auto rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Modif 2 : Utilisation correcte du viewer avec la variable MaScene3D */}
      <div className="w-full h-[500px] bg-white/50 border-y border-orange-200">
        <model-viewer
          src={MaScene3D}
          ar
          camera-controls
          touch-action="pan-y"
          /* POSITION DE LA CAMÉRA */
          camera-orbit="0deg 75deg 2m" /* Angle et distance (2m pour être au centre) */
          field-of-view="75deg" /* Grand angle pour l'immersion */
          min-camera-orbit="auto auto 0m" /* Permet de zoomer jusqu'à 0m (intérieur) */
          /* ÉCLAIRAGE (pour éviter l'effet aveuglant) */
          environment-intensity="0.7"
          exposure="0"
          style={{ width: "100%", height: "600px", backgroundColor: "#2c3e50" }}
        >
          {/* Optionnel : Masquer les faces arrière des murs pour voir à travers quand on est dehors */}
        </model-viewer>
      </div>
    </div>
  );
}
