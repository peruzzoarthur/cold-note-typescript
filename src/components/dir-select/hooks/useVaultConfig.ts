import { useState } from "react";
import { ConfigRepository } from "../../../database/repositories/Config";
import { expandVaultPath } from "../../../utils";

export const useVaultConfig = () => {
  const [configRepo] = useState(() => new ConfigRepository());

  const config = configRepo.find();
  const vaultRoot = config?.obsidian_vault
    ? expandVaultPath(config.obsidian_vault)
    : undefined;

  return { config, vaultRoot };
};
