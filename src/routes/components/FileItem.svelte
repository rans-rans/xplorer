<script lang="ts">
    import { Menu } from "@tauri-apps/api/menu";
    import { PhysicalPosition } from "@tauri-apps/api/dpi";
    import { openPath } from "@tauri-apps/plugin-opener";
    import { currentPath } from "../store";
    import { icons } from "../images";
    import Icon from "./Icon.svelte";
    import RenameDialog from "./RenameDialog.svelte";
    import PropertiesDialog from "./PropertiesDialog.svelte";
    import DeleteDialog from "./DeleteDialog.svelte";

    let { routeItem }: { routeItem: RouteItem } = $props();

    let showRename = $state(false);
    let showProperties = $state(false);
    let showDelete = $state(false);

    async function showRightClickMenu(event: MouseEvent) {
        event.preventDefault();

        const menu = await Menu.new({
            id: Date.now().toString(),
            items: [
                { id: "open", text: "Open", action: () => onDoubleClick() },
                { id: "rename", text: "Rename", action: () => { showRename = true; } },
                { id: "props", text: "Properties", action: () => { showProperties = true; } },
                { id: "delete", text: "Delete", action: () => { showDelete = true; } },
            ],
        });

        menu.popup(new PhysicalPosition(event.screenX, event.screenY));
    }

    function onDoubleClick() {
        if (routeItem.isDir) {
            currentPath.set(routeItem.fullPath);
        } else {
            openPath(routeItem.fullPath);
        }
    }
</script>

<div
    class="wrapper"
    ondblclick={onDoubleClick}
    oncontextmenu={showRightClickMenu}
    role="button"
    tabindex="0"
    aria-label={`Open ${routeItem.name}`}
    aria-disabled={!routeItem.isDir}
>
    <div class="icon_slot">
        {#if routeItem.isDir}
            <Icon src={icons.folder} height={62} width={62} />
        {:else}
            <Icon src={icons.file} height={62} width={62} />
        {/if}
    </div>
    <p class="item_name">{routeItem.name}</p>
</div>

<RenameDialog open={showRename} {routeItem} onclose={() => (showRename = false)} />
<PropertiesDialog open={showProperties} {routeItem} onclose={() => (showProperties = false)} />
<DeleteDialog open={showDelete} {routeItem} onclose={() => (showDelete = false)} />

<style>
    .wrapper {
        width: 100%;
        padding: 8px;
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        word-wrap: break-word;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
        transition: 250ms;
    }
    .wrapper:hover {
        background: var(--primary-grey);
    }
    .item_name {
        margin: 0;
        width: 100%;
        text-align: center;
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: break-word;
        line-height: 1.2;
        max-height: 80px;
        overflow: hidden;
    }
    .icon_slot {
        height: 62px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }
</style>
