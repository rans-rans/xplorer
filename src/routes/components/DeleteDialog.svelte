<script lang="ts">
    import { deleteItem } from "../file_folder_operations";
    import { refreshCurrentPathEntries } from "../store";
    import DialogBase from "./DialogBase.svelte";

    let { open, routeItem, onclose }: {
        open: boolean;
        routeItem: RouteItem;
        onclose: () => void;
    } = $props();

    async function confirm() {
        try {
            await deleteItem(routeItem.fullPath, routeItem.isDir);
            onclose();
            await refreshCurrentPathEntries();
        } catch (e) {
            alert(`Delete failed: ${e}`);
        }
    }
</script>

<DialogBase {open} label="Delete" {onclose}>
    <h3 class="dialog_title">Delete</h3>
    <p class="delete_message">
        Are you sure you want to delete <strong>{routeItem.name}</strong>?
        {#if routeItem.isDir}This will delete the folder and all its contents.{/if}
        This action cannot be undone.
    </p>
    <div class="dialog_actions">
        <button class="btn_secondary" onclick={onclose}>Cancel</button>
        <button class="btn_danger" onclick={confirm}>Delete</button>
    </div>
</DialogBase>

<style>
    .delete_message {
        font-size: 0.95rem;
        line-height: 1.5;
        user-select: none;
        white-space: normal;
    }
</style>
