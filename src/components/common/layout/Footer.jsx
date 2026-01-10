import React from 'react';
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../../constants';

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route, { replace: false }); 
    window.scrollTo(0, 0); 
  };

  const handleNavigateReplace = (route) => {
    navigate(route, { replace: true }); 
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#050517] text-white mt-9">
      <div className="px-6 py-12 sm:px-8 lg:px-16">
        
        {/* ligne 1 - logo */}
        <div className="mb-8">
          <img 
            src="/logo-blanc.png" 
            alt="Txlforma" 
            className="h-12"
          />
        </div>

        {/* ligne 2 */}
        <nav className="flex flex-col gap-4 sm:flex-row sm:gap-20 mb-8">
          <span
            className="text-white text-base sm:text-lg lg:text-xl cursor-pointer hover:underline"
            onClick={() => handleNavigate(ROUTES.HOME)}
          >
            Accueil
          </span>

          <span
            className="text-white text-base sm:text-lg lg:text-xl cursor-pointer hover:underline"
            onClick={() => handleNavigate(ROUTES.CATALOGUE)}
          >
            Catalogue
          </span>

          <span
            className="text-white text-base sm:text-lg lg:text-xl cursor-pointer hover:underline"
            onClick={() => handleNavigate(ROUTES.ABOUT_US)}
          >
            À propos
          </span>
        </nav>

        {/* ligne 3 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8 sm:text-base font-light">
          <div>
            <span className="underline">Contact</span> : osaas@txlforma.fr
          </div>
          <div>
            <span className="underline">Crédit</span> : <a 
            href="https://www.linkedin.com/in/aathavanthevakumar/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline">
                Aathavan THEVAKUMAR
            </a>, <a 
            href="https://www.linkedin.com/in/abi-vigneswaran-9b5552294/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline">
                Abi VIGNESWARAN
            </a>, <a 
            href="https://www.linkedin.com/in/oscar-baer-a5bbb029b/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline">
                 Oscar BAER
            </a>, <a 
            href="https://www.linkedin.com/in/saffana-salaoudine-0711362a4/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline">
                Saffana SALAOUDINE
            </a>
          </div>
        </div>

        {/* trait horizontal */}
        <hr className="mb-8" />

        {/* Ligne 4 : Copyright et politique */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center font-light sm:text-sm">
          <p>© 2026 Txlforma. Tous les droits réservés.</p>

          <span
            className="underline cursor-pointer"
            onClick={() => handleNavigateReplace(ROUTES.CONFIDENTIALITE)}
          >
            Politique de confidentialité
          </span>
        </div>

      </div>
    </footer>
  );
}