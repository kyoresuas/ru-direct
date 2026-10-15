import { IpFamily } from "@/types/shared";

/**
 * Параметры сборки уровней
 */
export const BuildContract = {
  // Самая широкая подсеть ноды CDN, которая попадает в список вместо точного адреса
  CDN_NODE_PREFIX: {
    [IpFamily.V4]: 24,
    [IpFamily.V6]: 48,
  },
} as const;
