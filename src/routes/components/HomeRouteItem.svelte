<script lang="ts">
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";

    let {
        name,
        icon,
        selected = false,
    }: { name: string; icon: string; selected?: boolean } = $props();

    let isActive = $state(false);

    onMount(() => {
        isActive = selected;
    });
</script>

<div class:item-active={isActive} class="item non_select">
    <Icon src={icon} height={16} width={16} active={true} />
    <p>{name}</p>
</div>

<style>
    .item {
        font-weight: bold;
        font-size: 12px;
        display: flex;
        gap: 0.9rem;
        align-items: center;
        padding: 0.55rem;
        border-radius: 10px;
        padding-left: 16px;
    }

    .item-active {
        color: white;
        background-image: linear-gradient(
            90deg,
            rgb(61, 168, 239),
            rgb(123, 172, 225)
        );
    }
</style>
