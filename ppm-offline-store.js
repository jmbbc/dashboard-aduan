(function (global) {
    'use strict';

    const DB_NAME = 'ppmOfflineDatabase';
    const DB_VERSION = 1;
    const DRAFT_STORE = 'drafts';
    const OUTBOX_STORE = 'outbox';

    function openDatabase() {
        return new Promise((resolve, reject) => {
            if (!global.indexedDB) {
                reject(new Error('IndexedDB is not available in this browser.'));
                return;
            }

            const request = global.indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const database = request.result;
                if (!database.objectStoreNames.contains(DRAFT_STORE)) {
                    database.createObjectStore(DRAFT_STORE, { keyPath: 'id' });
                }
                if (!database.objectStoreNames.contains(OUTBOX_STORE)) {
                    database.createObjectStore(OUTBOX_STORE, { keyPath: 'id' });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error('Unable to open offline storage.'));
        });
    }

    async function runTransaction(storeName, mode, operation) {
        const database = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, mode);
            const store = transaction.objectStore(storeName);
            let request;

            try {
                request = operation(store);
            } catch (error) {
                database.close();
                reject(error);
                return;
            }

            transaction.oncomplete = () => {
                const result = request && 'result' in request ? request.result : undefined;
                database.close();
                resolve(result);
            };
            transaction.onerror = () => {
                const error = transaction.error || new Error('Offline storage transaction failed.');
                database.close();
                reject(error);
            };
            transaction.onabort = () => {
                const error = transaction.error || new Error('Offline storage transaction was aborted.');
                database.close();
                reject(error);
            };
        });
    }

    const api = {
        isSupported() {
            return Boolean(global.indexedDB);
        },
        putDraft(record) {
            return runTransaction(DRAFT_STORE, 'readwrite', (store) => store.put(record));
        },
        getDraft(id) {
            return runTransaction(DRAFT_STORE, 'readonly', (store) => store.get(id));
        },
        getAllDrafts() {
            return runTransaction(DRAFT_STORE, 'readonly', (store) => store.getAll());
        },
        deleteDraft(id) {
            return runTransaction(DRAFT_STORE, 'readwrite', (store) => store.delete(id));
        },
        putOutbox(record) {
            return runTransaction(OUTBOX_STORE, 'readwrite', (store) => store.put(record));
        },
        getOutbox(id) {
            return runTransaction(OUTBOX_STORE, 'readonly', (store) => store.get(id));
        },
        getAllOutbox() {
            return runTransaction(OUTBOX_STORE, 'readonly', (store) => store.getAll());
        },
        deleteOutbox(id) {
            return runTransaction(OUTBOX_STORE, 'readwrite', (store) => store.delete(id));
        }
    };

    global.PPMOfflineStore = api;
})(window);
