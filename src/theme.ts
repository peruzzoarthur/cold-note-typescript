// Vague theme — https://github.com/vague-theme/vague.nvim
export const theme = {
  // Backgrounds
  bg: "#141415",
  inactiveBg: "#1c1c24",
  line: "#252530",
  visual: "#333738",

  // Text
  fg: "#cdcdcd",
  comment: "#606079",

  // Borders
  border: "#878787",

  // Semantic accents
  accent: "#bb9dbd",   // keyword — selected / active state
  success: "#7fa563",  // plus — confirm / positive action
  error: "#d8647e",    // error — cancel / destructive action
  muted: "#606079",    // comment — neutral / unfocused button
  info: "#7e98e8",     // hint — scrollbar track

  // Debug panel scrollbox layers (graduated from inactiveBg → bg)
  scrollRoot: "#1c1c24",
  scrollWrapper: "#191920",
  scrollViewport: "#161618",
  scrollContent: "#141415",
  scrollbarTrack: "#7e98e8",
  scrollbarBg: "#252530",

  // Alternating log rows
  logEven: "#1e1e26",
  logOdd: "#1c1c24",
} as const;
