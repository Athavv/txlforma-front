import api from "./api";

async function getGlobalStatistics(startDate, endDate) {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const { data } = await api.get("/statistics", { params });
  return { success: true, data };
}

async function getAllFormateursStatistics() {
  const { data } = await api.get("/statistics/formateurs");
  return { success: true, data };
}

async function getFormateurStatistics(formateurId) {
  const { data } = await api.get(`/statistics/formateurs/${formateurId}`);
  return { success: true, data };
}

async function getSessionDetails(sessionId) {
  const { data } = await api.get(`/statistics/sessions/${sessionId}/details`);
  return { success: true, data };
}

export const statisticsService = {
  getGlobalStatistics,
  getAllFormateursStatistics,
  getFormateurStatistics,
  getSessionDetails,
};
