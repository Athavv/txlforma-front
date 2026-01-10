import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../../api/auth.service";
import { panierService } from "../../../api/panier.service";
import { ShoppingCart, LogOut } from "lucide-react";
import { ROUTES, ROLES } from "../../../constants";
import panierIcon from "../../../assets/images/panier/panier.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [panierItemCount, setPanierItemCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const role = authService.getRole();

  const loadPanierCount = useCallback(async () => {
    const result = await panierService.getPanier();
    if (result.success && result.data?.sessions) {
      setPanierItemCount(result.data.sessions.length);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadPanierCount();
    }
  }, [isAuthenticated, location.pathname, loadPanierCount]);

  useEffect(() => {
    const handlePanierUpdate = () => {
      if (isAuthenticated) {
        loadPanierCount();
      }
    };

    window.addEventListener("panierUpdated", handlePanierUpdate);
    return () => {
      window.removeEventListener("panierUpdated", handlePanierUpdate);
    };
  }, [isAuthenticated, loadPanierCount]);

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      authService.logout();
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleDashboardClick = (event) => {
    event.preventDefault();
    if (role === ROLES.ADMIN) {
      navigate(ROUTES.ADMIN);
    } else if (role === ROLES.FORMATEUR) {
      navigate(ROUTES.FORMATEUR);
    } else if (role === ROLES.USER) {
      navigate(ROUTES.PROFILE);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <header className="relative top-0 z-50 flex items-center justify-between py-4 px-6 md:px-16">
      <Link
        to={ROUTES.HOME}
        className="text-xl font-bold text-vert relative z-10"
      >
        <img src="/logo.png" className="h-10" alt="Txlforma" />
      </Link>
      <nav className="hidden lg:flex gap-12 text-sm font-medium bg-vert px-6 py-2 rounded-full relative z-10">
        <Link
          to={ROUTES.HOME}
          className={`px-8 py-3 rounded-full transition-all ${
            isActive("/") && !isActive("/dashboard") && !isActive("/admin")
              ? "bg-blanc text-noir"
              : "hover:bg-blanc"
          }`}
        >
          Accueil
        </Link>
        <Link
          to={ROUTES.CATALOGUE}
          className={`px-8 py-3 rounded-full transition-all ${
            isActive("/catalogue") ? "bg-blanc text-noir" : "hover:bg-blanc"
          }`}
        >
          Catalogue
        </Link>
        <Link
          to={
            role === ROLES.ADMIN
              ? ROUTES.ADMIN
              : role === ROLES.FORMATEUR
              ? ROUTES.FORMATEUR
              : role === ROLES.USER
              ? ROUTES.PROFILE
              : ROUTES.DASHBOARD
          }
          onClick={handleDashboardClick}
          className={`px-8 py-3 rounded-full transition-all ${
            isActive("/dashboard") ||
            isActive("/admin") ||
            isActive("/profile") ||
            isActive("/formateur")
              ? "bg-blanc text-noir"
              : "hover:bg-blanc"
          }`}
        >
          Tableau de bord
        </Link>
        <Link
          to={ROUTES.ABOUT_US}
          className={`px-8 py-3 rounded-full transition-all ${
            isActive(ROUTES.ABOUT_US) ? "bg-blanc text-noir" : "hover:bg-blanc"
          }`}
        >
          À propos
        </Link>
      </nav>

      <div className="hidden lg:flex items-center gap-4 relative z-10">
        {isAuthenticated ? (
          <Link
            to={ROUTES.PANIER}
            className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img
              src={panierIcon}
              alt="Panier"
              className="h-7 w-7 object-contain"
            />
            {panierItemCount > 0 && (
              <span className="text-xs font-medium text-noir mt-1">
                {panierItemCount}
              </span>
            )}
          </Link>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img
              src={panierIcon}
              alt="Panier"
              className="h-7 w-7 object-contain"
            />
          </Link>
        )}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-vert px-8 py-3 rounded-full font-medium hover:-translate-y-1 active:bg-noir active:text-blanc transition-all flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="bg-vert px-8 py-3 rounded-full font-medium hover:-translate-y-1 active:bg-noir active:text-blanc transition-all"
          >
            Connexion
          </Link>
        )}
      </div>
      <button className="lg:hidden text-3xl" onClick={() => setOpen(!open)}>
        ☰
      </button>
      {open && (
        <div className="absolute top-full left-0 w-full bg-fond flex flex-col items-center py-6 gap-6 lg:hidden z-50">
          <Link to={ROUTES.HOME} className="text-lg">
            Accueil
          </Link>
          <Link to={ROUTES.CATALOGUE} className="text-lg">
            Catalogue
          </Link>
          <Link
            to={
              role === ROLES.ADMIN
                ? ROUTES.ADMIN
                : role === ROLES.FORMATEUR
                ? ROUTES.FORMATEUR
                : role === ROLES.USER
                ? ROUTES.PROFILE
                : ROUTES.DASHBOARD
            }
            onClick={handleDashboardClick}
            className="text-lg"
          >
            Tableau de bord
          </Link>
          <Link to={ROUTES.ABOUT_US} className="text-lg">
            À propos
          </Link>
          {isAuthenticated ? (
            <Link
              to={ROUTES.PANIER}
              className="text-lg flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Panier
              </div>
              {panierItemCount > 0 && (
                <span className="text-xs font-medium text-noir">
                  {panierItemCount} session{panierItemCount > 1 ? "s" : ""}
                </span>
              )}
            </Link>
          ) : (
            <Link to={ROUTES.LOGIN} className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Panier
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-vert px-6 py-2 rounded-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          ) : (
            <Link to={ROUTES.LOGIN} className="bg-vert px-6 py-2 rounded-full">
              Connexion
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
