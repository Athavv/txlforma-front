import api from "./api";

async function getAllSessions(params = {}) {
  const { data } = await api.get("/sessions", { params });
  return { success: true, data };
}

async function getSessionsByFormation(formationId) {
  const { data } = await api.get(`/sessions?formation=${formationId}`);
  return { success: true, data };
}

async function getSessionById(sessionId) {
  const { data } = await api.get(`/sessions/${sessionId}`);
  return { success: true, data };
}

async function getFormateurs() {
  const { data } = await api.get("/sessions/formateurs");
  return { success: true, data };
}

async function getSessionsByFormateur(formateurId) {
  const { data } = await api.get(`/sessions/formateur/${formateurId}`);
  return { success: true, data };
}

async function getMySessions() {
  const { data } = await api.get("/sessions/me");
  return { success: true, data };
}

async function createSession(sessionData) {
  const { data } = await api.post("/sessions", sessionData);
  return { success: true, data };
}

async function updateSession(sessionId, updatedData) {
  const { data } = await api.put(`/sessions/${sessionId}`, updatedData);
  return { success: true, data };
}

async function deleteSession(sessionId) {
  try {
    await api.delete(`/sessions/${sessionId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Erreur lors de la suppression",
    };
  }
}

export const sessionService = {
  getAllSessions,
  getSessionsByFormation,
  getSessionsByFormateur,
  getMySessions,
  getSessionById,
  getFormateurs,
  createSession,
  updateSession,
  deleteSession,
};
