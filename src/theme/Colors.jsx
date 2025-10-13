// ETSU official colors + basic colors
export const Colors = {
  etsuBlue: "#041E42", // ETSU Blue
  etsuGold: "#FFB81C", // ETSU Gold
  white: "#FFFFFF",
  black: "#000000",
  darkGray: "#333333",
  lightGray: "#F5F5F5",
  softBlue: "#edf4fa",
};

// Shadows for cards, modals, etc.
export const Shadows = {
  light: "0 2px 4px rgba(0,0,0,0.1)",
  medium: "0 4px 8px rgba(0,0,0,0.15)",
  heavy: "0 8px 16px rgba(0,0,0,0.2)",
};

// Gradients for backgrounds or buttons
export const Gradients = {
  blueToGold: `linear-gradient(135deg, ${Colors.etsuBlue} 0%, ${Colors.etsuGold} 100%)`,
  goldToBlue: `linear-gradient(135deg, ${Colors.etsuGold} 0%, ${Colors.etsuBlue} 100%)`,
  darkGrayToBlack: `linear-gradient(135deg, ${Colors.darkGray} 0%, ${Colors.black} 100%)`,
  softBlueToWhite: `linear-gradient(135deg, ${Colors.softBlue} 0%, ${Colors.white} 100%)`,
};
