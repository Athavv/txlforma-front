import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "../../constants";

export default function PanierHeader() {
  return (
    <>
    <div className="col-span-12">
      <h1 className="text-3xl font-semibold mb-5">Mon panier</h1>
      <h2 className="text-2xl font-medium mb-3">Mes sessions choisies</h2>
      <hr className="my-4 border-t border-gray-300" />
      <Link
        to={ROUTES.CATALOGUE}
        className="text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Continuer mes achats
      </Link>
    </div>
    </>
  );
}
