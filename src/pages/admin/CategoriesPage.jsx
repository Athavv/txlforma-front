import { useEffect, useState } from "react";
import { categoryService } from "../../api/category.service";
import { Plus } from "lucide-react";
import CreateCategoryForm from "../../components/admin/category/CreateCategoryForm";
import EditCategoryForm from "../../components/admin/category/EditCategoryForm";
import SearchBar from "../../components/admin/common/SearchBar";
import CategoriesList from "../../components/admin/category/CategoriesList";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const result = await categoryService.getAllCategories();
    if (result.success) setCategories(result.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?"))
      return;
    try {
      const result = await categoryService.deleteCategory(id);
      if (result.success) {
        loadCategories();
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    loadCategories();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showForm) {
    if (editingCategory) {
      return (
        <EditCategoryForm
          category={editingCategory}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      );
    } else {
      return (
        <CreateCategoryForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-4xl font-semibold text-noir">Catégories</h1>
        <button
          onClick={handleCreate}
          className="mt-5 bg-noir text-blanc px-6 py-3 rounded-full font-regular hover:bg-violet transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Créer une catégorie
        </button>
      </div>

      <SearchBar
        placeholder="Rechercher une catégorie..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoriesList
          categories={filteredCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
