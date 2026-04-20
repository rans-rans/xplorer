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

function createSearchModeStore() {
    const MAX_RENDERED_SEARCH_RESULTS = 100;
    const { subscribe, set, update } = writable({
        isSearchMode: false,
        searchQuery: "",
        searchResults: <RouteItem[]>[],
        isSearching: false,
        searchRequestId: 0,
        maxRenderedResults: MAX_RENDERED_SEARCH_RESULTS,
    });

    // Auto-reset search mode when path changes
    currentPath.subscribe(() => {
        set({
            isSearchMode: false,
            searchQuery: "",
            searchResults: [],
            isSearching: false,
            searchRequestId: 0,
            maxRenderedResults: MAX_RENDERED_SEARCH_RESULTS,
        });
    });

    return {
        subscribe,
        toggleSearchMode: () => {
            update((state) => ({
                ...state,
                isSearchMode: !state.isSearchMode,
                searchQuery: !state.isSearchMode ? "" : state.searchQuery,
                searchResults: !state.isSearchMode ? [] : state.searchResults,
                isSearching: !state.isSearchMode ? false : state.isSearching,
                searchRequestId: state.searchRequestId + 1,
            }));
        },
        setSearchQuery: (query: string) => {
            update((state) => ({
                ...state,
                searchQuery: query,
            }));
        },
        setSearchResults: (results: RouteItem[]) => {
            update((state) => ({
                ...state,
                searchResults: results,
            }));
        },
        setIsSearching: (isSearching: boolean) => {
            update((state) => ({
                ...state,
                isSearching: isSearching,
            }));
        },
        incrementSearchRequestId: () => {
            update((state) => ({
                ...state,
                searchRequestId: state.searchRequestId + 1,
            }));
        },
        reset: () => {
            set({
                isSearchMode: false,
                searchQuery: "",
                searchResults: [],
                isSearching: false,
                searchRequestId: 0,
                maxRenderedResults: MAX_RENDERED_SEARCH_RESULTS,
            });
        },
    };
}

export const searchMode = createSearchModeStore();
