<script lang="ts">
    import { getFileStats, type FileStats } from "../file_folder_operations";
    import DialogBase from "./DialogBase.svelte";

    let { open, routeItem, onclose }: {
        open: boolean;
        routeItem: RouteItem;
        onclose: () => void;
    } = $props();

    let stats = $state<FileStats | null>(null);

    $effect(() => {
        if (open) {
            stats = null;
            getFileStats(routeItem.fullPath, routeItem.name, routeItem.isDir).then(
                (s) => (stats = s),
            );
        }
    });

    function formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }

    function formatDate(d: Date | null): string {
        if (!d) return "—";
        return d.toLocaleString();
    }
</script>

<DialogBase {open} label="Properties" {onclose}>
    <h3 class="dialog_title">Properties</h3>
    {#if stats}
        <table class="props_table">
            <tbody>
                <tr><td class="prop_label">Name</td><td class="prop_value">{stats.name}</td></tr>
                <tr><td class="prop_label">Type</td><td class="prop_value">{stats.isDir ? "Folder" : "File"}</td></tr>
                <tr><td class="prop_label">Location</td><td class="prop_value prop_path">{stats.fullPath}</td></tr>
                {#if !stats.isDir}
                    <tr><td class="prop_label">Size</td><td class="prop_value">{formatSize(stats.size)}</td></tr>
                {/if}
                <tr><td class="prop_label">Modified</td><td class="prop_value">{formatDate(stats.modified)}</td></tr>
                <tr><td class="prop_label">Created</td><td class="prop_value">{formatDate(stats.created)}</td></tr>
            </tbody>
        </table>
    {:else}
        <p class="props_loading">Loading…</p>
    {/if}
    <div class="dialog_actions">
        <button class="btn_primary" onclick={onclose}>Close</button>
    </div>
</DialogBase>

<style>
    .props_table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.88rem;
    }
    .props_table td {
        padding: 5px 6px;
        vertical-align: top;
    }
    .prop_label {
        color: #666;
        white-space: nowrap;
        font-weight: 500;
        width: 80px;
        user-select: none;
    }
    .prop_value {
        color: #222;
        word-break: break-all;
    }
    .prop_path {
        font-size: 0.8rem;
        color: #555;
    }
    .props_loading {
        color: #888;
        font-size: 0.9rem;
        user-select: none;
    }
</style>
