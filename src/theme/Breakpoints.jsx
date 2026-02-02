export const breakpoints = {
  mobileXS: "320px", // Extra small phones
  mobileS: "480px", // Small phones
  mobileM: "576px", // Medium phones
  mobileL: "679px", // Large phones
  tablet: "768px", // Tablets
  laptop: "1024px", // Small laptops
  laptopL: "1200px", // Large laptops
  desktop: "1440px", // Desktops
  desktopXL: "1920px", // Extra large screens
};

// media query
export const media = {
  mobileXS: `(max-width: ${breakpoints.mobileXS})`,
  mobileS: `(min-width: 321px) and (max-width: ${breakpoints.mobileS})`,
  mobileM: `(min-width: ${breakpoints.mobileM})`,
  mobileL: `(min-width: ${breakpoints.mobileL})`,
  tablet: `(min-width: ${breakpoints.tablet})`,
  laptop: `(min-width: ${breakpoints.laptop})`,
  laptopL: `(min-width: ${breakpoints.laptopL})`,
  desktop: `(min-width: ${breakpoints.desktop})`,
  desktopXL: `(min-width: ${breakpoints.desktopXL})`,
};
