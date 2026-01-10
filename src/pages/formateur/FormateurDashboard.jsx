import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessionService } from "../../api/session.service";
import { noteService } from "../../api/note.service";
import { Users, Calendar, Star, Clock, BookOpen } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FormateurDashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sessionsResult = await sessionService.getMySessions();
        let sessionsAvecStatus = [];

        if (sessionsResult.success) {
          sessionsAvecStatus = sessionsResult.data.map((session) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const startDate = new Date(session.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(session.endDate);
            endDate.setHours(0, 0, 0, 0);

            let status = "";
            if (today < startDate) status = "a_venir";
            else if (today >= startDate && today <= endDate)
              status = "en_cours";
            else if (today > endDate) status = "passee";

            return { ...session, status };
          });

          setSessions(sessionsAvecStatus);
        }

        const notesPromises = sessionsAvecStatus.map((session) =>
          noteService.getNotesBySession(session.id)
        );

        const notesResults = await Promise.all(notesPromises);
        const allNotes = notesResults
          .filter(
            (resultat) => resultat.success && Array.isArray(resultat.data)
          )
          .flatMap((resultat) => resultat.data);

        setNotes(allNotes);
      } finally {
        setLoading(false);
      }
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

  const totalFormations = new Set(
    sessions.map((session) => session.formationId)
  ).size;
  const totalSessions = sessions.length;

  const averageNote =
    notes.length > 0
      ? (notes.reduce((sum, n) => sum + n.note, 0) / notes.length).toFixed(1)
      : "0.0";

  const totalMinutes = sessions.reduce((sum, session) => {
    if (!session.startTime || !session.endTime) return sum;
    const [startHours, startMinutes] = session.startTime.split(":").map(Number);
    const [endHours, endMinutes] = session.endTime.split(":").map(Number);
    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;
    return sum + (endInMinutes - startInMinutes);
  }, 0);
  const totalHours = `${Math.floor(totalMinutes / 60)}h ${
    totalMinutes % 60
  }min`;

  const sessionsParMois = {};

  sessions.forEach((session) => {
    const date = new Date(session.startDate);
    const moisAnnee = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });

    if (!sessionsParMois[moisAnnee]) {
      sessionsParMois[moisAnnee] = 0;
    }
    sessionsParMois[moisAnnee]++;
  });

  const monthChartData = {
    labels: Object.keys(sessionsParMois),
    datasets: [
      {
        data: Object.values(sessionsParMois),
        backgroundColor: [
          "#FF4F01",
          "#9F8BE9",
          "#D3F26A",
          "#F5A623",
          "#4A90E2",
        ],
        borderWidth: 0,
      },
    ],
  };

  const statCards = [
    {
      label: "Formations différentes",
      value: totalFormations,
      icon: BookOpen,
      color: "bg-beige1",
    },
    {
      label: "Sessions",
      value: totalSessions,
      icon: Calendar,
      color: "bg-beige1",
    },
    {
      label: "Note moyenne",
      value: `${averageNote}/20`,
      icon: Star,
      color: "bg-beige1",
    },
    {
      label: "Heures de formation",
      value: `${totalHours}`,
      icon: Clock,
      color: "bg-beige1",
    },
  ];

  const sessionsEnCours = sessions.filter((s) => s.status === "en_cours");
  const sessionsPassees = sessions.filter((s) => s.status === "passee");
  const sessionsAVenir = sessions.filter((s) => s.status === "a_venir");

  const sessionsStatusData = {
    labels: ["En cours", "À venir", "Passées"],
    datasets: [
      {
        data: [
          sessionsEnCours.length,
          sessionsAVenir.length,
          sessionsPassees.length,
        ],
        backgroundColor: ["#D3F26A", "#9F8BE9", "#FF4F01"],
        borderWidth: 0,
      },
    ],
  };

  const sessionsStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-8 px-5 sm:px-6 lg:px-0">
      <h1 className="text-2xl md:text-4xl font-semibold text-noir">
        Tableau de bord
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-blanc rounded-2xl p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-noir" />
                </div>
                <div>
                  <div className="text-3xl font-semibold text-noir">
                    {card.value}
                  </div>
                  <div className="text-sm text-gray-600">{card.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GRAPH - Répartition de mes sessions */}
        <div className="bg-blanc rounded-2xl p-6 lg:col-span-6">
          <h3 className="text-xl font-regular text-noir mb-4">
            Répartition de mes sessions
          </h3>

          <div className="h-56 mb-4">
            <Doughnut
              data={sessionsStatusData}
              options={sessionsStatusOptions}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-vert"></div>
              <span className="text-sm text-gray-600">En cours</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet"></div>
              <span className="text-sm text-gray-600">À venir</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange"></div>
              <span className="text-sm text-gray-600">Passées</span>
            </div>
          </div>
        </div>

        {/* GRAPH - Sessions par mois */}
        <div className="bg-noir rounded-2xl p-6 lg:col-span-6">
          <h3 className="text-xl font-semibold text-blanc mb-2">
            Mes sessions par mois
          </h3>

          <div className="h-56">
            <Pie data={monthChartData} options={sessionsStatusOptions} />
          </div>

          <div className="space-y-2 mt-4">
            {Object.entries(sessionsParMois).map(([mois, count], index) => (
              <div key={mois} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: [
                        "#FF4F01",
                        "#9F8BE9",
                        "#D3F26A",
                        "#F5A623",
                        "#4A90E2",
                      ][index % 5],
                    }}
                  ></div>
                  <span className="text-sm text-gray-300 capitalize">
                    {mois}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SESSIONS À VENIR */}
      <div>
        <h2 className="text-xl font-medium text-noir mb-5">
          Sessions à venir ({sessionsAVenir.length})
        </h2>

        {sessionsAVenir.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
            Aucune session à venir
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessionsAVenir.map((session) => (
              <div
                key={session.id}
                className="rounded-3xl p-6 bg-[#F5F5EA] grid grid-cols-12 gap-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* TEXTE - 7 colonnes */}
                <div className="col-span-12 lg:col-span-7 flex flex-col justify-between px-2 lg:px-4">
                  <div>
                    <h3 className="text-xl font-semibold text-noir mb-2">
                      {session.formationTitle}
                    </h3>

                    <p className="text-sm text-gray-700 mb-2">
                      Rappel : pensez à consulter les informations.
                    </p>

                    {/* Date */}
                    <div className="mb-3">
                      <div className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-full w-full max-w-xs">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">
                          {new Date(session.startDate).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bouton */}
                  <button
                    onClick={() => {
                      if (session && session.id) {
                        navigate(`/formateur/sessions/${session.id}`);
                      }
                    }}
                    className="bg-noir text-blanc px-6 py-2 rounded-full font-medium transition-colors w-full md:max-w-xs hover:bg-gray-800"
                  >
                    Voir les informations
                  </button>
                </div>

                {/* IMAGE - 5 colonnes */}
                <div className="col-span-12 lg:col-span-5 flex justify-end">
                  {session.formationImageUrl ? (
                    <img
                      src={getImageUrl(session.formationImageUrl)}
                      alt={session.formationTitle}
                      className="w-full lg:w-full h-36 lg:h-40 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full lg:w-full h-36 lg:h-40 bg-gray-300 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Pas d'image</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
