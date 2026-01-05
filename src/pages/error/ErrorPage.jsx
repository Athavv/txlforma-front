import { Link } from "react-router-dom";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import Header from "../../components/common/layout/Header.jsx";
import starorange from "../../assets/images/home/starorange.png";

function ErrorPage() {
  return (
    <div className="min-h-screen bg-beige">
      <Header />
      <div className="flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full text-center">
          {/* Illustration/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="h-32 w-32 bg-orange rounded-full flex items-center justify-center mx-auto animate-pulse">
                <AlertCircle className="h-16 w-16 text-blanc" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-vert rounded-full flex items-center justify-center">
                <span className="text-blanc font-bold text-xl">!</span>
              </div>
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-6xl md:text-8xl font-bold text-noir mb-4">404</h1>

          {/* Sous-titre */}
          <h2 className="text-3xl md:text-4xl font-bold text-noir mb-6">
            Page introuvable
          </h2>

          {/* Message */}
          <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed">
            Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
            <br />
            Ne vous inquiétez pas, nous allons vous ramener en sécurité.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="bg-noir text-blanc rounded-full px-8 py-4 font-medium hover:-translate-y-1 active:bg-beige active:text-black active:border-2 active:border-black transition-all flex items-center gap-2 group"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Retour à l'accueil
            </Link>
            <button
              onClick={() => window.history.back()}
              className="border-2 border-noir text-noir rounded-full px-8 py-4 font-medium hover:-translate-y-1 active:bg-noir active:text-blanc transition-all flex items-center gap-2 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Page précédente
            </button>
          </div>

          {/* Section décorative avec étoiles */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <img src={starorange} className="w-6 h-6 opacity-50" alt="étoile" />
            <span className="text-gray-400 text-sm">
              TXLFORMA - Centre de formation numérique
            </span>
            <img src={starorange} className="w-6 h-6 opacity-50" alt="étoile" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
