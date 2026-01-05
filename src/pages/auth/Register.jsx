import { useState } from "react";
import { authService } from "../../api/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import pageinscription from "../../assets/images/login/pageinscription.png";

function Register() {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
    setError("");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !data.firstname ||
      !data.lastname ||
      !data.email ||
      !data.password ||
      !data.confirm
    ) {
      return setError("Veuillez remplir tous les champs");
    }

    if (!validateEmail(data.email)) {
      return setError("Veuillez entrer un email valide");
    }

    if (data.password.length < 6) {
      return setError("Le mot de passe doit contenir au moins 6 caractères");
    }

    if (data.password !== data.confirm) {
      return setError("Les mots de passe ne correspondent pas");
    }

    setLoading(true);
    try {
      const result = await authService.register(data);
      if (result.success) {
        navigate("/login");
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

            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <div className="relative">
                    <input
                      name="firstname"
                      onChange={change}
                      value={data.firstname}
                      placeholder="ex : Thomas"
                      className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <div className="relative">
                    <input
                      name="lastname"
                      onChange={change}
                      value={data.lastname}
                      placeholder="ex : Endrick"
                      className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xl font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    onChange={change}
                    value={data.email}
                    placeholder="nom@exemple.com"
                    className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      onChange={change}
                      value={data.password}
                      placeholder="••••••••"
                      className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xl font-medium text-gray-700 mb-1">
                    Confirmation
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirm"
                      onChange={change}
                      value={data.confirm}
                      placeholder="••••••••"
                      className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                      required
                    />
                  </div>
                </div>
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
                <Link to="/login" className="font-bold">
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
