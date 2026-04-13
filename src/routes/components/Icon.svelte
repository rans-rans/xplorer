<script lang="ts">
    let { src, alt = "" }: { src: string; alt?: string } = $props();
</script>

<img src={src} alt={alt} />

<style>
    img {
        width: 24px;
        height: 24px;
    }
</style>
