import type { SelectOption, SelectRenderable } from "@opentui/core";
import { useEffect, useRef } from "react";

type UseSelectSyncProps = {
  options: SelectOption[];
  selectedPath?: string | null;
};

export const useSelectSync = ({ options, selectedPath }: UseSelectSyncProps) => {
  const selectRef = useRef<SelectRenderable | null>(null);

  const selectedIndex = selectedPath
    ? options.findIndex((opt) => opt.value === selectedPath)
    : -1;

  useEffect(() => {
    if (selectRef.current && selectedIndex >= 0) {
      selectRef.current.setSelectedIndex(selectedIndex);
    }
  }, [selectedIndex]);

  return { selectRef };
};
