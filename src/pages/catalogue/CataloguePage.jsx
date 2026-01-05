import { useEffect, useState } from "react";
import Header from "../../components/common/layout/Header";
import { categoryService } from "../../api/category.service";
import { formationService } from "../../api/formation.service";
import CatalogueHero from "../../components/catalogue/CatalogueHero";
import CategorySection from "../../components/catalogue/CategorySection";

export default function CataloguePage() {
  const [categories, setCategories] = useState([]);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-beige">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div>Chargement des catalogues...</div>
        </div>
      </div>
    );
  }

  // Grouper les formations par catégorie
  const formationsByCategory = categories
    .map((category) => {
      const categoryFormations = formations.filter(
        (formation) => formation.category?.id === category.id
      );
      return {
        ...category,
        formations: categoryFormations,
      };
    })
    .filter((category) => category.formations.length > 0);

  const totalFormations = formations.length;
  const totalCategories = categories.length;

  return (
    <div className="min-h-screen bg-beige">
      <Header />
      <div className="p-6 md:p-8">
        {/* Hero Section */}
        <CatalogueHero
          totalCategories={totalCategories}
          totalFormations={totalFormations}
        />

        {/* Sections par catégorie */}
        {formationsByCategory.length === 0 ? (
          <div className="text-center py-12">
            <p>Aucune formation disponible</p>
          </div>
        ) : (
          formationsByCategory.map((categoryData) => (
            <CategorySection
              key={categoryData.id}
              category={categoryData}
              formations={categoryData.formations}
            />
          ))
        )}
      </div>
    </div>
  );
}
