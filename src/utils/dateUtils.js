export const formatDateShort = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
};

export const formatDateLocal = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatTime = (timeString) => {
  if (!timeString) return "";
  const time = timeString.split(":");
  return `${time[0]}h${time[1]}`;
};

export const formatMonthYear = (date) => {
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
};
