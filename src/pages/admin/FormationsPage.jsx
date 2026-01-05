import { useEffect, useState } from "react";
import { formationService } from "../../api/formation.service";
import { categoryService } from "../../api/category.service";
import { Plus } from "lucide-react";
import CreateFormationForm from "../../components/admin/formation/CreateFormationForm";
import EditFormationForm from "../../components/admin/formation/EditFormationForm";
import SearchBar from "../../components/admin/common/SearchBar";
import FormationsList from "../../components/admin/formation/FormationsList";

export default function FormationsPage() {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [formationsResult, categoriesResult] = await Promise.all([
      formationService.getAllFormations(),
      categoryService.getAllCategories(),
    ]);
    if (formationsResult.success) setFormations(formationsResult.data);
    if (categoriesResult.success) setCategories(categoriesResult.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?"))
      return;
    try {
      const result = await formationService.deleteFormation(id);
      if (result.success) {
        loadData();
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleCreate = () => {
    setEditingFormation(null);
    setShowForm(true);
  };

  const handleEdit = (formation) => {
    setEditingFormation(formation);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFormation(null);
    loadData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFormation(null);
  };

  const filteredFormations = formations.filter(
    (formation) =>
      formation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showForm) {
    if (editingFormation) {
      return (
        <EditFormationForm
          formation={editingFormation}
          categories={categories}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      );
    } else {
      return (
        <CreateFormationForm
          categories={categories}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-4xl font-semibold text-noir">Formations</h1>
        <button
          onClick={handleCreate}
          className="mt-5 bg-noir text-blanc px-6 py-3 rounded-full font-régular hover:bg-violet transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Créer une formation
        </button>
      </div>

      <SearchBar
        placeholder="Rechercher une formation..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormationsList
          formations={filteredFormations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
