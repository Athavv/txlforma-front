import { Edit, Trash2 } from "lucide-react";

export default function UsersList({ users, onEdit, onDelete, getRoleColor, getRoleLabel }) {
  if (users.length === 0) {
    return (
      <div className="bg-blanc rounded-2xl overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          Aucun utilisateur trouvé
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="">
        <h2 className="text-[24px] font-medium text-noir mt-5">
          Tous les utilisateurs
        </h2>
      </div>
      <div className="max-h-[600px] overflow-y-auto p-5 bg-[#F]">
       <div className="px-2 space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 flex items-center justify-between rounded-full bg-[#E4E3D6]"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold">
                {user.firstname?.[0]?.toUpperCase() ||
                  user.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
              <div>
                <h3 className="font-semibold text-noir">
                  {user.firstname} {user.lastname}
                </h3>
                <p className="text-sm text-noir">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <span
                className={`px-4 py-1 rounded-full text-xs font-medium text-noir ${getRoleColor(
                  user.role
                )}`}
              >
                {getRoleLabel(user.role)}
              </span>
              <button
                onClick={() => onEdit(user)}
                className="p-2 hover:bg-beige2 rounded-full transition-colors"
              >
                <Edit className="h-5 w-5 text-noir" />
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="p-2 hover:bg-beige1 rounded-full transition-colors"
              >
                <Trash2 className="h-5 w-5 text-orange" />
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

