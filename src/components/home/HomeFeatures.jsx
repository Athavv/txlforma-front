import starorange from "../../assets/images/home/starorange.png";
import etoiles from "../../assets/images/home/5etoiles.png";

const testimonials = [
  {
    text: "Plateforme intuitive, tout est clair et super fluide.",
    author: "Formateur gestion de projet",
  },
  {
    text: "Navigation simple, je trouve tout en quelques secondes.",
    author: "Élève en cybersécurité",
  },
  {
    text: "Interface moderne, agréable et vraiment facile à utiliser.",
    author: "Élève en dev front",
  },
  {
    text: "Plateforme rapide, bien organisée et très accessible.",
    author: "Formateur en dev front",
  },
  {
    text: "Ressources claires, plateforme propre et hyper pratique.",
    author: "Formateur dev back",
  },
  {
    text: "Plateforme efficace, fluide et pensée pour apprendre vite.",
    author: "Élève en gestion de projet",
  },
  {
    text: "Utilisation simple, je m'y retrouve immédiatement.",
    author: "Formateur dev back",
  },
  {
    text: "Une montée en compétences rapide grâce au présentiel.",
    author: "Élève en gestion de projet",
  },
];

export default function HomeFeatures() {
  return (
    <>
      <div className="w-full text-center mt-12 p-5">
        <div className="inline-flex items-center gap-10">
          <img src={starorange} className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-[24px]">
            Pourquoi choisir TXLFORMA ?
          </h2>
          <img src={starorange} className="w-8 h-8" />
        </div>
        <p className="mt-7 text-xl w-3/4 text-center mx-auto text-[16px]">
          Des avantages concrets pour votre montée en compétences
        </p>
      </div>
      <div className="text-blanc py-5 md:px-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, testimonialIndex) => (
            <div
              key={testimonialIndex}
              className="bg-noir rounded-3xl p-8 text-center"
            >
              <img
                src={etoiles}
                className="w-2/4 mx-auto mb-3"
                alt="5 étoiles"
              />
              <p className="mt-4 italic mx-5 text-lg">{testimonial.text}</p>
              <p className="mt-4 italic text-sm">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
