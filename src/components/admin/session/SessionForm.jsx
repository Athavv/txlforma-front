import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { sessionService } from "../../../api/session.service";

export default function SessionForm({
  session,
  formations,
  formateurs,
  categories,
  selectedDate,
  onSuccess,
  onCancel,
  onDelete,
  isModal = false,
}) {
  const [formData, setFormData] = useState({
    categoryId: "",
    formationId: "",
    formateurId: "",
    startDate: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [filteredFormations, setFilteredFormations] = useState([]);

  useEffect(() => {
    setFilteredFormations(formations || []);
  }, [formations]);

  useEffect(() => {
    if (session) {
      const startDate = session.startDate
        ? session.startDate.split("T")[0]
        : "";
      setFormData({
        categoryId: session.formation?.category?.id?.toString() || "",
        formationId: session.formation?.id?.toString() || "",
        formateurId: session.formateur?.id?.toString() || "",
        startDate: startDate,
        startTime: (session.startTime || "").substring(0, 5),
        endTime: (session.endTime || "").substring(0, 5),
        location: session.location || "",
        capacity: session.capacity?.toString() || "",
        price: session.price?.toString() || "",
      });
    } else if (selectedDate) {
      setFormData((prev) => ({ ...prev, startDate: selectedDate }));
    }
  }, [session, selectedDate]);

  useEffect(() => {
    if (formData.categoryId) {
      const filtered = (formations || []).filter(
        (f) => f.category?.id?.toString() === formData.categoryId
      );
      setFilteredFormations(filtered);
      if (
        formData.formationId &&
        !filtered.find((f) => f.id?.toString() === formData.formationId)
      ) {
        setFormData((prev) => ({ ...prev, formationId: "" }));
      }
    } else {
      setFilteredFormations(formations || []);
    }
  }, [formData.categoryId, formations, formData.formationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        formationId: parseInt(formData.formationId),
        formateurId: parseInt(formData.formateurId),
        startDate: formData.startDate,
        endDate: formData.startDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
      };

      if (session) {
        await sessionService.updateSession(session.id, submitData);
      } else {
        await sessionService.createSession(submitData);
      }
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (isModal) {
    return (
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        style={{ margin: 0, padding: 0 }}
      >
        <div className="bg-white rounded-3xl p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar m-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-noir">
              {session ? "Modifier la session" : "Créer une session"}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Selectionner une catégorie
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                    formationId: "",
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none cursor-pointer"
              >
                <option value="">Toutes</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Sélectionner une formation
              </label>
              <select
                required
                value={formData.formationId}
                onChange={(e) =>
                  setFormData({ ...formData, formationId: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Sélectionner</option>
                {filteredFormations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Définir un formateur
              </label>
              <select
                required
                value={formData.formateurId}
                onChange={(e) =>
                  setFormData({ ...formData, formateurId: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Sélectionner</option>
                {formateurs?.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.firstname} {f.lastname}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Heure début
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Heure fin
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lieu</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Capacité
                </label>
                <input
                  type="number"
                  required
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-noir text-blanc rounded-2xl hover:bg-violet"
              >
                {loading
                  ? session
                    ? "Modification..."
                    : "Création..."
                  : session
                  ? "Modifier la session"
                  : "Créer la session +"}
              </button>
              {session && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(session.id)}
                  disabled={loading}
                  className="px-6 py-3 bg-orange text-white rounded-2xl hover:bg-orange/90"
                >
                  Supprimer la session
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-noir"
      >
        ← Retour
      </button>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-noir mb-2">Sessions</h1>
        <h2 className="text-2xl font-bold text-noir mb-2">
          {session ? "Modifier" : "Créer"}
        </h2>
      </div>
      <div className="bg-blanc border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Selectionner une catégorie
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                    formationId: "",
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none cursor-pointer"
              >
                <option value="">Toutes</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Formation
              </label>
              <select
                required
                value={formData.formationId}
                onChange={(e) =>
                  setFormData({ ...formData, formationId: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none cursor-pointer"
              >
                <option value="">Sélectionner</option>
                {filteredFormations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Formateur</label>
            <select
              required
              value={formData.formateurId}
              onChange={(e) =>
                setFormData({ ...formData, formateurId: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Sélectionner</option>
              {formateurs?.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.firstname} {f.lastname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Heure début
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Heure fin
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lieu</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Capacité</label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py- border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-noir text-blanc rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? session
                  ? "Modification..."
                  : "Création..."
                : session
                ? "Modifier"
                : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
