import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import {
  getDB,
  resetDBCache,
  getAllSutras,
  getSutra,
  updateSutraProgress,
  saveSutra,
  deleteSutra,
  getSettings,
  saveSettings,
  type Sutra,
} from "./db";

beforeEach(() => {
  resetDBCache();
  indexedDB = new IDBFactory();
});

describe("IndexedDB initialization", () => {
  it("creates sutra-progress database with sutras and settings stores", async () => {
    const db = await getDB();
    expect(db.name).toBe("sutra-progress");
    expect(db.version).toBe(1);
    expect(db.objectStoreNames.contains("sutras")).toBe(true);
    expect(db.objectStoreNames.contains("settings")).toBe(true);
    db.close();
  });
});

describe("Seed default sutras", () => {
  it("seeds 6 default sutras on first open", async () => {
    const sutras = await getAllSutras();
    expect(sutras).toHaveLength(6);
  });

  it("seeds correct data for all 6 sutras", async () => {
    const sutras = await getAllSutras();
    const expected: Array<{ sortOrder: number; name: string; targetCount: number; icon: string }> = [
      { sortOrder: 1, name: "慈悲三昧水懺", targetCount: 3, icon: "icons/sutra-01.png" },
      { sortOrder: 2, name: "大方廣佛華嚴經普賢行願品", targetCount: 7, icon: "icons/sutra-02.png" },
      { sortOrder: 3, name: "藥師琉璃光如來本願功德經", targetCount: 7, icon: "icons/sutra-03.png" },
      { sortOrder: 4, name: "金剛般若波羅蜜經", targetCount: 7, icon: "icons/sutra-04.png" },
      { sortOrder: 5, name: "佛說阿彌陀經", targetCount: 10, icon: "icons/sutra-05.png" },
      { sortOrder: 6, name: "寶篋印陀羅尼經", targetCount: 21, icon: "icons/sutra-06.png" },
    ];

    for (let i = 0; i < expected.length; i++) {
      const sutra = sutras[i]!;
      const exp = expected[i]!;
      expect(sutra.sortOrder).toBe(exp.sortOrder);
      expect(sutra.name).toBe(exp.name);
      expect(sutra.targetCount).toBe(exp.targetCount);
      expect(sutra.icon).toBe(exp.icon);
      expect(sutra.completedCount).toBe(0);
      expect(sutra.id).toBeTruthy();
    }
  });

  it("returns sutras sorted by sortOrder ascending", async () => {
    const sutras = await getAllSutras();
    for (let i = 1; i < sutras.length; i++) {
      expect(sutras[i]!.sortOrder).toBeGreaterThan(sutras[i - 1]!.sortOrder);
    }
  });

  it("does not re-seed on subsequent opens", async () => {
    await getAllSutras();
    resetDBCache();
    const sutras = await getAllSutras();
    expect(sutras).toHaveLength(6);
  });
});

describe("CRUD operations", () => {
  it("getSutra returns a single sutra by id", async () => {
    const all = await getAllSutras();
    const first = all[0]!;
    const found = await getSutra(first.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe(first.name);
  });

  it("getSutra returns undefined for non-existent id", async () => {
    await getAllSutras();
    const found = await getSutra("non-existent-id");
    expect(found).toBeUndefined();
  });

  it("updateSutraProgress increments completedCount", async () => {
    const all = await getAllSutras();
    const sutra = all[0]!;
    await updateSutraProgress(sutra.id, 1);
    const updated = await getSutra(sutra.id);
    expect(updated!.completedCount).toBe(1);
  });

  it("updateSutraProgress clamps at targetCount", async () => {
    const all = await getAllSutras();
    const sutra = all[0]!; // targetCount = 3
    await updateSutraProgress(sutra.id, 10);
    const updated = await getSutra(sutra.id);
    expect(updated!.completedCount).toBe(3);
  });

  it("updateSutraProgress clamps at 0", async () => {
    const all = await getAllSutras();
    const sutra = all[0]!;
    await updateSutraProgress(sutra.id, -5);
    const updated = await getSutra(sutra.id);
    expect(updated!.completedCount).toBe(0);
  });

  it("saveSutra creates a new sutra", async () => {
    const newSutra: Sutra = {
      id: crypto.randomUUID(),
      name: "心經",
      icon: "icons/sutra-07.png",
      targetCount: 5,
      completedCount: 0,
      sortOrder: 7,
    };
    await saveSutra(newSutra);
    const all = await getAllSutras();
    expect(all).toHaveLength(7);
    expect(all[6]!.name).toBe("心經");
  });

  it("saveSutra updates an existing sutra", async () => {
    const all = await getAllSutras();
    const sutra = { ...all[0]!, name: "更新後的名稱" };
    await saveSutra(sutra);
    const updated = await getSutra(sutra.id);
    expect(updated!.name).toBe("更新後的名稱");
  });

  it("deleteSutra removes a sutra", async () => {
    const all = await getAllSutras();
    await deleteSutra(all[0]!.id);
    const remaining = await getAllSutras();
    expect(remaining).toHaveLength(5);
  });
});

describe("Settings persistence", () => {
  it("getSettings returns default empty userName", async () => {
    const settings = await getSettings();
    expect(settings.userName).toBe("");
  });

  it("saveSettings persists userName", async () => {
    await saveSettings("測試使用者");
    const settings = await getSettings();
    expect(settings.userName).toBe("測試使用者");
  });
});
