import { useEffect, useState } from "react";
import { categoryService } from "../../api/category.service";
import { formationService } from "../../api/formation.service";
import { getImageUrl } from "../../utils/imageUtils";
import rectangleorange from "../../assets/images/home/rectangleorange.png";
import staticcatagories from "../../assets/images/home/staticcatagories.png";

export default function CategoriesFormations() {
  const [categories, setCategories] = useState([]);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [categoriesResult, formationsResult] = await Promise.all([
        categoryService.getAllCategories(),
        formationService.getAllFormations(),
      ]);
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }
      if (formationsResult.success) {
        setFormations(formationsResult.data);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 md:px-12">
      {categories.slice(0, 6).map((category) => {
        const categoryFormations = formations.filter(
          (formation) => formation.category?.id === category.id
        );
        return (
          <div key={category.id} className="bg-white rounded-2xl p-6">
            {category.imageUrl ? (
              <img
                src={getImageUrl(category.imageUrl)}
                alt={category.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <img
                src={staticcatagories}
                alt={category.name}
                className="mb-4 object-cover"
              />
            )}
            <h3 className="text-xl md:text-xl font-semibold mb-4">
              {category.name}
            </h3>
            <div className="flex flex-row items-start gap-3">
              <img src={rectangleorange} className="cover" />
              <div className="flex flex-row gap-2 flex-wrap mt-2 text-gray-500 leading-none">
                {categoryFormations.map((formation, index) => (
                  <span key={formation.id} className="font-normal mb-1">
                    {formation.title}
                    {index < categoryFormations.length - 1 && ","}
                  </span>
                ))}
              </div>
            </div>
            <button className="py-1 text-sm mt-3 rounded underline hover:text-gray-500">
              En savoir +
            </button>
          </div>
        );
      })}
    </div>
  );
}
