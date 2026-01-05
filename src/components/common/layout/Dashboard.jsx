import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import { userService } from "../../../api/user.service";
import { User } from "lucide-react";
import { ROUTES, ROLES } from "../../../constants";
import { getRoleLabel } from "../../../utils/roleUtils";
import { getImageUrl } from "../../../utils/imageUtils";
import { authService } from "../../../api/auth.service";

export default function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const role = authService.getRole();

  useEffect(() => {
    const loadUser = async () => {
      const result = await userService.getCurrentUser();
      if (result.success) setUser(result.data);
    };
    loadUser();
  }, []);

  const isActive = (path) => {
    // Pour les routes de base (admin, profile, formateur)
    if (path === ROUTES.ADMIN || path === ROUTES.PROFILE || path === ROUTES.FORMATEUR) {
      return location.pathname === path || location.pathname === path + "/";
    }
    // Pour le panier (route séparée)
    if (path === ROUTES.PANIER) {
      return location.pathname === ROUTES.PANIER;
    }
    // Pour les autres routes
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Définir les menus selon le rôle
  const getNavItems = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { path: ROUTES.ADMIN, label: "Tableau de bord" },
          { path: ROUTES.ADMIN_USERS, label: "Utilisateurs" },
          { path: ROUTES.ADMIN_CATEGORIES, label: "Catégories" },
          { path: ROUTES.ADMIN_FORMATIONS, label: "Formations" },
          { path: ROUTES.ADMIN_SESSIONS, label: "Sessions" },
        ];
      case ROLES.FORMATEUR:
        return [
          { path: ROUTES.FORMATEUR, label: "Tableau de bord" },
          { path: `${ROUTES.FORMATEUR}/sessions`, label: "Mes Sessions" },
          { path: `${ROUTES.FORMATEUR}/formations`, label: "Mes Formations" },
        ];
      case ROLES.USER:
        return [
          { path: ROUTES.PROFILE, label: "Tableau de bord" },
          { path: `${ROUTES.PROFILE}/formations`, label: "Mes Formations" },
          { path: ROUTES.PANIER, label: "Mon Panier" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-fond">
      {/* Header */}
      <Header />
      {/* User Profile Section */}
      <div className="px-16 py-6 bg-fond border-b border-gray-200">
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {user.imageUrl ? (
                <img
                  src={getImageUrl(user.imageUrl)}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="h-24 w-24 rounded-full object-cover border-2 border-vert"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-vert flex items-center justify-center border-2 border-vert">
                  <User className="h-12 w-12 text-noir" />
                </div>
              )}
              <div>
                <p className="text-base text-gray-600 mb-1">
                  Content de te revoir !
                </p>
                <h2 className="text-2xl font-bold text-noir mb-2">
                  {user.firstname && user.lastname
                    ? `${user.firstname} ${user.lastname}`
                    : user.email?.split("@")[0] || "Utilisateur"}
                </h2>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-noir bg-blanc`}
                >
                  <User className="h-5 w-5 text-noir" />
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-gray-300 animate-pulse"></div>
              <div>
                <div className="h-5 w-40 bg-gray-300 rounded animate-pulse mb-2"></div>
                <div className="h-7 w-56 bg-gray-300 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="px-16 border-b border-gray-200 bg-fond">
        <nav className="flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-4 px-2 text-sm font-medium transition-colors relative ${
                isActive(item.path)
                  ? "text-orange"
                  : "text-gray-600 hover:text-noir"
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"></span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-16 py-8">
        <Outlet />
      </div>
    </div>
  );
}

