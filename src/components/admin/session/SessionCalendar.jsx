import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateLocal } from "../../../utils/dateUtils";

export default function SessionCalendar({
  sessions,
  onDateClick,
  getCategoryColor,
  onAddSession,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  const getCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Convert Sunday (0) to 7, then adjust for Monday start (Monday = 1)
    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 7 : startingDayOfWeek; // Sunday becomes 7
    startingDayOfWeek = startingDayOfWeek - 1; // Monday = 0, Sunday = 6

    const days = [];

    // Add previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let dayIndex = startingDayOfWeek - 1; dayIndex >= 0; dayIndex--) {
      const day = prevMonthLastDay - dayIndex;
      days.push({
        date: new Date(prevYear, prevMonth, day),
        isCurrentMonth: false,
      });
    }

    // Add current month days
    for (let dayIndex = 1; dayIndex <= daysInMonth; dayIndex++) {
      days.push({
        date: new Date(year, month, dayIndex),
        isCurrentMonth: true,
      });
    }

    // Fill remaining cells to make 42 cells (7 columns × 6 rows)
    const remainingCells = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let cellIndex = 1; cellIndex <= remainingCells; cellIndex++) {
      days.push({
        date: new Date(nextYear, nextMonth, cellIndex),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getSessionsForDate = (date) => {
    if (!date || !sessions) return [];
    const dateStr = formatDateLocal(date);
    return sessions.filter((session) => {
      const sessionDateStr = session.startDate
        ? session.startDate.split("T")[0]
        : null;
      return sessionDateStr === dateStr;
    });
  };

  const getCategoryName = (session) => {
    return (
      session.formation?.category?.name ||
      session.category?.name ||
      session.categoryName ||
      ""
    );
  };

  const handleSessionClick = (session, event) => {
    event.stopPropagation();
    navigate(`/admin/sessions/${session.id}`);
  };

  const handleAddClick = (date, event) => {
    event.stopPropagation();
    if (onAddSession) {
      const dateStr = formatDateLocal(date);
      onAddSession(dateStr);
    }
  };

  const calendarDays = getCalendarDays(currentMonth);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="w-full p-5">
      {/* Month Header */}
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold text-noir">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Mois précédent"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Mois suivant"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <div className="grid grid-cols-7">
          {/* Day Headers */}
          {["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."].map(
            (day) => (
              <div
                key={day}
                className="text-center text-md font-medium text-gray-600 py-2"
              >
                {day}
              </div>
            )
          )}

          {/* Calendar Days */}
          {calendarDays.map((dayObj, idx) => {
            const { date, isCurrentMonth } = dayObj;
            const sessionsForDay = getSessionsForDate(date);
            const dayNumber = date.getDate();

            return (
              <div
                key={idx}
                className={`group min-h-[250px] p-3 border-b border-r border-gray-200 flex flex-col relative ${
                  isCurrentMonth ? "bg-white" : "bg-gray-100"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`text-xl font-medium ${
                      isCurrentMonth ? "text-noir" : "text-gray-300"
                    }`}
                  >
                    {dayNumber}
                  </div>
                  <button
                    onClick={(e) => handleAddClick(date, e)}
                    className="opacity-0 group-hover:opacity-100 
                           w-8 h-8 bg-noir text-white rounded-md
                           flex items-center justify-center hover:bg-violet"
                    aria-label="Ajouter une session"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Sessions */}
                <div className="flex flex-col gap-1 mt-auto items-start">
                  {sessionsForDay.map((session) => {
                    const categoryName = getCategoryName(session);
                    const colorClass = getCategoryColor
                      ? getCategoryColor(categoryName)
                      : "bg-vert text-noir";

                    return (
                      <div
                        key={session.id}
                        onClick={(e) => handleSessionClick(session, e)}
                        className={`w-[75%] px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
                      >
                        {categoryName || "Session"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
