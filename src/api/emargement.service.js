import api from "./api";

async function signParticipation(participationId, signatureData) {
  try {
    const { data } = await api.post("/emargements/sign", {
      participationId,
      signatureData,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function getEmargementsBySession(sessionId) {
  const { data } = await api.get(`/emargements/session/${sessionId}`);
  return { success: true, data };
}

async function getEmargementByParticipation(participationId) {
  const { data } = await api.get(
    `/emargements/participation/${participationId}`
  );
  return { success: true, data };
}

export const emargementService = {
  signParticipation,
  getEmargementsBySession,
  getEmargementByParticipation,
};
