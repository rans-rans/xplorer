<script lang="ts">
    import { dirname, join } from "@tauri-apps/api/path";
    import { renameItem } from "../file_folder_operations";
    import { refreshCurrentPathEntries } from "../store";
    import DialogBase from "./DialogBase.svelte";

    let { open, routeItem, onclose }: {
        open: boolean;
        routeItem: RouteItem;
        onclose: () => void;
    } = $props();

    let value = $state("");
    let error = $state("");
    let inputEl = $state<HTMLInputElement | null>(null);
    let prevOpen = $state(false);

    $effect(() => {
        if (open && !prevOpen) {
            value = routeItem.name;
            error = "";
            setTimeout(() => inputEl?.focus(), 0);
        }
        prevOpen = open;
    });

    async function submit() {
        const trimmed = value.trim();
        if (!trimmed) {
            error = "Name cannot be empty.";
            return;
        }
        if (trimmed === routeItem.name) {
            onclose();
            return;
        }
        if (/[/\\:*?"<>|]/.test(trimmed)) {
            error = 'Name contains invalid characters ( / \\ : * ? " < > | ).';
            return;
        }
        try {
            const parentDir = await dirname(routeItem.fullPath);
            const newPath = await join(parentDir, trimmed);
            await renameItem(routeItem.fullPath, newPath);
            onclose();
            await refreshCurrentPathEntries();
        } catch (e) {
            error = `Rename failed: ${e}`;
        }
    }

    function onkeydown(e: KeyboardEvent) {
        if (e.key === "Enter") submit();
        if (e.key === "Escape") onclose();
    }
</script>

<DialogBase {open} label="Rename" {onclose}>
    <h3 class="dialog_title">Rename</h3>
    <input
        class="rename_input"
        type="text"
        bind:value
        bind:this={inputEl}
        {onkeydown}
    />
    {#if error}
        <p class="rename_error">{error}</p>
    {/if}
    <div class="dialog_actions">
        <button class="btn_secondary" onclick={onclose}>Cancel</button>
        <button class="btn_primary" onclick={submit}>Rename</button>
    </div>
</DialogBase>

<style>
    .rename_input {
        width: 100%;
        padding: 8px 12px;
        border: 1.5px solid var(--primary-grey);
        border-radius: 8px;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 150ms;
    }
    .rename_input:focus {
        border-color: var(--primary-blue);
    }
    .rename_error {
        color: #d32f2f;
        font-size: 0.85rem;
        user-select: none;
    }
</style>
