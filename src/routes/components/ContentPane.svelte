<script lang="ts">
    import { BaseDirectory, homeDir, join } from "@tauri-apps/api/path";
    import FileItem from "./FileItem.svelte";
    import { readDir } from "@tauri-apps/plugin-fs";
    import { onMount } from "svelte";

    let currentPath = $state("");
    let loadingDir = $state(false);
    let entries: Array<RouteItem> = $state([]);

    async function readHomeDir() {
        loadingDir = true;
        try {
            currentPath = await homeDir();
            const rawEntries = await readDir(currentPath, {
                baseDir: BaseDirectory.Home,
            });
            entries = await Promise.all(
                rawEntries.map(async (entry) => ({
                    name: entry.name,
                    isDir: entry.isDirectory,
                    fullPath: await join(currentPath, entry.name),
                    isHidden: entry.name.startsWith("."),
                })),
            );
            entries = entries
                .filter((entry) => !entry.isHidden)
                .sort((a, b) => {
                    if (a.isDir && !b.isDir) return -1;
                    if (!a.isDir && b.isDir) return 1;
                    return a.name.localeCompare(b.name);
                });
        } catch (error) {
            console.log(`Error loading files ${error}`);
        } finally {
            loadingDir = false;
        }
    }

    onMount(() => {
        readHomeDir();
    });
</script>

<div class="wrapper">
    <div class="route_input_wrapper">
        <input type="text" class="route_input" />
    </div>
    <div class="dir_contents">
        {#each entries as entry}
            <FileItem routeItem={entry} />
        {/each}
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
        width: 100%;
        display: flex;
        justify-content: center;
        position: sticky;
        top: 0;
        z-index: 10;
        padding-bottom: 12px;
        margin-bottom: 24px;
    }
    .route_input {
        width: 55%;
        padding-block: 4px;
        padding-inline: 8px;
        height: 36px;
        background-color: rgb(236, 236, 236);
        border: none;
        border-radius: 12px;
    }
    .dir_contents {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 12px;
        width: 100%;
    }
</style>
