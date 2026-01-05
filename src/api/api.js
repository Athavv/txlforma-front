import axios from "axios";
import { API_BASE_URL } from "../constants";

if (!API_BASE_URL) {
  console.error(
    "⚠️ VITE_API_BASE_URL n'est pas définie. Veuillez configurer la variable d'environnement."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL || "/api",
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
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthAttempt = /\/auth\/(login|register)/.test(url);
      if (!isAuthAttempt) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      console.error("Accès refusé");
    } else if (error.response?.status === 404) {
      console.error("Ressource introuvable");
    } else if (error.response?.status >= 500) {
      console.error("Erreur serveur");
    }
    return Promise.reject(error);
  }
);

export default api;
