import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { ROUTES } from "../../constants";

const STORAGE_KEY = "cookieConsent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") return;

    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent || consent === "dismissed") {
      setShow(true);
    }
  }, [location.pathname]);

  const handleChoice = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md w-full mx-4">
      <div className="relative bg-blanc rounded-2xl shadow-2xl p-6 border border-noir/10">
        <button
          onClick={() => handleChoice("dismissed")}
          className="absolute top-3 right-3 text-noir hover:text-orange transition-colors"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <svg width="50" height="50" viewBox="0 0 80 80" fill="none">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="#CAC9B7"
                stroke="#5E5F4A"
                strokeWidth="2"
              />
              <circle cx="30" cy="30" r="4" fill="#5E5F4A" />
              <circle cx="50" cy="28" r="3" fill="#5E5F4A" />
              <circle cx="35" cy="50" r="3.5" fill="#5E5F4A" />
              <circle cx="52" cy="45" r="3" fill="#5E5F4A" />
              <circle cx="28" cy="45" r="2.5" fill="#5E5F4A" />
              <circle cx="45" cy="55" r="3" fill="#5E5F4A" />
            </svg>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-noir mb-2">
              Nous utilisons des cookies
            </h2>
            <p className="text-sm text-noir/70 mb-4 leading-relaxed">
              Veuillez accepter les cookies pour continuer à profiter de notre
              site, nous promettons qu'ils sont délicieux.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => handleChoice("accepted")}
              className="flex-1 bg-violet text-blanc rounded-full px-4 py-2 text-sm font-medium hover:-translate-y-0.5 transition-all"
            >
              Accepter
            </button>
            <button
              onClick={() => handleChoice("refused")}
              className="flex-1 bg-orange text-blanc rounded-full px-4 py-2 text-sm font-medium hover:-translate-y-0.5 transition-all"
            >
              Refuser
            </button>
          </div>

          <Link
            to={ROUTES.CONFIDENTIALITE}
            onClick={() => handleChoice("dismissed")}
            className="text-xs text-center text-noir/60 hover:text-violet hover:underline transition-colors"
          >
            En savoir plus sur notre politique de confidentialité
          </Link>
        </div>
      </div>
    </div>
  );
}
