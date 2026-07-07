export const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (!date) return "";

  const months = [
    "Janv.",
    "Févr.",
    "Mars",
    "Avr.",
    "Mai",
    "Juin",
    "Juill.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  return day + " " + month;
};
export const colorsList = [
  "#a8193d",
  "#4fcc25",
  "#9975bd",
  "#cf61a1",
];
