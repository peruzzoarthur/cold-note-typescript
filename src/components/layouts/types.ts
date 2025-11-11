import type { TabSelectObject } from "../../types";

export interface LayoutProps {
  isConfigMenuOpen: boolean;
  isDebugMenuOpen: boolean;
  isAnyModalOpen: boolean;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
  isNameTabActive: () => boolean;
  isDirsTabActive: () => boolean;
  isTemplateTabActive: () => boolean;
  isTagsTabActive: () => boolean;
  isAliasesTabActive: () => boolean;
  isCreateTabActive: () => boolean;
}