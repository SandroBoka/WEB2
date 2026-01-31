import { openDB } from "idb";

const DB_NAME = "songsniffer-db";
const DB_VERSION = 1;
const STORE = "recordings";

export async function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: "id" });
                store.createIndex("status", "status");
                store.createIndex("createdAt", "createdAt");
            }
        },
    });
}

export async function addRecording({ blob, source}) {
    const db = await getDB();
    const item = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        source,
        status: "pending",
        mimeType: blob.type,
        blob,
        result: null,
        error: null
    };
    
    await db.put(STORE, item);
    
    return item;
}

export async function listRecordings() {
    const db = await getDB();

    return db.getAll(STORE);
}

export async function listPending() {
    const db = await getDB();
    
    return db.getAllFromIndex(STORE, "status", "pending");
}

export async function deleteRecording(id) {
    const db = await getDB();
    await db.delete(STORE, id);
}

export async function updateRecording(id, patch) {
    const db = await getDB();
    const current = await db.get(STORE, id);

    if (!current) return null;

    const next = {...current, ...patch};
    await db.put(STORE, next);

    return next;
}