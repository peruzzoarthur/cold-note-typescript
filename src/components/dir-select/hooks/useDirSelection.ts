import type { SelectOption } from "@opentui/core";
import { useState } from "react";

export const useDirSelection = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [path, setPath] = useState<string | undefined>(undefined);
  const [currentOption, setCurrentOption] = useState<SelectOption | null>(null);

  return {
    options,
    setOptions,
    path,
    setPath,
    currentOption,
    setCurrentOption,
  };
};
