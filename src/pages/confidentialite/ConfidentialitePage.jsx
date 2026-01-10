import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Header from "../../components/common/layout/Header";
import Footer from "../../components/common/layout/Footer";
import starorange from "../../assets/images/home/starorange.png";
import catalogData from "../../assets/json/catalog.json";

const LAST_UPDATE = new Date().toLocaleDateString("fr-FR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const Section = ({ number, title, children }) => (
  <section className="bg-blanc p-6 md:p-8 rounded-2xl shadow-sm">
    <h2 className="text-2xl font-bold mb-4 text-noir">
      {number}. {title}
    </h2>
    {children}
  </section>
);

export default function ConfidentialitePage() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setAnimationData(catalogData);
  }, []);

  return (
    <div className="min-h-screen bg-beige">
      <Header />
      <div className="p-6 md:p-8 bg-beige">
        {/* Hero Section */}
        <div className="mt-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="flex justify-center md:justify-start items-center gap-6">
                <img src={starorange} className="w-5 h-5" alt="Étoile" />
                <h2 className="text-3xl font-bold text-[16px]">
                  Confidentialité
                </h2>
                <img src={starorange} className="w-5 h-5" alt="Étoile" />
              </div>
              <h1 className="font-bold text-[34px] md:text-[68px] text-center md:text-left leading-none">
                Politique de Confidentialité
              </h1>
              <h2 className="text-[16px] md:text-[32px] font-light mb-6 mt-3 leading-tight text-center md:text-left">
                Transparence, sécurité et respect de vos données personnelles.
              </h2>
              <p className="text-base text-noir/70 text-center md:text-left">
                Dernière mise à jour : {LAST_UPDATE}
              </p>
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

        {/* Contenu */}
        <div className="max-w-4xl mx-auto space-y-8 text-noir">
          <Section number={1} title="Introduction">
            <p className="text-base leading-relaxed">
              TXLFORMA ("nous", "notre", "nos") s'engage à protéger votre vie
              privée. Cette politique de confidentialité explique comment nous
              collectons, utilisons, stockons et protégeons vos données
              personnelles lorsque vous utilisez notre plateforme de formation.
            </p>
          </Section>

          <Section number={2} title="Données que nous collectons">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-noir">
                  2.1. Données personnelles
                </h3>
                <p className="text-base leading-relaxed mb-2">
                  Nous collectons les informations suivantes :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse e-mail</li>
                  <li>Numéro de téléphone</li>
                  <li>
                    Informations de paiement (traitées de manière sécurisée)
                  </li>
                  <li>Données de profil et préférences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-noir">
                  2.2. Données de navigation
                </h3>
                <p className="text-base leading-relaxed">
                  Nous utilisons des cookies et technologies similaires pour
                  améliorer votre expérience sur notre site. Ces données
                  incluent votre adresse IP, le type de navigateur, les pages
                  visitées et la durée de votre visite.
                </p>
              </div>
            </div>
          </Section>

          <Section number={3} title="Utilisation de vos données">
            <p className="text-base leading-relaxed mb-4">
              Nous utilisons vos données personnelles pour :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Gérer votre compte et vos inscriptions aux formations</li>
              <li>Traiter vos paiements et gérer vos commandes</li>
              <li>Vous envoyer des communications relatives à nos services</li>
              <li>Améliorer notre plateforme et nos services</li>
              <li>Respecter nos obligations légales</li>
              <li>Personnaliser votre expérience utilisateur</li>
            </ul>
          </Section>

          <Section number={4} title="Cookies et technologies similaires">
            <p className="text-base leading-relaxed mb-4">
              Nous utilisons des cookies pour améliorer votre expérience sur
              notre site. Les cookies sont de petits fichiers texte stockés sur
              votre appareil qui nous permettent de :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Mémoriser vos préférences</li>
              <li>Analyser le trafic et l'utilisation du site</li>
              <li>Améliorer les performances du site</li>
              <li>Personnaliser le contenu</li>
            </ul>
            <p className="text-base leading-relaxed">
              Vous pouvez gérer vos préférences de cookies via les paramètres de
              votre navigateur. Notez que la désactivation de certains cookies
              peut affecter le fonctionnement du site.
            </p>
          </Section>

          <Section number={5} title="Partage de vos données">
            <p className="text-base leading-relaxed mb-4">
              Nous ne vendons jamais vos données personnelles. Nous pouvons
              partager vos informations uniquement dans les cas suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Avec nos prestataires de services (hébergement, paiement) qui
                sont tenus de respecter la confidentialité
              </li>
              <li>
                Lorsque la loi l'exige ou pour protéger nos droits légitimes
              </li>
              <li>Avec votre consentement explicite dans d'autres cas</li>
            </ul>
          </Section>

          <Section number={6} title="Sécurité de vos données">
            <p className="text-base leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles appropriées pour protéger vos données
              personnelles contre tout accès non autorisé, perte, destruction ou
              altération. Cependant, aucune méthode de transmission sur Internet
              n'est totalement sécurisée.
            </p>
          </Section>

          <Section number={7} title="Vos droits">
            <p className="text-base leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Droit d'accès :</strong> Vous pouvez demander une copie
                de vos données personnelles
              </li>
              <li>
                <strong>Droit de rectification :</strong> Vous pouvez corriger
                vos données inexactes
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> Vous pouvez demander la
                suppression de vos données
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> Vous pouvez récupérer
                vos données dans un format structuré
              </li>
              <li>
                <strong>Droit d'opposition :</strong> Vous pouvez vous opposer
                au traitement de vos données
              </li>
              <li>
                <strong>Droit de limitation :</strong> Vous pouvez demander la
                limitation du traitement
              </li>
            </ul>
            <p className="text-base leading-relaxed mt-4">
              Pour exercer ces droits, contactez-nous à l'adresse suivante :{" "}
              <a
                href="mailto:contact@txlforma.com"
                className="text-vert hover:underline font-semibold"
              >
                contact@txlforma.com
              </a>
            </p>
          </Section>

          <Section number={8} title="Conservation des données">
            <p className="text-base leading-relaxed">
              Nous conservons vos données personnelles aussi longtemps que
              nécessaire pour les finalités pour lesquelles elles ont été
              collectées, ou conformément aux obligations légales. Lorsque vos
              données ne sont plus nécessaires, elles sont supprimées de manière
              sécurisée.
            </p>
          </Section>

          <Section number={9} title="Modifications de cette politique">
            <p className="text-base leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Les modifications seront publiées
              sur cette page avec une mise à jour de la date de "Dernière mise à
              jour". Nous vous encourageons à consulter régulièrement cette
              page.
            </p>
          </Section>

          <section className="bg-vert p-6 md:p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-noir">10. Contact</h2>
            <p className="text-base leading-relaxed mb-4">
              Pour toute question concernant cette politique de confidentialité
              ou le traitement de vos données personnelles, vous pouvez nous
              contacter :
            </p>
            <div className="space-y-2">
              <p className="text-base">
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@txlforma.com"
                  className="text-noir hover:underline font-semibold"
                >
                  contact@txlforma.com
                </a>
              </p>
              <p className="text-base">
                <strong>Adresse :</strong> TXLFORMA, Centre de Formation
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-block bg-noir text-blanc rounded-full px-8 py-3 hover:-translate-y-1 active:bg-vert active:text-noir transition-all"
            onClick={() => window.scrollTo(0, 0)}
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
