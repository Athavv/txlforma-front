import { Edit, FileText } from "lucide-react";

export default function SessionDetailHeader({ session, onEdit }) {
  return (
    <div className="mb-6 px-5">
      <div className="flex items-start justify-between">
        <div>
          {session.formation?.category && (
            <span className="mt-3 px-4 py-2 bg-violet text-noir rounded-full text-sm inline-flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {session.formation.category.name}
            </span>
          )}
          <h1 className="text-[40px] font-semibold text-noir mt-5">
            Session {session.formation?.title || "Session"}
          </h1>
          {session.price && (
            <h2 className="text-[32px] font-semibold mt-2">
              {session.price}€
            </h2>
          )}
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-noir text-white rounded-full hover:bg-violet transition-colors"
        >
          <Edit className="h-4 w-4" />
          <span className="text-sm px-3 py-1">Modifier la session</span>
        </button>
      </div>
    </div>
  );
}

