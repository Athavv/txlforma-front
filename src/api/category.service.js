import api from "./api";

async function getAllCategories() {
  const { data } = await api.get("/categories");
  return { success: true, data };
}

async function createCategory(categoryData) {
  try {
    const { data } = await api.post("/categories", categoryData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Erreur" };
  }
}

async function updateCategory(categoryId, updatedData) {
  const { data } = await api.put(`/categories/${categoryId}`, updatedData);
  return { success: true, data };
}

async function getCategoryById(categoryId) {
  const { data } = await api.get(`/categories/${categoryId}`);
  return { success: true, data };
}

async function deleteCategory(categoryId) {
  try {
    await api.delete(`/categories/${categoryId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Erreur lors de la suppression",
    };
  }
}

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
