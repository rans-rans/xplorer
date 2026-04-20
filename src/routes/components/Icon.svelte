<script lang="ts">
    let {
        src,
        alt = "",
        height = 24,
        width = 24,
        active = false,
        onClick,
    }: {
        src: string;
        alt?: string;
        active?: boolean;
        height?: number;
        width?: number;
        onClick?: () => void;
    } = $props();
    // svelte-ignore state_referenced_locally
    let clickEnabled = onClick !== undefined;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class:clickable={clickEnabled} onclick={onClick}>
    <img {src} {alt} {width} {height} class:active />
</div>

<style>
    .clickable {
        padding: 8px;
    }
    .clickable:hover {
        background-color: var(--primary-grey);
        border-radius: 50%;
    }
    img {
        display: block;
    }
</style>
