import { useState } from "react";
import { ConfigRepository } from "../../../database/repositories/Config";

export const useVaultConfig = () => {
  const [configRepo] = useState(() => new ConfigRepository());

  const config = configRepo.find();
  const vaultRoot = config?.obsidian_vault?.replace(/^~/, process.env.HOME || "");

  return { config, vaultRoot };
};
