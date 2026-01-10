import Header from "../../components/common/layout/Header";
import CookieConsent from "../../components/common/CookieConsent";
import Footer from "../../components/common/layout/Footer.jsx";
import HomeHero from "../../components/home/HomeHero";
import HomeAboutUs from "../../components/home/HomeAboutUs";
import HomeCatalogue from "../../components/home/HomeCatalogue";
import HomeThreeSteps from "../../components/home/HomeThreeSteps";
import HomeFeatures from "../../components/home/HomeFeatures";

export default function Home() {
  return (
    <div className="min-h-screen bg-beige">
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
