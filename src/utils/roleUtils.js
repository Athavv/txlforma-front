import { ROLE_LABELS, ROLE_COLORS } from "../constants/roles";

export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || "Utilisateur";
};

export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || "bg-vert";
};
