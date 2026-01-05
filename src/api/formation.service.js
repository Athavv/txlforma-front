import api from "./api";

async function getAllFormations() {
  const { data } = await api.get("/formations");
  return { success: true, data };
}

async function getFormationsByCategory(categoryId) {
  const { data } = await api.get(`/formations?categoryId=${categoryId}`);
  return { success: true, data };
}

async function getFormationById(formationId) {
  const { data } = await api.get(`/formations/${formationId}`);
  return { success: true, data };
}

async function createFormation(formationData) {
  const { data } = await api.post("/formations", formationData);
  return { success: true, data };
}

async function updateFormation(formationId, updatedData) {
  const { data } = await api.put(`/formations/${formationId}`, updatedData);
  return { success: true, data };
}

async function deleteFormation(formationId) {
  try {
    await api.delete(`/formations/${formationId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Erreur lors de la suppression",
    };
  }
}

export const formationService = {
  getAllFormations,
  getFormationsByCategory,
  getFormationById,
  createFormation,
  updateFormation,
  deleteFormation,
};
