import { useEffect, useState } from "react";
import { userService } from "../../api/user.service";
import { getRoleColor, getRoleLabel } from "../../utils/roleUtils";
import { Plus } from "lucide-react";
import CreateUserForm from "../../components/admin/user/CreateUserForm";
import EditUserForm from "../../components/admin/user/EditUserForm";
import SearchBar from "../../components/admin/common/SearchBar";
import UsersList from "../../components/admin/user/UsersList";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await userService.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      return;
    }
    const result = await userService.deleteUser(id);
    if (result.success) {
      loadUsers();
    } else {
      alert("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingUser(null);
    loadUsers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showForm) {
    if (editingUser) {
      return (
        <EditUserForm
          user={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      );
    } else {
      return (
        <CreateUserForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="">
        <h1 className="text-4xl font-semibold text-noir">Utilisateurs</h1>
        <button
          onClick={handleCreate}
          className="mt-5 bg-noir text-blanc px-6 py-3 rounded-full font-regular hover:bg-orange transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Créer un utilisateur
        </button>
      </div>

      <SearchBar
        placeholder="Rechercher un utilisateur ou formateur..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />


      <UsersList
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRoleColor={getRoleColor}
        getRoleLabel={getRoleLabel}
      />
    </div>
  );
}
