import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Home from "../pages/landing/Home.jsx";
import Dashboard from "../components/common/layout/Dashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import UsersPage from "../pages/admin/UsersPage.jsx";
import FormationsPage from "../pages/admin/FormationsPage.jsx";
import SessionsPage from "../pages/admin/SessionsPage.jsx";
import SessionDetailPage from "../pages/admin/SessionDetailPage.jsx";
import CategoriesPage from "../pages/admin/CategoriesPage.jsx";
import FormateurDashboard from "../pages/formateur/FormateurDashboard.jsx";
import SessionsPageFormateur from "../pages/formateur/SessionPageFormateur.jsx";
import SessionDetailFormateur from "../pages/formateur/SessionDetailFormateur.jsx";
import UserDashboard from "../pages/user/UserDashboard.jsx";
import SessionsPassees from "../pages/user/SessionsPassees.jsx";
import Attestations from "../pages/user/Attestations.jsx";
import Emargement from "../pages/emargement/Emargement.jsx";
import SessionDetailPageUser from "../pages/user/SessionDetailPageUser.jsx";
import CataloguePage from "../pages/catalogue/CataloguePage.jsx";
import FormationDetailPage from "../pages/catalogue/FormationDetailPage.jsx";
import PanierPage from "../pages/panier/PanierPage.jsx";
import ConfidentialitePage from "../pages/confidentialite/ConfidentialitePage.jsx";
import PrivateRoute from "../components/common/PrivateRoute.jsx";
import ErrorPage from "../pages/error/ErrorPage.jsx";

import { authService } from "../api/auth.service";
import { ROUTES, ROLES } from "../constants";
import AboutUsPage from "../pages/aboutus/aboutUs.jsx";

function RedirectBasedOnRole() {
  if (!authService.isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const role = authService.getRole();

  switch (role) {
    case ROLES.ADMIN:
      return <Navigate to={ROUTES.ADMIN} replace />;
    case ROLES.FORMATEUR:
      return <Navigate to={ROUTES.FORMATEUR} replace />;
    case ROLES.USER:
      return <Navigate to={ROUTES.PROFILE} replace />;
    default:
      return <Navigate to={ROUTES.LOGIN} replace />;
  }
}

export function AppRoutes() {
  return (
    <Routes>
      {/* ========== AUTH ROUTES ========== */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      {/* ========== PUBLIC ROUTES ========== */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.CATALOGUE} element={<CataloguePage />} />
      <Route path={ROUTES.FORMATION_DETAIL} element={<FormationDetailPage />} />
      <Route path={ROUTES.CONFIDENTIALITE} element={<ConfidentialitePage />} />
      <Route path={ROUTES.ABOUT_US} element={<AboutUsPage />} />

      {/* ========== PROTECTED ROUTES - USER ========== */}
      <Route
        path={ROUTES.PROFILE}
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="sessions-passees" element={<SessionsPassees />} />
        <Route path="attestations" element={<Attestations />} />
        <Route path="session/:id" element={<SessionDetailPageUser />} />

      </Route>
    <Route 
    path="/emargement/:participationId" 
    element={ 
    <PrivateRoute> 
      <Emargement /> 
      </PrivateRoute> 
    } 
    />

      <Route
        path={ROUTES.PANIER}
        element={
          <PrivateRoute>
            <PanierPage />
          </PrivateRoute>
        }
      />

      {/* ========== PROTECTED ROUTES - FORMATEUR ========== */}
      <Route
        path={ROUTES.FORMATEUR}
        element={
          <PrivateRoute role={ROLES.FORMATEUR}>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<FormateurDashboard />} />
        <Route path="sessions" element={<SessionsPageFormateur />} />
        <Route path="sessions/:id" element={<SessionDetailFormateur />} />
      </Route>

      {/* ========== PROTECTED ROUTES - ADMIN ========== */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <PrivateRoute role={ROLES.ADMIN}>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="formations" element={<FormationsPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="sessions/:id" element={<SessionDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
      </Route>

      {/* ========== REDIRECT ROUTES ========== */}
      <Route path="/dashboard" element={<RedirectBasedOnRole />} />

      {/* ========== 404 - PAGE NOT FOUND ========== */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
