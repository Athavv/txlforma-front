import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { userService } from "../../../api/user.service";
import { User, Pencil } from "lucide-react";
import { ROUTES, ROLES } from "../../../constants";
import { getRoleLabel } from "../../../utils/roleUtils";
import { getImageUrl } from "../../../utils/imageUtils";
import { authService } from "../../../api/auth.service";
import EditProfileModal from "../EditProfileModal.jsx";

export default function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const role = authService.getRole();

  useEffect(() => {
    const loadUser = async () => {
      const result = await userService.getCurrentUser();
      if (result.success) setUser(result.data);
    };
    loadUser();
  }, []);

  const handleEditSuccess = async () => {
    const result = await userService.getCurrentUser();
    if (result.success) setUser(result.data);
  };

  const isActive = (path) => {
    if (
      path === ROUTES.ADMIN ||
      path === ROUTES.PROFILE ||
      path === ROUTES.FORMATEUR
    ) {
      return location.pathname === path || location.pathname === path + "/";
    }
    if (path === ROUTES.PANIER) {
      return location.pathname === ROUTES.PANIER;
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const getNavItems = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { path: ROUTES.ADMIN, label: "Dashboard" },
          { path: ROUTES.ADMIN_USERS, label: "Utilisateurs" },
          { path: ROUTES.ADMIN_CATEGORIES, label: "Catégories" },
          { path: ROUTES.ADMIN_FORMATIONS, label: "Formations" },
          { path: ROUTES.ADMIN_SESSIONS, label: "Sessions" },
        ];
      case ROLES.FORMATEUR:
        return [
          { path: ROUTES.FORMATEUR, label: "Dashboard" },
          { path: `${ROUTES.FORMATEUR}/sessions`, label: "Sessions" },
        ];
      case ROLES.USER:
        return [
          { path: ROUTES.PROFILE, label: "Dashboard" },
          {
            path: `${ROUTES.PROFILE}/sessions-passees`,
            label: "Sessions",
          },
          { path: `${ROUTES.PROFILE}/attestations`, label: "Attestations" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-fond">
      <Header />
      <div className="md:ms-0 md:px-16 px-0 py-6 bg-fond border-b border-gray-200">
        <div className="flex items-center gap-6 px-5">
          {user ? (
            <>
              {user.imageUrl ? (
                <img
                  src={getImageUrl(user.imageUrl)}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="h-24 w-24 rounded-full object-cover border-2 border-vert"
                />
              ) : (
                <div className="md:h-24 md:w-24 h-16 w-16 rounded-full bg-vert flex items-center justify-center border-2 border-vert">
                  <User className="h-8 w-8 text-noir" />
                </div>
              )}
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  Content de te revoir !
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl  md:text-2xl font-bold text-noir">
                    {user.firstname && user.lastname
                      ? `${user.firstname} ${user.lastname}`
                      : user.email?.split("@")[0] || "Utilisateur"}
                  </h2>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-1.5 text-gray-600 hover:text-noir hover:bg-gray-100 rounded-full transition-colors"
                    title="Modifier mon profil"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs  md:text-sm font-semibold text-noir bg-blanc`}
                >
                  <User className="h-3 w-3 text-noir" />
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

      <div className="md:px-16 border-b border-gray-200 bg-fond mx-auto">
        <nav className="flex gap-8 px-3">
          {navItems.map((navItem) => (
            <Link
              key={navItem.path}
              to={navItem.path}
              className={`py-4 px-2 text-sm font-medium transition-colors relative ${
                isActive(navItem.path)
                  ? "text-orange"
                  : "text-gray-600 hover:text-noir"
              }`}
            >
              {navItem.label}
              {isActive(navItem.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"></span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="md:px-16 py-8">
        <Outlet />
      </div>
      <Footer />
      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
