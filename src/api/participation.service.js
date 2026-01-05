import api from "./api";

async function getParticipationsBySession(sessionId) {
  const { data } = await api.get(`/participations/session/${sessionId}`);
  return { success: true, data };
}

async function getMyParticipations() {
  const { data } = await api.get("/participations/me");
  return { success: true, data };
}

export const participationService = {
  getParticipationsBySession,
  getMyParticipations,
};
