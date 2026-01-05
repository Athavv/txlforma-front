import { useState } from "react";
import { authService } from "../../api/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { ROUTES, ROLES } from "../../constants";
import pageinscription from "../../assets/images/login/pageinscription.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Veuillez remplir tous les champs");
    }

    if (!validateEmail(email)) {
      return setError("Veuillez entrer un email valide");
    }

    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Erreur lors de la connexion");
      }
    } catch (error) {
      setError("Erreur lors de la connexion");
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
          <div className="p-12">
            <div className="text-center mb-8">
              <img src="/logo.png" className="mx-auto mb-3" />
              <p className="text-gray-600 mt-2">
                Bienvenue, connectez-vous pour continuer
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <span className="text-red-500 text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(m) => {
                      setEmail(m.target.value);
                      setError("");
                    }}
                    placeholder="ex : abivigneswaran@txlforma.fr"
                    className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-1">
                  Mot de passe{" "}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(p) => {
                      setPassword(p.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    className="w-full pt-3 py-2 border-0 border-b border-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 mt-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-noir"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Connexion...
                  </>
                ) : (
                  <>Se connecter</>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-center text-md text-gray-600">
                Pas encore de compte ?{" "}
                <Link to="/register" className="font-bold">
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Demo Credentials (à supprimer en production) */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                🔑 Comptes de test :
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Admin:</span> admin@txlforma.fr
                  / password123
                </p>
                <p>
                  <span className="font-medium">Formateur:</span>{" "}
                  formateur@txlforma.fr / password123
                </p>
                <p>
                  <span className="font-medium">User:</span> user@txlforma.fr /
                  password123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
