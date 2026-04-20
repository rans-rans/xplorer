<script lang="ts">
    import { onMount } from "svelte";
    import Icon from "./Icon.svelte";
    import { currentPath } from "../store";

    let {
        name,
        icon,
        onPathSet,
    }: {
        name: string;
        icon: string;
        onPathSet: () => Promise<string>;
    } = $props();

    let isActive = $state(false);
    let path = $state("");

    onMount(() => {
        onPathSet().then((newPath) => {
            path = newPath;
        });
        const currentPathSubscription = currentPath.subscribe((value) => {
            if (value === "" ) return;
            isActive = value.trim() === path.trim();
        });

        return () => currentPathSubscription();
    });

    async function handleClick() {
        if (isActive || path === "") return;
        currentPath.set(path);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={handleClick} class:item-active={isActive} class="item non_select">
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
