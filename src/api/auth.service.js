import api from "./api";

async function login(email, password) {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    const { token } = data;

    localStorage.setItem("token", token);

    const userInfo = parseJwt(token);

    localStorage.setItem("role", userInfo.role);
    localStorage.setItem("email", userInfo.sub);
    localStorage.setItem("userId", userInfo.userId);

    return {
      success: true,
      user: {
        email: userInfo.sub,
        role: userInfo.role,
        id: userInfo.userId,
      },
    };
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401 || status === 403) {
      return {
        success: false,
        error: message || "Erreur dans le login ou le mot de passe",
      };
    }

    return {
      success: false,
      error: message || "Erreur lors de la connexion",
    };
  }
}

async function register(data) {
  try {
    const registerData = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
    };

    if (data.imageUrl) {
      registerData.imageUrl = data.imageUrl;
    }

    await api.post("/auth/register", registerData);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Erreur lors de l'inscription",
    };
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "/login";
}

function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  const decoded = parseJwt(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
}

function getRole() {
  return localStorage.getItem("role");
}

function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = parseJwt(token);
  return {
    id: localStorage.getItem("userId"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    name: decoded.name || localStorage.getItem("email")?.split("@")[0],
    token: token,
  };
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(
        (character) =>
          "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2)
      )
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export const authService = {
  login,
  register,
  logout,
  isAuthenticated,
  getRole,
  getCurrentUser,
};
