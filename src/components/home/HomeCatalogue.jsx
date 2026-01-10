import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import starorange from "../../assets/images/home/starorange.png";
import CategoriesFormations from "../common/CategoriesFormations";

export default function HomeCatalogue() {
  return (
    <div>
      <div className="w-full text-center mt-8 p-5">
        <div className="inline-flex items-center gap-10">
          <img src={starorange} className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-[24px]">
            Notre catalogue
          </h2>
          <img src={starorange} className="w-8 h-8" />
        </div>
        <p className="mt-3 text-xl text-[16px] text-center lg:px-40">
          TXLFORMA propose un large éventail de formations, conçues pour
          développer vos compétences techniques et professionnelles dans des
          domaines variés. Nos sessions sont interactives et encadrées par
          des formateurs experts.
        </p>
      </div>
      <CategoriesFormations />
      <div className="text-center mt-6">
        <Link 
          to={ROUTES.CATALOGUE}
          className="bg-noir rounded-full text-blanc px-12 py-3 hover:-translate-y-1 active:bg-beige active:text-black active:border border-black transition-all cursor-pointer inline-block text-center"
        >
          Tout notre catalogue
        </Link>
      </div>
    </div>
  );
}

