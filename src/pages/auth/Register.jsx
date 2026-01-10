import { useState } from "react";
import { authService } from "../../api/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import pageinscription from "../../assets/images/login/pageinscription.png";
import api from "../../api/api";
import { User } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm: "",
    acceptCGU: false,
    imageUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password ||
      !formData.confirm
    ) {
      return setError("Veuillez remplir tous les champs");
    }

    if (!validateEmail(formData.email)) {
      return setError("Veuillez entrer un email valide");
    }

    if (formData.password.length < 6) {
      return setError("Le mot de passe doit contenir au moins 6 caractères");
    }

    if (formData.password !== formData.confirm) {
      return setError("Les mots de passe ne correspondent pas");
    }

    if (!formData.acceptCGU) {
      return setError(
        "Vous devez accepter les conditions générales pour continuer"
      );
    }

    setLoading(true);
    try {
      const submitData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      };

      if (formData.imageUrl) {
        submitData.imageUrl = formData.imageUrl;
      }

      const result = await authService.register(submitData);
      if (result.success) {
        navigate(ROUTES.LOGIN);
      } else {
        setError(result.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setError("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${pageinscription})` }}
    >
      <div className="w-full max-w-xl">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="pt-3">
            <Link
              to={ROUTES.HOME}
              className="px-6 text-xs text-noir/50 font-medium"
            >
              ← Retourner à l'accueil
            </Link>
          </div>

          <div className="px-12 py-10">
            <div className="text-center">
              <img src="/logo.png" className="mx-auto mb-3" />
              <p className="mt-2 text-gray-600">
                Rejoignez la plateforme en quelques secondes
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <span className="text-red-500 text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mt-8">
                <label className="block text-xl font-medium text-gray-700 mb-3">
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
                      id="profile-image-upload"
                    />
                    <label
                      htmlFor="profile-image-upload"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    name="firstname"
                    onChange={handleChange}
                    value={formData.firstname}
                    placeholder="ex : Thomas"
                    className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    name="lastname"
                    onChange={handleChange}
                    value={formData.lastname}
                    placeholder="ex : Endrick"
                    className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="nom@exemple.com"
                  className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="••••••••"
                    className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-1">
                    Confirmation
                  </label>
                  <input
                    type="password"
                    name="confirm"
                    onChange={handleChange}
                    value={formData.confirm}
                    placeholder="••••••••"
                    className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                  />
                </div>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  name="acceptCGU"
                  checked={formData.acceptCGU}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 border-gray-300 rounded"
                />

                <label className="text-sm text-noir">
                  J’accepte les{" "}
                  <Link
                    to={ROUTES.CONFIDENTIALITE}
                    className="text-bleu underline hover:text-bleu/80"
                  >
                    conditions générales d’utilisation
                  </Link>
                </label>
              </div>

              <button
                className={`w-full py-4 rounded-2xl text-white font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-noir"
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Inscription...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </button>
              <p className="text-center text-md text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link to={ROUTES.LOGIN} className="font-bold">
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
