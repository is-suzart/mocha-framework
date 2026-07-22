// Santander brand theme — basta trocar a seed pra outra marca
import { ThemeData } from "@mocha/tokens";

export const santanderDark = ThemeData.brand("#ee0000", true, {
  typography: {
    family: "Inter",
  },
  colorScheme: {
    onBackground: "#ffffff",
    onSurface: "#ffffff",
    onSurfaceVariant: "#cccccc",
    background: "#1a1414",
    surface: "#2e2222",
  },
});

export const santanderLight = ThemeData.brand("#ee0000", false, {
  typography: { family: "Inter" },
  colorScheme: {
    background: "#fafaf5",
    surface: "#f5f5ee",
    surfaceVariant: "#ebebe0",
    onSurface: "#1a1a1a",
    onBackground: "#1a1a1a",
    onSurfaceVariant: "#555555",
    outline: "#d4d4c8",
    outlineVariant: "#e8e8dc",
  },
});
