import api from "./api";

async function getPanier() {
  try {
    const { data } = await api.get("/panier");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function addSessionToPanier(sessionId) {
  try {
    const { data } = await api.post(`/panier/sessions/${sessionId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function removeSessionFromPanier(sessionId) {
  try {
    const { data } = await api.delete(`/panier/sessions/${sessionId}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function clearPanier() {
  try {
    await api.delete("/panier");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

export const panierService = {
  getPanier,
  addSessionToPanier,
  removeSessionFromPanier,
  clearPanier,
};
