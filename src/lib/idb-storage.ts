import { openDB, type IDBPDatabase } from "idb";
import type { StateStorage } from "zustand/middleware";

/**
 * zustand persist용 저장소 어댑터.
 *
 * 학습 기록은 전부 사용자 기기에만 있다. 서버에 사본이 없으므로
 * 여기서 한 번 잃으면 되찾을 방법이 없다. 그래서 두 곳에 겹쳐 쓴다.
 *
 *   1) IndexedDB — 본 저장소. 용량이 넉넉하다.
 *   2) localStorage — 거울. IndexedDB가 비었거나 열리지 않을 때 되살린다.
 *
 * 두 곳 다 같은 오리진에 묶여 있어 브라우저가 사이트 데이터를 통째로
 * 지우면 함께 사라진다. 그건 막을 수 없으므로 백업 내보내기(/backup)를
 * 따로 둔다. 다만 IndexedDB만 깨지거나 비워지는 흔한 사고는 이 거울로 막힌다.
 *
 * ⚠️ DB_NAME · STORE_NAME · MIRROR_PREFIX 를 바꾸면 기존 사용자의 기록을
 *    찾지 못한다. 절대 바꾸지 말 것. scripts/audit-storage.ts 가 감시한다.
 */
const DB_NAME = "khlm";
const STORE_NAME = "state";
const MIRROR_PREFIX = "khlm:mirror:";

let dbPromise: Promise<IDBPDatabase> | null = null;
/** IndexedDB를 아예 못 쓰는 환경(사파리 시크릿 등)인지 */
let idbBroken = false;

function getDB(): Promise<IDBPDatabase> | null {
  if (idbBroken) return null;
  if (!dbPromise) {
    try {
      dbPromise = openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      }).catch((e) => {
        idbBroken = true;
        throw e;
      });
    } catch {
      idbBroken = true;
      return null;
    }
  }
  return dbPromise;
}

function readMirror(name: string): string | null {
  try {
    return localStorage.getItem(MIRROR_PREFIX + name);
  } catch {
    return null;
  }
}

function writeMirror(name: string, value: string): void {
  try {
    localStorage.setItem(MIRROR_PREFIX + name, value);
  } catch {
    // 용량 초과·차단은 무시한다. 거울이 없어도 본 저장소는 살아 있다.
  }
}

export const idbStorage: StateStorage = {
  async getItem(name: string): Promise<string | null> {
    if (typeof window === "undefined") return null;

    let value: string | null = null;
    try {
      const db = await getDB();
      if (db) value = (await db.get(STORE_NAME, name)) ?? null;
    } catch {
      // IndexedDB를 못 읽어도 아래 거울에서 되살린다
    }

    if (value != null) {
      writeMirror(name, value); // 읽을 때마다 거울을 최신으로
      return value;
    }

    // 본 저장소가 비었다 — 거울이 있으면 그것으로 되살리고 다시 심는다
    const mirrored = readMirror(name);
    if (mirrored != null) {
      try {
        const db = await getDB();
        if (db) await db.put(STORE_NAME, mirrored, name);
      } catch {
        // 되심기에 실패해도 이번 세션은 거울 값으로 동작한다
      }
      return mirrored;
    }
    return null;
  },

  async setItem(name: string, value: string): Promise<void> {
    if (typeof window === "undefined") return;
    // 거울을 먼저 쓴다. IndexedDB 쓰기가 실패해도 기록이 남도록.
    writeMirror(name, value);
    try {
      const db = await getDB();
      if (db) await db.put(STORE_NAME, value, name);
    } catch {
      // 본 저장소 쓰기 실패 — 거울에는 남아 있다
    }
  },

  async removeItem(name: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(MIRROR_PREFIX + name);
    } catch {
      /* 무시 */
    }
    try {
      const db = await getDB();
      if (db) await db.delete(STORE_NAME, name);
    } catch {
      /* 무시 */
    }
  },
};
