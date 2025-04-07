import { MD3LightTheme as DefaultTheme } from "react-native-paper";

const colors = {
  primary: "#3498db",
  secondary: "#f1c40f",
  error: "#c70000",
  background: "#f5f5f5",
  surface: "#ffffff",
  text: "#333333",
  placeholder: "#9e9e9e",
  disabled: "#e0e0e0",
  success: "#4caf50",
  info: "#2196f3",
  warning: "#ff9800",
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    placeholder: colors.placeholder,
    disabled: colors.disabled,
  },
};

export const appColors = {
  ...colors,
  card: {
    background: colors.surface,
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  statusBar: {
    background: colors.primary,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.placeholder,
  },
};
