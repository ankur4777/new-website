export const palettes = [
  { id: "violet", name: "After Hours", family: "Violet + mint", mood: "Creative · calm · luminous", primary: "#bea5ff", secondary: "#a1e9dd", background: "#0b0c10", surface: "#111218", raised: "#17181f" },
  { id: "cobalt", name: "Blue Current", family: "Cobalt + ice", mood: "Precise · electric · modern", primary: "#79b8ff", secondary: "#84eff8", background: "#080d18", surface: "#0d1626", raised: "#152036" },
  { id: "emerald", name: "Wild Signal", family: "Emerald + lime", mood: "Fresh · bold · unexpected", primary: "#8bf0bf", secondary: "#d9f58c", background: "#07110e", surface: "#0e1b15", raised: "#14271f" },
  { id: "coral", name: "Soft Voltage", family: "Coral + apricot", mood: "Warm · expressive · human", primary: "#ffad92", secondary: "#ffd78d", background: "#140e0e", surface: "#1e1716", raised: "#2b211f" },
  { id: "amber", name: "Golden Hour", family: "Amber + periwinkle", mood: "Considered · refined · warm", primary: "#f5d488", secondary: "#c4c5fb", background: "#11100c", surface: "#1a1812", raised: "#25221a" },
  { id: "rose", name: "Pink Frequency", family: "Rose + lilac", mood: "Playful · confident · vivid", primary: "#f5a7cf", secondary: "#b6afff", background: "#130c14", surface: "#1e1420", raised: "#2a1c2d" },
] as const;

export type PaletteId = (typeof palettes)[number]["id"];
export const defaultPalette: PaletteId = "violet";

export function applyPalette(id: string) {
  const palette = palettes.find((p) => p.id === id) || palettes.find((p) => p.id === defaultPalette)!;
  const root = document.documentElement;
  for (const [key, value] of Object.entries({
    "--bg": palette.background,
    "--surface": palette.surface,
    "--surface-2": palette.raised,
    "--accent": palette.primary,
    "--mint": palette.secondary,
  })) root.style.setProperty(key, value);
  root.dataset.palette = palette.id;
  return palette;
}
