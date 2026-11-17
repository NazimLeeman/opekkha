export type ShareThemeId = "night-crimson" | "cream-paper" | "seal-gold";

export type ShareTheme = {
  id: ShareThemeId;
  labelBn: string;
  labelEn: string;
  /** CSS background for the on-screen preview */
  previewBg: string;
  ink: string;
  muted: string;
  brand: string;
  /** Canvas gradient stops */
  canvasStops: [string, string, string];
  glowA: string;
  glowB: string;
  seal: [string, string, string];
};

export const SHARE_THEMES: ShareTheme[] = [
  {
    id: "night-crimson",
    labelBn: "রাতের লাল",
    labelEn: "Night crimson",
    previewBg:
      "radial-gradient(circle_at_30%_18%,rgba(224,91,98,0.45),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(120,80,180,0.35),transparent_50%),linear-gradient(165deg,#0a0912,#15101f_55%,#1a1220)",
    ink: "#f3f0f7",
    muted: "#9a91ad",
    brand: "#f3f0f7",
    canvasStops: ["#0a0912", "#15101f", "#1a1220"],
    glowA: "rgba(224,91,98,0.45)",
    glowB: "rgba(120,80,180,0.32)",
    seal: ["#e07a7e", "#9a3d42", "#5a2428"],
  },
  {
    id: "cream-paper",
    labelBn: "ক্রিম কাগজ",
    labelEn: "Cream paper",
    previewBg:
      "linear-gradient(165deg,#f7f0e6 0%,#ebe0d2 55%,#e0d2c0 100%)",
    ink: "#2a2118",
    muted: "#7a6a5a",
    brand: "#5a2428",
    canvasStops: ["#f7f0e6", "#ebe0d2", "#e0d2c0"],
    glowA: "rgba(224,91,98,0.12)",
    glowB: "rgba(90,36,40,0.08)",
    seal: ["#e07a7e", "#9a3d42", "#5a2428"],
  },
  {
    id: "seal-gold",
    labelBn: "সীলমোহর সোনা",
    labelEn: "Seal gold",
    previewBg:
      "radial-gradient(circle_at_40%_20%,rgba(232,184,109,0.35),transparent_45%),linear-gradient(165deg,#120e0a,#1c1510_50%,#241810)",
    ink: "#f7f0e6",
    muted: "#c4a882",
    brand: "#e8b86d",
    canvasStops: ["#120e0a", "#1c1510", "#241810"],
    glowA: "rgba(232,184,109,0.4)",
    glowB: "rgba(224,91,98,0.22)",
    seal: ["#f0c87a", "#b8863a", "#6b4a18"],
  },
];

export function getShareTheme(id: string | undefined): ShareTheme {
  return SHARE_THEMES.find((t) => t.id === id) ?? SHARE_THEMES[0];
}
