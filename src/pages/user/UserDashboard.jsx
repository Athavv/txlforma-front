export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold text-noir mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">Bienvenue sur votre espace personnel</p>
      </div>

      <div className="bg-blanc rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-noir mb-4">
          Mes formations
        </h2>
        <p className="text-gray-600">
          Vos formations suivies seront affichées ici.
        </p>
      </div>
    </div>
  );
}
