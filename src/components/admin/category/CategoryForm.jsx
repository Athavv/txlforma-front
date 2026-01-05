import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { categoryService } from "../../../api/category.service";
import api from "../../../api/api";
import { getImageUrl } from "../../../utils/imageUtils";

export default function CategoryForm({ category, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        imageUrl: category.imageUrl || "",
      });
    }
  }, [category]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const response = await api.post(
        "/files/upload/categories",
        formDataUpload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFormData({ ...formData, imageUrl: response.data });
    } catch (err) {
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = category
        ? await categoryService.updateCategory(category.id, formData)
        : await categoryService.createCategory(formData);

      if (result.success) {
        onSuccess();
      } else {
        alert(result.error || "Erreur");
      }
    } catch (err) {
      alert("Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-noir"
      >
        <ArrowLeft className="h-5 w-5" />
        Retour
      </button>

      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-noir mb-2">Catégories</h1>
        <h2 className="text-2xl font-bold text-noir mb-2">
          {category ? "Modifier" : "Créer"}
        </h2>
      </div>

      <div className="bg-blanc rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-noir mb-2">
              Nom
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Nom de la catégorie"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-noir mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-noir mb-2">
              Image
            </label>
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              {uploading ? "Upload..." : "Choisir un fichier"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {formData.imageUrl && (
              <img
                src={getImageUrl(formData.imageUrl)}
                alt="Preview"
                className="mt-4 h-48 w-full object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-6 py-3 bg-noir text-blanc rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? category
                  ? "Modification..."
                  : "Création..."
                : category
                ? "Modifier"
                : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
