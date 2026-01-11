import axios from "axios";
import { API_BASE_URL } from "../constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs réseau (CORS, timeout, etc.)
    if (!error.response) {
      // Erreur réseau (CORS, timeout, etc.) - ne pas rediriger
      console.error("Erreur réseau:", error.message);
      return Promise.reject(error);
    }

    // Gérer les erreurs HTTP
    if (error.response.status === 401) {
      const url = error.config?.url || "";
      const isAuthAttempt = /\/auth\/(login|register)/.test(url);
      // Ne rediriger que si ce n'est pas une tentative d'authentification
      // et seulement si l'utilisateur était authentifié
      if (!isAuthAttempt && localStorage.getItem("token")) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } else if (error.response.status === 403) {
      // Erreur CORS ou accès refusé - ne pas rediriger
      console.error("Accès refusé (403)");
    } else if (error.response.status === 404) {
      console.error("Ressource introuvable");
    } else if (error.response.status >= 500) {
      console.error("Erreur serveur");
    }
    return Promise.reject(error);
  }
);

export default api;
