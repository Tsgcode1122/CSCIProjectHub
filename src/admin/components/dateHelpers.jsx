// src/utils/dateHelpers.js

export const MONTH_NAMES = [
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

/**
 * Converts "2020-05" -> "May 2020"
 * Useful for sending pretty strings to MongoDB
 */
export const formatToMonthYear = (dateStr) => {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [year, month] = dateStr.split("-");
  const monthIndex = parseInt(month, 10) - 1;
  return `${MONTH_NAMES[monthIndex]} ${year}`;
};

/**
 * Converts "May 2020" -> "2020-05"
 * Useful for making <input type="month"> show the correct value
 */
export const parseToMonthInput = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.includes(" "))
    return dateStr;
  const [monthName, year] = dateStr.split(" ");
  const monthIndex = MONTH_NAMES.indexOf(monthName) + 1;
  if (monthIndex === 0) return "";
  return `${year}-${monthIndex.toString().padStart(2, "0")}`;
};
