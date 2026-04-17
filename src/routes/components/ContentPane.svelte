<script lang="ts">
    import { homeDir } from "@tauri-apps/api/path";
    import FileItem from "./FileItem.svelte";
    import { onDestroy, onMount } from "svelte";
    import {
        currentPath,
        currentPathEntries,
        refreshCurrentPathEntries,
    } from "../store";
    import { checkPageChange } from "../file_folder_operations";
    import { watch, type UnwatchFn } from "@tauri-apps/plugin-fs";

    // this store the value of the input field, corresponding to the current path
    let currentPathInput = $state("");
    /// this variable is used as a fallback in case the path change is invalid
    /// so we can reset the input field to the last valid path
    let currentWorkingPath = $state("");

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
            // when the path change, we need to listen to the new folder
            listenToCurrentFolder(value);
        });

        return () => currPathSubscription();
    });

    onDestroy(() => {
        void stopWatchingCurrentFolder();
    });
</script>

<div class="wrapper">
    <form
        class="route_input_wrapper"
        onsubmit={(e) => {
            e.preventDefault();
            handleInputSubmit();
        }}
    >
        <input type="text" class="route_input" bind:value={currentPathInput} />
    </form>

    <div class="dir_contents">
        {#await $currentPathEntries}
            <p>Loading items</p>
        {:then entries}
            {#each entries as entry}
                <FileItem routeItem={entry} />
            {/each}
        {/await}
    </div>
</div>

<style>
    .wrapper {
        padding: 12px;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
    }
    .route_input_wrapper {
        display: flex;
        width: 100%;
        justify-content: center;
        position: sticky;
        top: 0;
        z-index: 10;
        padding-bottom: 12px;
        margin-bottom: 24px;
    }
    .route_input {
        padding-inline: 8px;
        height: 36px;
        background-color: rgb(236, 236, 236);
        border: none;
        border-radius: 12px;
        width: 55%;
    }
    .dir_contents {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 12px;
        width: 100%;
    }
</style>
