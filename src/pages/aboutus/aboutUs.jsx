import Header from "../../components/common/layout/Header.jsx";
import Footer from "../../components/common/layout/Footer.jsx";
import starorange from "../../assets/images/home/starorange.png";
import quisommesnous from "../../assets/images/aboutUs/Salledeclasse.jpg";
import AboutUsHero from "../../components/aboutUs/AboutUsHero.jsx";
import Scene3D from "../../components/aboutUs/Scene3D.jsx";
import M from "../../assets/3D/M.glb";

export default function AboutUs() {
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
            L'espace où les talents du numérique prennent vie. Propulsé par
            TXLFORMA.
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
          <div className="md:col-span-5 p-3 md:p-6">
            <img
              src={quisommesnous}
              alt="Aperçu salle"
              className="h-auto mx-auto rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5">
        <div className="w-full rounded-3xl overflow-hidden border-2 border-orange-200/30 shadow-2xl">
          <Scene3D modelUrl={M} height="800px" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
