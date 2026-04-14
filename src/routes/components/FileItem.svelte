<script lang="ts">
    import { icons } from "../images";
    import Icon from "./Icon.svelte";

    let { isDir = false }: { isDir: boolean } = $props();
</script>

<div class="wrapper">
    {#if isDir}
        <Icon src={icons.folder} height={62} width={62} />
    {:else}
        <Icon src={icons.file} height={62} width={62} />
    {/if}
</div>

<style>
    .wrapper {
        padding: 8px;
        width: fit-content;
        border-radius: 12px;
    }
    .wrapper:hover{
        background:var(--primary-grey)
    }
</style>
