import Header from "../../components/common/layout/Header";
import CookieConsent from "../../components/common/CookieConsent";
import Footer from "../../components/common/layout/Footer.jsx";
import HomeHero from "../../components/home/HomeHero";
import HomeAboutUs from "../../components/home/HomeAboutUs";
import HomeCatalogue from "../../components/home/HomeCatalogue";
import HomeThreeSteps from "../../components/home/HomeThreeSteps";
import HomeFeatures from "../../components/home/HomeFeatures";
import SEO from "../../components/common/SEO";

export default function Home() {
  return (
    <div className="min-h-screen bg-beige">
      <SEO
        title="TXLFORMA - Plateforme de Formation en Ligne"
        description="Découvrez TXLFORMA, votre plateforme de formation en ligne. Accédez à un large catalogue de formations professionnelles et développez vos compétences avec nos experts."
        keywords="formation en ligne, e-learning, formation professionnelle, TXLFORMA, cours en ligne, développement de compétences, formation continue"
      />
      <Header />
      <CookieConsent />

      <div className="p-6 md:p-8 bg-beige">
        <HomeHero />
        <HomeAboutUs />
        <HomeCatalogue />
        <HomeThreeSteps />
        <HomeFeatures />
      </div>
      <Footer />
    </div>
  );
}
