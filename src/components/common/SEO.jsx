import { useEffect } from "react";

/**
 * Composant SEO pour gérer les meta tags dynamiques
 * @param {Object} props
 * @param {string} props.title - Titre de la page
 * @param {string} props.description - Description de la page
 * @param {string} props.keywords - Mots-clés (optionnel)
 * @param {string} props.image - URL de l'image pour les réseaux sociaux (optionnel)
 * @param {string} props.url - URL canonique de la page (optionnel)
 */
export default function SEO({ 
  title = "TXLFORMA - Plateforme de Formation en Ligne",
  description = "TXLFORMA est une plateforme de formation en ligne offrant un large catalogue de formations professionnelles.",
  keywords = "formation en ligne, e-learning, formation professionnelle, TXLFORMA, cours en ligne",
  image = "/logo.png",
  url = window.location.href
}) {
  useEffect(() => {
    // Mettre à jour le titre
    document.title = title;

    // Fonction helper pour mettre à jour ou créer un meta tag
    const updateMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                    document.querySelector(`meta[name="${property}"]`);
      
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        if (property.startsWith("og:") || property.startsWith("twitter:")) {
          element.setAttribute("property", property);
        } else {
          element.setAttribute("name", property);
        }
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Meta tags de base
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph tags
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", image);
    updateMetaTag("og:url", url);
    updateMetaTag("og:type", "website");

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:url", url);

    // Link canonical
    let canonicalLink = document.querySelector("link[rel='canonical']");
    if (canonicalLink) {
      canonicalLink.setAttribute("href", url);
    } else {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      canonicalLink.setAttribute("href", url);
      document.head.appendChild(canonicalLink);
    }
  }, [title, description, keywords, image, url]);

  return null;
}
