import { get, writable } from "svelte/store";
import { readFolderItems } from "./file_folder_operations";

export const currentPath = writable("");

function createCurrentPathEntriesStore() {
    const { subscribe, set } = writable(<RouteItem[]>[]);
    let requestId = 0;

    async function loadEntries(path: string) {
        const activeRequestId = ++requestId;

        if (!path) {
            set([]);
            return;
        }

        try {
            const newEntries = await readFolderItems(path);
            if (activeRequestId === requestId) {
                set(newEntries);
            }
        } catch {
            if (activeRequestId === requestId) {
                set([]);
            }
        }
    }

    currentPath.subscribe((path) => {
        void loadEntries(path);
    });

    return {
        subscribe,
        refresh: async () => {
            await loadEntries(get(currentPath));
        },
    };
}

export const currentPathEntries = createCurrentPathEntriesStore();
export const refreshCurrentPathEntries = currentPathEntries.refresh;
