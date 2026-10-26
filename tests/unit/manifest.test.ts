import { TierId } from "@/types/shared";
import { it, expect, describe } from "vitest";
import { ManifestService } from "@/services/manifest";
import { FormatId, FormatGroup } from "@/types/formats";
import { IManifest, IManifestTier } from "@/types/manifest";
import { RepositoryContract } from "@/contracts/repository";

/**
 * Уровень манифеста для тестов
 */
const tier = (id: TierId, ipv4: number): IManifestTier => ({
  id,
  title: id,
  description: "",
  limit: null,
  ipv4,
  ipv6: 5,
  domains: 67,
  services: 1,
  categories: 1,
  diff: { added: 3, removed: 1, addedSample: [], removedSample: [] },
  files: [
    {
      name: `${id}.amnezia.json`,
      format: FormatId.AMNEZIA,
      group: FormatGroup.AMNEZIA,
      size: 1,
      sha256: "0",
    },
    {
      name: `${id}.ipv4.txt`,
      format: FormatId.IPV4,
      group: FormatGroup.TEXT,
      size: 1,
      sha256: "0",
    },
  ],
});

/**
 * Манифест для тестов
 */
const manifest: IManifest = {
  schema: 1,
  generatedAt: "2026-10-26T03:00:00.000Z",
  repository: RepositoryContract.URL,
  tiers: {
    "ru-lite": tier("ru-lite", 354),
    "ru-standard": tier("ru-standard", 616),
    "ru-full": tier("ru-full", 8679),
  },
  shared: [],
  formats: [],
  guard: { subtracted4: 0, subtracted6: 0 },
};

describe("заметки к релизу", () => {
  const notes = new ManifestService().renderReleaseNotes(manifest);

  it("таблица содержит строку на каждый уровень", () => {
    for (const id of ["ru-lite", "ru-standard", "ru-full"]) {
      expect(notes).toMatch(new RegExp(`^\\| ${id} \\|.*\\+3 / -1 \\|$`, "m"));
    }
  });

  it("ссылки на файлы AmneziaVPN ведут в последний релиз", () => {
    for (const id of ["ru-lite", "ru-standard", "ru-full"]) {
      const file = `${id}.amnezia.json`;

      expect(notes).toContain(`[${file}](${RepositoryContract.releaseUrl(file)})`);
    }

    expect(notes).not.toContain("ipv4.txt");
  });

  it("есть ссылки на сайт и проверку адреса", () => {
    expect(notes).toContain(RepositoryContract.SITE_URL);
    expect(notes).toContain(`${RepositoryContract.SITE_URL}#check`);
  });
});
