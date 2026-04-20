<script lang="ts">
    import { homeDir } from "@tauri-apps/api/path";
    import { get } from "svelte/store";
    import FileItem from "./FileItem.svelte";
    import { onDestroy, onMount } from "svelte";
    import {
        currentPath,
        currentPathEntries,
        refreshCurrentPathEntries,
        searchMode,
    } from "../store";
    import {
        checkPageChange,
        navigateUp,
        searchForFileFolder,
    } from "../file_folder_operations";
    import { watch, type UnwatchFn } from "@tauri-apps/plugin-fs";
    import Icon from "./Icon.svelte";
    import { icons } from "../images";

    // this store the value of the input field, corresponding to the current path
    let currentPathInput = $state("");
    /// this variable is used as a fallback in case the path change is invalid
    /// so we can reset the input field to the last valid path
    let currentWorkingPath = $state("");

    let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    const SEARCH_DEBOUNCE_MS = 450;

    let fsWatcher: UnwatchFn | null = null;

    async function readHomeDir() {
        const homePath = await homeDir();
        currentPath.set(homePath);
        currentWorkingPath = homePath;
    }

    // this function is called when the user press enter in the input field
    async function handleInputSubmit() {
        await checkPageChange(
            currentWorkingPath,
            currentPathInput,
            (newPath) => {
                currentPath.set(newPath);
                currentWorkingPath = newPath;
                currentPathInput = newPath;
            },
        );
    }

    function toggleSearchMode() {
        searchMode.toggleSearchMode();
    }

    function queueSearch() {
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = null;
        }

        const currentState = get(searchMode);
        if (!currentState.isSearchMode) {
            return;
        }

        const query = currentState.searchQuery.trim();
        const rootPath = currentWorkingPath;

        if (!query || !rootPath) {
            searchMode.setSearchResults([]);
            searchMode.setIsSearching(false);
            searchMode.incrementSearchRequestId();
            return;
        }

        // Drop stale results immediately so typing does not trigger expensive
        // re-diffs over a large results grid on every key stroke.
        searchMode.setSearchResults([]);
        searchMode.setIsSearching(true);
        searchDebounceTimer = setTimeout(() => {
            void runSearch(query, rootPath);
        }, SEARCH_DEBOUNCE_MS);
    }

    async function runSearch(query: string, rootPath: string) {
        const currentState = get(searchMode);
        const activeRequestId = currentState.searchRequestId;

        try {
            const results = await searchForFileFolder(query, rootPath);
            const stateAfter = get(searchMode);
            if (activeRequestId === stateAfter.searchRequestId) {
                searchMode.setSearchResults(results.filter((item) => !item.isHidden));
            }
        } finally {
            const stateFinal = get(searchMode);
            if (activeRequestId === stateFinal.searchRequestId) {
                searchMode.setIsSearching(false);
            }
        }
    }

    async function stopWatchingCurrentFolder() {
        if (fsWatcher) {
            fsWatcher();
        }
        fsWatcher = null;
    }

    async function listenToCurrentFolder(newPath: string) {
        await stopWatchingCurrentFolder();

        if (!newPath) {
            return;
        }

        fsWatcher = await watch(
            newPath,
            async () => await refreshCurrentPathEntries(),
            {
                delayMs: 500,
            },
        );
    }

    onMount(() => {
        readHomeDir();
        // Register a listener to listen to the change in the current path
        const currPathSubscription = currentPath.subscribe((value) => {
            if (value == currentPathInput) return;
            currentPathInput = value;
            currentWorkingPath = value;
            // when the path change, we need to listen to the new folder
            listenToCurrentFolder(value);
        });

        return () => currPathSubscription();
    });

    onDestroy(() => {
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
        }
        void stopWatchingCurrentFolder();
    });

    function onItemDoubleClick(entry: RouteItem) {
        if (entry.isDir === false) return;
        currentPath.set(entry.fullPath);
    }
</script>

<div class="wrapper">
    <div class="header">
        <Icon
            src={icons.back}
            height={16}
            width={16}
            active={true}
            onClick={navigateUp}
        />
        {#if $searchMode.isSearchMode}
            <div class="route_input_wrapper">
                <input
                    type="text"
                    class="route_input"
                    placeholder="Search files and folders"
                    value={$searchMode.searchQuery}
                    oninput={(e) => {
                        searchMode.setSearchQuery(e.currentTarget.value);
                        queueSearch();
                    }}
                />
            </div>
        {:else}
            <form
                class="route_input_wrapper"
                onsubmit={(e) => {
                    e.preventDefault();
                    handleInputSubmit();
                }}
            >
                <input
                    type="text"
                    class="route_input"
                    bind:value={currentPathInput}
                />
            </form>
        {/if}
        <Icon
            src={icons.search}
            height={16}
            width={16}
            active={$searchMode.isSearchMode}
            onClick={toggleSearchMode}
        />
    </div>

    {#if $searchMode.isSearchMode}
        <div class="dir_contents">
            {#if !$searchMode.searchQuery.trim()}
                <p>Type to search in this folder.</p>
            {:else if $searchMode.isSearching}
                <p>Searching...</p>
            {:else if $searchMode.searchResults.length === 0}
                <p>No matching files or folders found.</p>
            {:else}
                {#each $searchMode.searchResults.slice(0, $searchMode.maxRenderedResults) as entry (entry.fullPath)}
                    <FileItem
                        routeItem={entry}
                        onDoubleClick={() => onItemDoubleClick(entry)}
                    />
                {/each}
                {#if $searchMode.searchResults.length > $searchMode.maxRenderedResults}
                    <p>
                        Showing first {$searchMode.maxRenderedResults} results. Refine
                        your query to narrow this down.
                    </p>
                {/if}
            {/if}
        </div>
    {:else}
        <div class="dir_contents">
            {#await $currentPathEntries}
                <p>Loading items</p>
            {:then entries}
                {#each entries as entry}
                    <FileItem
                        routeItem={entry}
                        onDoubleClick={() => onItemDoubleClick(entry)}
                    />
                {/each}
            {/await}
        </div>
    {/if}
</div>

<style>
    .wrapper {
        padding: 12px;
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .header {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.2rem;
    }
    .route_input_wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 65%;
    }
    .route_input {
        padding-inline: 8px;
        height: 36px;
        background-color: rgb(236, 236, 236);
        border: none;
        border-radius: 12px;
        width: 100%;
    }
    .dir_contents {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 12px;
        width: 100%;
    }
</style>
