import { useEffect, useState } from "react";
import { statisticsService } from "../../api/statistics.service";
import { userService } from "../../api/user.service";
import { sessionService } from "../../api/session.service";
import { formationService } from "../../api/formation.service";
import { categoryService } from "../../api/category.service";
import { noteService } from "../../api/note.service";
import { participationService } from "../../api/participation.service";
import { getRoleLabel, getRoleColor } from "../../utils/roleUtils";
import { formatDate } from "../../utils/formatUtils";
import { getImageUrl } from "../../utils/imageUtils";
import {
  Users,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Presentation,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [
        statsResult,
        usersResult,
        sessionsResult,
        formationsResult,
        categoriesResult,
      ] = await Promise.all([
        statisticsService.getGlobalStatistics(),
        userService.getAllUsers(),
        sessionService.getAllSessions(),
        formationService.getAllFormations(),
        categoryService.getAllCategories(),
      ]);

      if (statsResult.success) setStats(statsResult.data);
      if (usersResult.success) setUsers(usersResult.data);
      if (sessionsResult.success) setSessions(sessionsResult.data);
      if (formationsResult.success) setFormations(formationsResult.data);
      if (categoriesResult.success) setCategories(categoriesResult.data);

      if (sessionsResult.success) {
        const notesPromises = sessionsResult.data.map((session) =>
          noteService.getNotesBySession(session.id)
        );
        const notesResults = await Promise.all(notesPromises);
        const allNotes = notesResults
          .filter((result) => result.success && Array.isArray(result.data))
          .flatMap((result) => result.data);
        setNotes(allNotes);

        const participationPromises = sessionsResult.data.map((session) =>
          participationService.getParticipationsBySession(session.id)
        );
        const participationsResults = await Promise.all(participationPromises);
        const allPayments = participationsResults
          .filter((result) => result.success && Array.isArray(result.data))
          .flatMap((result) => result.data)
          .map((participation) => participation.paiement)
          .filter(Boolean);
        const uniquePayments = allPayments.filter(
          (payment, index, self) =>
            index ===
            self.findIndex((paymentItem) => paymentItem.id === payment.id)
        );
        setPayments(uniquePayments);
      }

      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculer les statistiques utilisateurs
  const totalUsers = users.filter((user) => user.role === "USER").length;
  const totalFormateurs = users.filter(
    (user) => user.role === "FORMATEUR"
  ).length;
  const totalAdmins = users.filter((user) => user.role === "ADMIN").length;

  // Sessions à venir
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.startDate);
    return sessionDate >= today;
  }).length;

  // Moyenne générale des sessions
  const averageScore =
    notes.length > 0
      ? (
          notes.reduce((sum, note) => sum + note.note, 0) / notes.length
        ).toFixed(1)
      : "0.0";

  // Paiements en attente (données réelles)
  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING"
  ).length;

  // Calculer le CA réel à partir des paiements réussis
  const calculatedRevenue = payments
    .filter(
      (payment) =>
        payment.status === "SUCCEEDED" || payment.status === "SUCCEED"
    )
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  // Utiliser le CA de l'API ou celui calculé
  const totalRevenue = stats?.totalRevenue || calculatedRevenue;

  // Utiliser le taux de réussite de l'API (calculé correctement côté backend)
  const successRate = stats?.successRate || 0;

  // Utilisateurs récents (7 derniers)
  const recentUsers = [...users]
    .sort(
      (userA, userB) =>
        new Date(userB.createdAt || userB.created_at) -
        new Date(userA.createdAt || userA.created_at)
    )
    .slice(0, 7);

  // Formations par catégorie
  const categoryCounts = {};
  formations.forEach((formation) => {
    const categoryId = formation.category?.id || formation.categoryId;
    if (categoryId) {
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    }
  });

  const categoryLabels = categories
    .filter((category) => categoryCounts[category.id])
    .map((category) => category.name);
  const categoryData = categories
    .filter((category) => categoryCounts[category.id])
    .map((category) => categoryCounts[category.id]);

  const statCards = [
    {
      label: "Utilisateur",
      value: totalUsers,
      icon: Users,
      color: "bg-beige1",
    },
    {
      label: "Formateur",
      value: totalFormateurs,
      icon: Presentation,
      color: "bg-beige1",
    },
    {
      label: "Taux réussite",
      value: successRate ? `${Math.round(successRate)}%` : "0%",
      icon: TrendingUp,
      color: "bg-beige1",
    },
    {
      label: "CA",
      value: totalRevenue
        ? totalRevenue >= 1000000
          ? `${(totalRevenue / 1000000).toFixed(1)}M €`
          : totalRevenue >= 1000
          ? `${(totalRevenue / 1000).toFixed(0)}K €`
          : `${totalRevenue.toFixed(0)} €`
        : "0 €",
      icon: DollarSign,
      color: "bg-beige1",
    },
  ];

  // Données pour le graphique de revenus (données réelles par mois)
  const getRevenueByMonth = () => {
    const monthData = [0, 0, 0, 0, 0, 0];

    // Calculer les revenus par mois à partir des paiements réussis
    const successfulPayments = payments.filter(
      (payment) => payment.status === "SUCCEEDED"
    );
    const now = new Date();

    successfulPayments.forEach((payment) => {
      if (payment.createdAt || payment.created_at) {
        const paymentDate = new Date(payment.createdAt || payment.created_at);
        const monthsDiff =
          (now.getFullYear() - paymentDate.getFullYear()) * 12 +
          (now.getMonth() - paymentDate.getMonth());

        // Si le paiement est dans les 6 derniers mois
        if (monthsDiff >= 0 && monthsDiff < 6) {
          const index = 5 - monthsDiff; // 0 = il y a 5 mois, 5 = ce mois
          if (index >= 0 && index < 6) {
            // Les montants sont déjà en euros
            monthData[index] += payment.amount || 0;
          }
        }
      }
    });

    return monthData;
  };

  const revenueData = {
    labels: ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"],
    datasets: [
      {
        label: "Chiffre d'affaire",
        data: getRevenueByMonth(),
        borderColor: "#9F8BE9",
        backgroundColor: "rgba(159, 139, 233, 0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.y.toFixed(2) + " €";
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toFixed(0) + " €";
          },
        },
      },
    },
  };

  // Données pour le graphique des utilisateurs (donut)
  const usersData = {
    labels: ["User", "Formateur", "Administrateur"],
    datasets: [
      {
        data: [totalUsers, totalFormateurs, totalAdmins],
        backgroundColor: ["#D3F26A", "#9F8BE9", "#FF4F01"],
        borderWidth: 0,
      },
    ],
  };

  const usersOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Données pour le graphique des formations par catégorie (pie chart)
  const categoryColors = [
    "#FF4F01",
    "#D3F26A",
    "#9F8BE9",
    "#E5E5E5",
    "#808080",
  ];
  const categoryChartData = {
    labels: categoryLabels.length > 0 ? categoryLabels : [],
    datasets: [
      {
        data: categoryData.length > 0 ? categoryData : [],
        backgroundColor: categoryColors.slice(0, categoryLabels.length),
        borderWidth: 0,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold text-noir mb-2">Tableau de bord</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-blanc rounded-2xl p-6 "
            >
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-noir" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-semibold text-noir mb-1">
                    {card.value}
                  </div>
                  <div className="text-sm text-gray-600">{card.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section - Same Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-blanc rounded-2xl p-6">
          <h3 className="text-xl font-regular text-noir mb-4">
            Chiffre d'affaire
          </h3>
          <div className="text-3xl font-semibold text-noir mb-4">
            {totalRevenue
              ? totalRevenue >= 1000000
                ? `${(totalRevenue / 1000000).toFixed(1)}M €`
                : totalRevenue >= 1000
                ? `${(totalRevenue / 1000).toFixed(0)}K €`
                : `${totalRevenue.toFixed(0)} €`
              : "0 €"}
          </div>
          <div className="h-48">
            <Line data={revenueData} options={revenueOptions} />
          </div>
        </div>

        {/* Users Chart */}
        <div className="bg-blanc rounded-2xl p-6">
          <h3 className="text-xl font-regular text-noir mb-4">
            Nombre d'utilisateur total
          </h3>
          <div className="text-3xl font-semibold text-noir mb-4">
            {totalUsers + totalFormateurs + totalAdmins}
          </div>
          <div className="h-48 mb-4">
            <Doughnut data={usersData} options={usersOptions} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-vert"></div>
              <span className="text-sm text-gray-600">Utilisateur {totalUsers}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet"></div>
              <span className="text-sm text-gray-600">
                Formateur {totalFormateurs}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange"></div>
              <span className="text-sm text-gray-600">
                Administrateur {totalAdmins}
              </span>
            </div>
          </div>
        </div>

        {/* Training by Category Chart */}
        <div className="bg-noir rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blanc mb-2">
            Formation par catégorie
          </h3>
          <p className="text-sm text-gray-400 mb-4">Par catégory</p>
          <div className="h-48">
            <Pie data={categoryChartData} options={categoryChartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recent Activities below Revenue and Users */}
        <div className="lg:col-span-2 bg-blanc rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-noir mb-2">
            Activités récentes
          </h3>
          <p className="text-sm text-noir mb-4">Nouveaux utilisateurs</p>
          <div className="overflow-x-auto bg-blanc">
            <table className="w-full">
              <thead>
                <tr className="">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    NOM
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Rôle
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Créer le
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {user.imageUrl ? (
                          <img
                            src={getImageUrl(user.imageUrl)}
                            alt={`${user.firstname} ${user.lastname}`}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-noir">
                          {user.firstname} {user.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-noir ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-noir">
                      {formatDate(user.createdAt || user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Additional Cards below Category Chart */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <div className="bg-orange rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-regular text-noir mb-2">
              Nombre de sessions à venir
            </h3>
            <div className="text-4xl font-r text-noir">
              {upcomingSessions}
            </div>
          </div>

          {/* Average Session Score */}
          <div className="bg-vert rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-regular text-noir mb-2">
              Moyenne générales des sessions
            </h3>
            <div className="text-4xl font-semibold text-noir">
              {averageScore}/20
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-violet rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-regular text-noir mb-2">
              Paiements en attentes
            </h3>
            <div className="text-4xl font-semibold text-noir">
              {pendingPayments}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
