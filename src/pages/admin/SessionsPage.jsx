import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sessionService } from "../../api/session.service";
import { formationService } from "../../api/formation.service";
import { categoryService } from "../../api/category.service";
import { Edit, Trash2, X } from "lucide-react";
import SessionForm from "../../components/admin/session/SessionForm";
import SessionCalendar from "../../components/admin/session/SessionCalendar";

export default function SessionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const [formations, setFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      const sessionToEdit = sessions.find(
        (session) => session.id.toString() === editId
      );
      if (sessionToEdit) {
        setEditingSession(sessionToEdit);
        setSelectedDate(null);
        setShowForm(true);
      }
    }
  }, [searchParams, sessions]);

  const loadData = async () => {
    const [
      sessionsResult,
      formationsResult,
      formateursResult,
      categoriesResult,
    ] = await Promise.all([
      sessionService.getAllSessions(),
      formationService.getAllFormations(),
      sessionService.getFormateurs(),
      categoryService.getAllCategories(),
    ]);
    if (sessionsResult.success) setSessions(sessionsResult.data);
    if (formationsResult.success) setFormations(formationsResult.data);
    if (formateursResult.success) setFormateurs(formateursResult.data);
    if (categoriesResult.success) setCategories(categoriesResult.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette session ?"))
      return;
    try {
      const result = await sessionService.deleteSession(id);
      if (result.success) {
        setShowForm(false);
        setEditingSession(null);
        loadData();
      } else {
        alert(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleCreate = (dateStr = null) => {
    setEditingSession(null);
    setSelectedDate(dateStr);
    setShowForm(true);
  };

  const handleEdit = (session, event) => {
    if (event) event.stopPropagation();
    setEditingSession(session);
    setSelectedDate(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSession(null);
    setSelectedDate(null);
    setSearchParams({});
    loadData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSession(null);
    setSelectedDate(null);
    setSearchParams({});
  };

  const handleDateClick = (day, month, year) => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    handleCreate(dateStr);
  };

  const getCategoryColor = (categoryName) => {
    const colorOptions = [
      "bg-vert text-noir",
      "bg-violet text-white",
      "bg-orange text-white",
    ];
    const hash = categoryName
      ? categoryName
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 0;
    return colorOptions[hash % colorOptions.length];
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-noir mb-4">Sessions</h1>
        <p className="text-gray-600">
          Cette section vous permet de gérer les sessions de formation. Vous
          pouvez créer de nouvelles sessions, modifier les sessions existantes
          et consulter le calendrier des sessions.
        </p>
      </div>

      <SessionCalendar
        sessions={sessions}
        onDateClick={handleDateClick}
        getCategoryColor={getCategoryColor}
        onAddSession={handleCreate}
      />

      {showForm && (
        <SessionForm
          session={editingSession}
          formations={formations}
          formateurs={formateurs}
          categories={categories}
          selectedDate={selectedDate}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          onDelete={editingSession ? (id) => handleDelete(id) : null}
          isModal={true}
        />
      )}
    </div>
  );
}
