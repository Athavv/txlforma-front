import api from "./api";

async function getAllUsers() {
  const { data } = await api.get("/users");
  return { success: true, data };
}

async function getCurrentUser() {
  const { data } = await api.get("/users/me");
  return { success: true, data };
}

async function createUser(userData) {
  try {
    const { data } = await api.post("/users", userData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function updateUser(userId, updatedData) {
  const { data } = await api.put(`/users/${userId}`, updatedData);
  return { success: true, data };
}

async function getUserById(userId) {
  const { data } = await api.get(`/users/${userId}`);
  return { success: true, data };
}

async function getFormateurs() {
  const { data } = await api.get("/users/formateurs");
  return { success: true, data };
}

async function deleteUser(userId) {
  await api.delete(`/users/${userId}`);
  return { success: true };
}

export const userService = {
  getAllUsers,
  getCurrentUser,
  getUserById,
  getFormateurs,
  createUser,
  updateUser,
  deleteUser,
};
