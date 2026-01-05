import { API_BASE_URL } from "../constants";

export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  const baseUrl = API_BASE_URL.replace("/api", "");
  return imageUrl.startsWith("/")
    ? `${baseUrl}${imageUrl}`
    : `${baseUrl}/api/files/${imageUrl}`;
}
