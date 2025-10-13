export const breakpoints = {
  mobileXS: "320px", // Extra small phones (e.g., iPhone 6)
  mobileS: "480px", // Small phones
  mobileM: "576px", // Medium phones
  mobileL: "679px", // Large phones
  tablet: "768px", // Tablets
  laptop: "1024px", // Small laptops
  laptopL: "1200px", // Large laptops
  desktop: "1440px", // Desktops
  desktopXL: "1920px", // Extra large screens (Full HD / 4K)
};

// media query helpers
export const media = {
  mobileXS: `(max-width: ${breakpoints.mobileXS})`,
  mobileS: `(max-width: ${breakpoints.mobileS})`,
  mobileM: `(max-width: ${breakpoints.mobileM})`,
  mobileL: `(max-width: ${breakpoints.mobileL})`,
  tablet: `(max-width: ${breakpoints.tablet})`,
  laptop: `(max-width: ${breakpoints.laptop})`,
  laptopL: `(max-width: ${breakpoints.laptopL})`,
  desktop: `(max-width: ${breakpoints.desktop})`,
  desktopXL: `(max-width: ${breakpoints.desktopXL})`,
};
