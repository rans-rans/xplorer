<script lang="ts">
    import { icons } from "../images";
    import { currentPath } from "../store";
    import Icon from "./Icon.svelte";

    let {
        routeItem,
        onDoubleClick,
    }: { routeItem: RouteItem; onDoubleClick?: () => void } = $props();
</script>

<div
    class="wrapper"
    ondblclick={onDoubleClick}
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
