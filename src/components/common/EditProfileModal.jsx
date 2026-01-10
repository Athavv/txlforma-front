import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { userService } from "../../api/user.service";
import api from "../../api/api";
import { getImageUrl } from "../../utils/imageUtils";
import { User } from "lucide-react";

export default function EditProfileModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        imageUrl: user.imageUrl || "",
      });
      if (user.imageUrl) {
        setPreviewImage(getImageUrl(user.imageUrl));
      }
    }
  }, [user]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const response = await api.post("/files/upload/users", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, imageUrl: response.data });
      setPreviewImage(URL.createObjectURL(file));
    } catch (err) {
      setError("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.firstname || !formData.lastname || !formData.email) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
      };

      if (formData.password) {
        submitData.password = formData.password;
      }

      if (formData.imageUrl) {
        submitData.imageUrl = formData.imageUrl;
      }

      const result = await userService.updateUser(user.id, submitData);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ margin: 0, padding: 0 }}
    >
      <div className="bg-white rounded-3xl p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-noir">Modifier mon compte</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Photo de profil
            </label>
            <div className="flex items-center gap-4">
              {previewImage || formData.imageUrl ? (
                <img
                  src={previewImage || getImageUrl(formData.imageUrl)}
                  alt="Preview"
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-300"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="profile-edit-image-upload"
                />
                <label
                  htmlFor="profile-edit-image-upload"
                  className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors border ${
                    uploading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                      : "bg-white text-noir border-noir hover:bg-gray-50"
                  }`}
                >
                  {uploading ? "Upload en cours..." : "Insérer une image"}
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="ex. Thomas"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="ex. Pesquet"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ex. tpesquet@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmer mon mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmer le mot de passe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-noir text-blanc rounded-2xl hover:bg-violet"
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-orange text-white rounded-2xl hover:bg-orange/90"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
