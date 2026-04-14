<script lang="ts">
    let {
        src,
        alt = "",
        height = 24,
        width = 24,
        active = false,
    }: {
        src: string;
        alt?: string;
        active?: boolean;
        height?: number;
        width?: number;
    } = $props();
</script>

<img {src} {alt} {width} {height} class:active />

<style>
    img {
        display: block;
    }
</style>
