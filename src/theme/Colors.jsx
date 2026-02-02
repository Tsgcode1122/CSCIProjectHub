// ETSU official colors + basic colors
export const Colors = {
  etsuBlue: "#041E42", // ETSU Blue
  blue: "#003f87",
  etsuGold: "#FFB81C", // ETSU Gold
  white: "#FFFFFF",
  black: "#000000",
  lightBlack: "rgba(0, 0, 0, 0.677)",
  darkGray: "#333333",
  lightGray: "#F5F5F5",
  softBlue: "#f3f7fb7d",
  brightBlue: "#003F87",
};

// Shadows
export const Shadows = {
  light: "0 2px 4px rgba(0,0,0,0.1)",
  medium: "0 4px 8px rgba(0,0,0,0.15)",
  heavy: "0 8px 16px rgba(0,0,0,0.2)",
};

// Gradients
export const Gradients = {
  blueToGold: `linear-gradient(135deg, ${Colors.etsuBlue} 0%, ${Colors.etsuGold} 100%)`,
  goldToBlue: `linear-gradient(135deg, ${Colors.etsuGold} 0%, ${Colors.etsuBlue} 100%)`,
  darkGrayToBlack: `linear-gradient(135deg, ${Colors.darkGray} 0%, ${Colors.black} 100%)`,
  softBlueToWhite: `linear-gradient(135deg, ${Colors.softBlue} 0%, ${Colors.white} 100%)`,
};
