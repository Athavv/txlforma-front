import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";

export default function PanierEmpty() {
  return (
    <div className="bg-white rounded-lg p-8 text-center">
      <p className="text-gray-600 mb-4">Votre panier est vide</p>
      <Link to={ROUTES.CATALOGUE} className="text-vert hover:underline">
        Parcourir le catalogue
      </Link>
    </div>
  );
}
