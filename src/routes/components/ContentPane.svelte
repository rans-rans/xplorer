<script lang="ts">
    import { homeDir } from "@tauri-apps/api/path";
    import FileItem from "./FileItem.svelte";
    import { onMount } from "svelte";
    import { currentPath, currentPathEntries } from "../store";
    import { checkPageChange } from "../file_folder_operations";

    let currPath = $state("");
    let currWorkingPath = $state("");

    async function readHomeDir() {
        const homePath = await homeDir();
        currentPath.set(homePath);
        currWorkingPath = homePath;
    }

    async function handleInputSubmit() {
        await checkPageChange(currWorkingPath, currPath, (newPath) => {
            currentPath.set(newPath);
            currWorkingPath = newPath;
        });
    }

    onMount(() => {
        readHomeDir();
        const currSub = currentPath.subscribe((value) => {
            currPath = value;
        });
        const entriesSub = currentPathEntries.subscribe((entries) => {
            entries;
        });
        return () => {
            entriesSub();
            currSub();
        };
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
        <input type="text" class="route_input" bind:value={currPath} />
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
