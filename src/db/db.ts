const DB_NAME = "sutra-progress";
const DB_VERSION = 1;

export interface Sutra {
  id: string;
  name: string;
  icon: string;
  targetCount: number;
  completedCount: number;
  sortOrder: number;
}

export interface Settings {
  key: "singleton";
  userName: string;
}

const DEFAULT_SUTRAS: Array<Omit<Sutra, "id">> = [
  { name: "慈悲三昧水懺", icon: "icons/sutra-01.png", targetCount: 3, completedCount: 0, sortOrder: 1 },
  { name: "大方廣佛華嚴經普賢行願品", icon: "icons/sutra-02.png", targetCount: 7, completedCount: 0, sortOrder: 2 },
  { name: "藥師琉璃光如來本願功德經", icon: "icons/sutra-03.png", targetCount: 7, completedCount: 0, sortOrder: 3 },
  { name: "金剛般若波羅蜜經", icon: "icons/sutra-04.png", targetCount: 7, completedCount: 0, sortOrder: 4 },
  { name: "佛說阿彌陀經", icon: "icons/sutra-05.png", targetCount: 10, completedCount: 0, sortOrder: 5 },
  { name: "寶篋印陀羅尼經", icon: "icons/sutra-06.png", targetCount: 21, completedCount: 0, sortOrder: 6 },
];

let _db: IDBDatabase | null = null;

export async function getDB(): Promise<IDBDatabase> {
  if (_db) return _db;
  _db = await openDB();
  await seedIfNeeded(_db);
  return _db;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("sutras")) {
        db.createObjectStore("sutras", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function seedIfNeeded(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["sutras", "settings"], "readwrite");
    const sutrasStore = tx.objectStore("sutras");
    const settingsStore = tx.objectStore("settings");

    const check = settingsStore.get("singleton");
    check.onsuccess = () => {
      if (!check.result) {
        settingsStore.put({ key: "singleton", userName: "" } as Settings);
        for (const s of DEFAULT_SUTRAS) {
          sutrasStore.put({ ...s, id: crypto.randomUUID() } as Sutra);
        }
      }
    };
    check.onerror = () => reject(check.error);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllSutras(): Promise<Sutra[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("sutras", "readonly");
    const req = tx.objectStore("sutras").getAll();
    req.onsuccess = () => {
      const sutras = (req.result as Sutra[]).sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      resolve(sutras);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getSutra(id: string): Promise<Sutra | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("sutras", "readonly");
    const req = tx.objectStore("sutras").get(id);
    req.onsuccess = () => resolve(req.result as Sutra | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function updateSutraProgress(id: string, delta: number): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("sutras", "readwrite");
    const store = tx.objectStore("sutras");
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const sutra = getReq.result as Sutra | undefined;
      if (sutra) {
        sutra.completedCount = Math.max(0, Math.min(sutra.targetCount, sutra.completedCount + delta));
        store.put(sutra);
      }
    };
    getReq.onerror = () => reject(getReq.error);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveSutra(sutra: Sutra): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("sutras", "readwrite");
    tx.objectStore("sutras").put(sutra);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteSutra(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("sutras", "readwrite");
    tx.objectStore("sutras").delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getSettings(): Promise<Settings> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("settings", "readonly");
    const req = tx.objectStore("settings").get("singleton");
    req.onsuccess = () => resolve(req.result as Settings);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSettings(userName: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("settings", "readwrite");
    tx.objectStore("settings").put({ key: "singleton", userName } as Settings);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function resetDBCache(): void {
  _db = null;
}
