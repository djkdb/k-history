import { openDB, type IDBPDatabase } from "idb";
import type { StateStorage } from "zustand/middleware";

// zustand persist용 IndexedDB 어댑터 — 오프라인 PWA에서도 학습 기록 유지
const DB_NAME = "khlm";
const STORE_NAME = "state";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export const idbStorage: StateStorage = {
  async getItem(name: string): Promise<string | null> {
    if (typeof window === "undefined") return null;
    const db = await getDB();
    const value = await db.get(STORE_NAME, name);
    return value ?? null;
  },
  async setItem(name: string, value: string): Promise<void> {
    if (typeof window === "undefined") return;
    const db = await getDB();
    await db.put(STORE_NAME, value, name);
  },
  async removeItem(name: string): Promise<void> {
    if (typeof window === "undefined") return;
    const db = await getDB();
    await db.delete(STORE_NAME, name);
  },
};
