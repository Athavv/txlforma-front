import { API_BASE_URL } from "../constants";

export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  
  // Si API_BASE_URL n'est pas définie, retourner l'URL telle quelle
  if (!API_BASE_URL) {
    return imageUrl.startsWith("/") ? imageUrl : `/api/files/${imageUrl}`;
  }
  
  const baseUrl = API_BASE_URL.replace("/api", "");
  return imageUrl.startsWith("/")
    ? `${baseUrl}${imageUrl}`
    : `${baseUrl}/api/files/${imageUrl}`;
}
