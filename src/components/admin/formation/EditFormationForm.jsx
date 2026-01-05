import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { formationService } from "../../../api/formation.service";
import api from "../../../api/api";
import { getImageUrl } from "../../../utils/imageUtils";
import Lottie from "lottie-react";
import officeworkData from "../../../assets/json/officework.json";

export default function EditFormationForm({
  formation,
  categories,
  onSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setAnimationData(officeworkData);
  }, []);

  useEffect(() => {
    if (formation) {
      setFormData({
        title: formation.title || "",
        description: formation.description || "",
        categoryId: formation.category?.id?.toString() || "",
        imageUrl: formation.imageUrl || "",
      });
    }
  }, [formation]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const response = await api.post(
        "/files/upload/formations",
        formDataUpload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFormData({ ...formData, imageUrl: response.data });
    } catch {
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      };

      const result = await formationService.updateFormation(
        formation.id,
        submitData
      );
      if (!result.success) {
        throw new Error(result.error);
      }
      onSuccess();
    } catch {
      alert("Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-noir mb-2">Formations</h1>
        <h2 className="text-2xl font-semibold text-noir mb-4">
          Modifier une formation
        </h2>
        <p className="text-gray-700 mb-6 w-full">
          Modifiez les informations de la formation. Vous pouvez changer le
          titre, la description, la catégorie et l'image.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-7 space-y-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-noir"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </button>

          <div className="bg-blanc rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-noir mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({ ...formData, title: event.target.value })
                  }
                  className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                  placeholder="ex. React.js"
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
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                  placeholder="description de la formation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-noir mb-2">
                  Catégorie
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(event) =>
                    setFormData({ ...formData, categoryId: event.target.value })
                  }
                  className="w-full pt-3 py-2 border-0 border-b border-gray-300 bg-white appearance-none cursor-pointer"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-noir mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="file"
                    id="formation-edit-image-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="formation-edit-image-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    {uploading ? "Upload..." : "Choisir un fichier"}
                  </label>
                  <span className="text-sm text-gray-500">
                    {formData.imageUrl
                      ? "Fichier sélectionné"
                      : "No file choosen"}
                  </span>
                </div>
                {formData.imageUrl && (
                  <div className="mt-4 mb-4">
                    <img
                      src={getImageUrl(formData.imageUrl)}
                      alt="Preview"
                      className="h-48 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-start">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-2/5 px-6 py-3 bg-noir text-blanc rounded-lg hover:bg-violet transition-colors font-medium"
                >
                  {loading ? "Modification..." : "Modifier la formation"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5 p-4 hidden md:block mt-5">
          {animationData && (
            <Lottie
              animationData={animationData}
              loop={true}
              className="h-auto mx-auto"
              style={{ background: "transparent" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
