import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "../../utils/dateUtils";

export default function FormationDetailCalendar({
  sessions,
  currentMonth,
  onMonthChange,
}) {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Ajuster pour que lundi soit le premier jour (0 = lundi)
    const adjustedStartingDay = (startingDayOfWeek + 6) % 7;

    const days = [];
    // Ajouter les jours vides du début
    for (let dayIndex = 0; dayIndex < adjustedStartingDay; dayIndex++) {
      days.push(null);
    }
    // Ajouter les jours du mois
    for (let dayIndex = 1; dayIndex <= daysInMonth; dayIndex++) {
      days.push(dayIndex);
    }
    return days;
  };

  const getSessionDates = () => {
    return sessions.map((session) => {
      const date = new Date(session.startDate);
      return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    });
  };

  const isDateInSessions = (day) => {
    if (!day) return false;
    const sessionDates = getSessionDates();
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();

    return sessionDates.some(
      (sessionDate) =>
        sessionDate.day === day &&
        sessionDate.month === currentMonthIndex &&
        sessionDate.year === currentYear
    );
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    onMonthChange(newDate);
  };

  const daysInMonth = getDaysInMonth(currentMonth);

  return (
    <div className="pr-24 px-3">
      <div className="bg-fond rounded-lg p-2 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-900 capitalize text-md">
            {formatMonthYear(currentMonth)}
          </h4>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>


        <div className="grid grid-cols-7 gap-0 mb-1">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="mt-4 text-center text-md font-medium text-gray-600 py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0">
          {daysInMonth.map((day, index) => {
            const hasSession = isDateInSessions(day);
            return (
              <div
                key={index}
                className={`h-12 w-12 flex items-center justify-center text-lg ${day
                  ? hasSession
                    ? "bg-red-500 text-white rounded-full font-semibold"
                    : "text-gray-600 hover:bg-violet hover:text-blanc rounded-full"
                  : ""
                  }`}
              >
                {day}
              </div>

            );
          })}
        </div>
      </div>
    </div>

  );
}


