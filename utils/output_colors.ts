import officialColorDefs from './output_colors.json';

// Catppuccin Macchiato colors
const catppuccin_macchiato = officialColorDefs.macchiato.colors;

// Export all macchiato colors
export const macchiato = Object.fromEntries(
  Object.entries(catppuccin_macchiato).map(([key, value]) => [key, value.hex]),
) as Record<keyof typeof catppuccin_macchiato, string>;
