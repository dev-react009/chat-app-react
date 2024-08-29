export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isThisWeek =
    date >= new Date(now.setDate(now.getDate() - now.getDay())) && 
    date <= new Date(now.setDate(now.getDate() - now.getDay() + 6));

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (isThisWeek) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};