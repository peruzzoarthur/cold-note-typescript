export const LAYOUT = {
  // Screen breakpoints
  BREAKPOINTS: {
    NARROW: 80,
    WIDE: 120,
  },

  // Component dimensions
  DIMENSIONS: {
    INPUT_WIDTH: 40,
    INPUT_HEIGHT: 3,
    SELECT_WIDTH: 60,
    SELECT_HEIGHT: 10,
    MODAL_WIDTH: 50,
    MODAL_HEIGHT: 7,
    FOOTER_HEIGHT: 3,
    NARROW_SCREEN_WIDTH: 60,
    NARROW_SCREEN_HEIGHT: 15,
    CREATE_NOTE_PREVIEW_WIDTH: 60,
    CREATE_NOTE_PREVIEW_HEIGHT: 10,
    CREATE_BUTTON_WIDTH: 24,
    BUTTON_WIDTH: 15,
    BUTTON_WIDTH_SMALL: 20,
    TAB_SELECT_WIDTH_WIDE: 120,
    TAB_SELECT_WIDTH_NARROW: 80,
    TAB_SELECT_HEIGHT: 1,
    FIRST_ROW_WIDTH: 62,
  },

  // Spacing
  SPACING: {
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 4,
  },

  // Z-index layers
  Z_INDEX: {
    BACKDROP: 999,
    MODAL: 1000,
    MENU: 1001,
    DEBUG: 100,
  },

  // Layout min heights
  MIN_HEIGHT: {
    FIRST_ROW: 5,
  },

  // Modal dimensions (percentages)
  MODAL: {
    CONFIG_WIDTH: "50%",
    CONFIG_HEIGHT: "50%",
    CONFIG_TOP: "25%",
    CONFIG_LEFT: "25%",
    CREATE_DIR_WIDTH: "40%",
    CREATE_DIR_HEIGHT: "20%",
    CREATE_DIR_TOP: "40%",
    CREATE_DIR_LEFT: "30%",
    DELETE_DIR_WIDTH: "50%",
    DELETE_DIR_HEIGHT: "25%",
    DELETE_DIR_TOP: "40%",
    DELETE_DIR_LEFT: "25%",
    RENAME_DIR_WIDTH: "40%",
    RENAME_DIR_HEIGHT: "20%",
    RENAME_DIR_TOP: "40%",
    RENAME_DIR_LEFT: "30%",
    NOTE_EXISTS_WIDTH: "50%",
    NOTE_EXISTS_HEIGHT: "30%",
    NOTE_EXISTS_TOP: "35%",
    NOTE_EXISTS_LEFT: "25%",
    DEBUG_WIDTH: "80%",
    DEBUG_HEIGHT: "80%",
    DEBUG_TOP: "10%",
    DEBUG_LEFT: "10%",
  },
} as const;
